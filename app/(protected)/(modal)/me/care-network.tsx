import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { router } from "expo-router";

import Container from "@/components/ui/container";
import FieldInput from "@/components/ui/field-input";
import FieldPicker from "@/components/ui/field-picker";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import ModalHeader from "@/components/ui/modal-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useUserStore } from "@/stores/user";
import {
  createCarePatient,
  fetchCareManagementPatients,
  fetchIncomingCareInvitations,
  inviteCaregiver,
  removeCaregiver,
  updateCaregiverPermission,
  type CareManagementPatient,
} from "@/libs/api/patient";
import { IInvite, PermissionLevel } from "@/types/care";
import { PERMISSION_OPTIONS } from "@/constants/care";
import InviteCard from "@/components/care-network/InviteCard";
import PatientCard from "@/components/care-network/PatientCard";

const CareNetworkModal = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const loadCurrentUser = useUserStore(
    (state) => state.loadCurrentUser,
  );
  const userLoading = useUserStore(
    (state) => state.isLoading.length > 0,
  );

  const [patients, setPatients] = useState<CareManagementPatient[]>(
    [],
  );
  const [invites, setInvites] = useState<IInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientBirthDate, setNewPatientBirthDate] = useState("");
  const [newPatientNote, setNewPatientNote] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] =
    useState<PermissionLevel>(PermissionLevel.read);
  const [patientFeedback, setPatientFeedback] = useState("");
  const [patientError, setPatientError] = useState("");
  const [inviteFeedback, setInviteFeedback] = useState("");
  const [inviteError, setInviteError] = useState("");

  const loadData = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const [patientItems, inviteItems] = await Promise.all([
        fetchCareManagementPatients(userId),
        fetchIncomingCareInvitations(userId),
      ]);

      setPatients(patientItems);
      setInvites(inviteItems);
      setSelectedPatientId((current) => {
        if (
          current &&
          patientItems.some(
            (item) => item.patientId === current && item.canManage,
          )
        ) {
          return current;
        }

        return (
          patientItems.find((item) => item.canManage)?.patientId ?? ""
        );
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      loadCurrentUser();
      return;
    }

    loadData(currentUser.id);
  }, [currentUser, loadCurrentUser, loadData]);

  const manageablePatients = useMemo(
    () => patients.filter((patient) => patient.canManage),
    [patients],
  );

  const patientOptions = useMemo(
    () =>
      manageablePatients.map((patient) => ({
        label: patient.patientName,
        value: patient.patientId,
      })),
    [manageablePatients],
  );

  const clearStatus = () => {
    setPatientFeedback("");
    setPatientError("");
    setInviteFeedback("");
    setInviteError("");
  };

  const handleCreatePatient = async () => {
    if (!currentUser) {
      return;
    }

    try {
      setPatientError("");
      setPatientFeedback("");
      setInviteFeedback("");
      setInviteError("");

      const result = await createCarePatient({
        creatorUserId: currentUser.id,
        patientName: newPatientName,
        birthDate: newPatientBirthDate,
        note: newPatientNote,
      });

      setNewPatientName("");
      setNewPatientBirthDate("");
      setNewPatientNote("");
      setSelectedPatientId(result.patient.id);
      setPatientFeedback("已新增病人，現在可以繼續邀請照顧者。");
      await loadData(currentUser.id);
    } catch (createError) {
      setPatientError(
        createError instanceof Error
          ? createError.message
          : "新增病人失敗",
      );
    }
  };

  const handleInvite = async () => {
    if (!currentUser) {
      return;
    }

    if (!selectedPatientId) {
      setInviteError("請先選擇要邀請照顧者的病人");
      return;
    }

    if (!inviteEmail.trim()) {
      setInviteError("請輸入照顧者 Email");
      return;
    }

    try {
      setInviteError("");
      setInviteFeedback("");
      setPatientError("");
      setPatientFeedback("");

      await inviteCaregiver({
        patientId: selectedPatientId,
        caregiverEmail: inviteEmail,
        permissionLevel: invitePermission,
      });

      setInviteEmail("");
      setInvitePermission(PermissionLevel.read);
      setInviteFeedback("邀請已送出");
      await loadData(currentUser.id);
    } catch (inviteActionError) {
      setInviteError(
        inviteActionError instanceof Error
          ? inviteActionError.message
          : "邀請照顧者失敗",
      );
    }
  };

  const handleUpdatePermission = async (
    relationshipId: string,
    permissionLevel: PermissionLevel,
  ) => {
    if (!currentUser) {
      return;
    }

    try {
      clearStatus();
      await updateCaregiverPermission(
        relationshipId,
        permissionLevel,
      );
      setInviteFeedback("照顧者權限已更新");
      await loadData(currentUser.id);
    } catch (updateError) {
      setInviteError(
        updateError instanceof Error
          ? updateError.message
          : "更新權限失敗",
      );
    }
  };

  const handleRemoveCaregiver = async (relationshipId: string) => {
    if (!currentUser) {
      return;
    }

    try {
      clearStatus();
      await removeCaregiver(relationshipId);
      setInviteFeedback("照顧者已移除");
      await loadData(currentUser.id);
    } catch (removeError) {
      setInviteError(
        removeError instanceof Error
          ? removeError.message
          : "移除照顧者失敗",
      );
    }
  };

  return (
    <>
      <FullScreenLoading visible={userLoading || loading} />
      <ThemedView style={styles.screen}>
        <ModalHeader title="照護網路" />
        <ScrollView>
          <Container>
            <View style={styles.heroCard}>
              <ThemedText style={styles.heroTitle}>
                照顧者與病人關係
              </ThemedText>
              <ThemedText style={styles.heroText}>
                在這裡管理病人的照顧者，包含新增病人、邀請新照顧者、調整權限，以及移除不再需要的關係。
              </ThemedText>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <ThemedText style={styles.summaryValue}>
                  {manageablePatients.length}
                </ThemedText>
                <ThemedText style={styles.summaryLabel}>
                  可管理病人
                </ThemedText>
              </View>
              <View style={styles.summaryCard}>
                <ThemedText style={styles.summaryValue}>
                  {invites.length}
                </ThemedText>
                <ThemedText style={styles.summaryLabel}>
                  待接受邀請
                </ThemedText>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                新增病人
              </ThemedText>
              <View style={styles.inviteCard}>
                <FieldInput
                  label="病人姓名"
                  value={newPatientName}
                  onChangeText={setNewPatientName}
                  placeholder="例如：王媽媽"
                />
                <FieldInput
                  label="生日"
                  value={newPatientBirthDate}
                  onChangeText={setNewPatientBirthDate}
                  placeholder="YYYY-MM-DD"
                />
                <FieldInput
                  label="備註"
                  value={newPatientNote}
                  onChangeText={setNewPatientNote}
                  placeholder="例如：需要家人協助用藥管理"
                  multiline
                  numberOfLines={4}
                />
                {patientFeedback ? (
                  <ThemedText style={styles.feedbackText}>
                    {patientFeedback}
                  </ThemedText>
                ) : null}
                {patientError ? (
                  <ThemedText style={styles.errorText}>
                    {patientError}
                  </ThemedText>
                ) : null}
                <Pressable
                  style={styles.secondaryAction}
                  onPress={handleCreatePatient}
                >
                  <ThemedText style={styles.secondaryActionText}>
                    新增病人
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                邀請照顧者
              </ThemedText>
              <View style={styles.inviteCard}>
                <FieldPicker<string>
                  label="病人"
                  value={selectedPatientId}
                  options={patientOptions}
                  placeholder="請選擇病人"
                  onValueChange={(value) =>
                    setSelectedPatientId(value)
                  }
                  disabled={patientOptions.length === 0}
                />
                <FieldInput
                  label="照顧者 Email"
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <FieldPicker<PermissionLevel>
                  label="權限"
                  value={invitePermission}
                  options={PERMISSION_OPTIONS}
                  onValueChange={(value) =>
                    setInvitePermission(value)
                  }
                />
                {inviteFeedback ? (
                  <ThemedText style={styles.feedbackText}>
                    {inviteFeedback}
                  </ThemedText>
                ) : null}
                {inviteError ? (
                  <ThemedText style={styles.errorText}>
                    {inviteError}
                  </ThemedText>
                ) : null}
                <Pressable
                  style={styles.primaryAction}
                  onPress={handleInvite}
                >
                  <ThemedText style={styles.primaryActionText}>
                    送出邀請
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            {invites.length > 0 ? (
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>
                  待接受邀請
                </ThemedText>
                <View style={styles.listCard}>
                  {invites.map((invite, index) => (
                    <InviteCard
                      key={invite.relationshipId}
                      invite={invite}
                      isLast={index === invites.length - 1}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                病人與照顧者
              </ThemedText>
              {patients.map((patient) => (
                <PatientCard
                  key={patient.patientId}
                  patient={patient}
                  onPermissionChange={(relationShipId, value) =>
                    handleUpdatePermission(relationShipId, value)
                  }
                  onCaregiverRemove={(relationShipId) =>
                    handleRemoveCaregiver(relationShipId)
                  }
                />
              ))}
            </View>
          </Container>
        </ScrollView>
        <Header>
          <Pressable
            style={styles.doneButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.doneButtonText}>
              完成
            </ThemedText>
          </Pressable>
        </Header>
      </ThemedView>
    </>
  );
};

export default CareNetworkModal;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  heroCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  heroTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  heroText: {
    color: "#64748B",
    lineHeight: 22,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
    gap: 4,
  },
  summaryValue: {
    color: "#2563EB",
    fontSize: 24,
    fontWeight: "700",
  },
  summaryLabel: {
    color: "#64748B",
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  inviteCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 18,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  feedbackText: {
    color: "#15803D",
    lineHeight: 20,
  },
  errorText: {
    color: "#DC2626",
    lineHeight: 20,
  },
  primaryAction: {
    borderRadius: 8,
    backgroundColor: "#3C83F6",
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryActionText: {
    color: "white",
    fontWeight: "700",
  },
  secondaryAction: {
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryActionText: {
    color: "#0F172A",
    fontWeight: "700",
  },
  listCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  doneButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#3C83F6",
  },
  doneButtonText: {
    color: "white",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
});
