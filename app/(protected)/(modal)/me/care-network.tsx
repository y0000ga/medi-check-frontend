import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import Container from "@/components/ui/container";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import ModalHeader from "@/components/ui/modal-header";
import { createCarePatient } from "@/libs/api/patient";
import { useUserStore } from "@/stores/user";
import { IInvite } from "@/types/care";

import AddPatientForm from "@/components/care-network/AddPatientForm";
import InviteCard from "@/components/care-network/InviteCard";
import InviteForm from "@/components/care-network/InviteForm";
import RelationShipCard from "@/components/care-network/RelationShipCard";
import SectionCard from "@/components/care-network/SectionCard";
import {
  createInvitation,
  getInvitationList,
} from "@/libs/api/care-invitation";
import { getCareRelationships } from "@/libs/api/care-relationship";
import { createInvtationSchema } from "@/schemas/care-inviation";
import { createPatientSchema } from "@/schemas/patient";
import {
  IInvitation,
  InvationStatus,
  InvitationDirection,
  PermissionLevel,
  Role,
} from "@/types/api/care-invitation";
import { ICareRelationship } from "@/types/api/care-relationship";
import { ICreateInvitationInput } from "@/types/schemas/care-invitation";
import { ICreatePatientInput } from "@/types/schemas/patient";
import { IPaginationResponse } from "@/types/api/base";

const CareNetworkModal = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const userLoading = useUserStore(
    (state) => state.isLoading.length > 0,
  );

  const [relationsInfo, setRelationshipsInfo] = useState<
    IPaginationResponse<ICareRelationship>
  >({
    page: 1,
    total_size: 0,
    list: [],
  });
  const [inviteInfo, setInviteInfo] = useState<
    IPaginationResponse<IInvitation>
  >({
    page: 1,
    total_size: 0,
    list: [],
  });
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [relationship, invitation] = await Promise.all([
        getCareRelationships({
          page: 1,
          page_size: 10,
          sort_by: "created_at",
          sort_order: "desc",
          permission_level: PermissionLevel.Write,
          direction: Role.Patient,
        }),
        getInvitationList({
          page: 1,
          page_size: 10,
          sort_by: "created_at",
          sort_order: "desc",
          direction: InvitationDirection.received,
          status: InvationStatus.pending,
        }),
      ]);

      setRelationshipsInfo(relationship);
      setInviteInfo(invitation);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreatePatient = async (input: ICreatePatientInput) => {
    const body = createPatientSchema(input);
    await createCarePatient(body);
    await loadData();
  };

  const handleInvite = async (
    role: Role,
    input: ICreateInvitationInput,
  ) => {
    const body = createInvtationSchema(input);
    await createInvitation(role, body);
    await loadData();
  };

  const handleUpdatePermission = async (
    relationshipId: string,
    permissionLevel: PermissionLevel,
  ) => {
    // if (!currentUser) {
    //   return;
    // }
    // try {
    //   await updateCaregiverPermission(
    //     relationshipId,
    //     permissionLevel,
    //   );
    //   setInviteFeedback("照顧者權限已更新");
    //   await loadData();
    // } catch (updateError) {
    //   setInviteError(
    //     updateError instanceof Error
    //       ? updateError.message
    //       : "更新權限失敗",
    //   );
    // }
  };

  const handleRemoveCaregiver = async (relationshipId: string) => {
    if (!currentUser) {
      return;
    }

    // try {
    //   await removeCaregiver(relationshipId);
    //   setInviteFeedback("照顧者已移除");
    //   await loadData();
    // } catch (removeError) {
    //   setInviteError(
    //     removeError instanceof Error
    //       ? removeError.message
    //       : "移除照顧者失敗",
    //   );
    // }
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
                  {relationsInfo.total_size}
                </ThemedText>
                <ThemedText style={styles.summaryLabel}>
                  照護關係
                </ThemedText>
              </View>
              <View style={styles.summaryCard}>
                <ThemedText style={styles.summaryValue}>
                  {inviteInfo.total_size}
                </ThemedText>
                <ThemedText style={styles.summaryLabel}>
                  待接受邀請
                </ThemedText>
              </View>
            </View>

            <SectionCard title="新增無帳號病人">
              <View style={styles.inviteCard}>
                <AddPatientForm onConfirm={handleCreatePatient} />
              </View>
            </SectionCard>

            <SectionCard title="邀請照顧者/病人">
              <View style={styles.inviteCard}>
                <InviteForm onConfirm={handleInvite} />
              </View>
            </SectionCard>

            {inviteInfo.list.length > 0 ? (
              <SectionCard title="待接受邀請">
                <View style={styles.listCard}>
                  {inviteInfo.list.map((invite, index) => (
                    <InviteCard
                      key={invite.id}
                      invite={invite}
                      isLast={index === inviteInfo.list.length - 1}
                    />
                  ))}
                </View>
              </SectionCard>
            ) : null}

            <SectionCard title="病人與照顧者">
              {relationsInfo.list.map((relationship) => (
                <RelationShipCard
                  userRole={
                    currentUser?.patient_id ===
                    relationship.patient_id
                      ? Role.Patient
                      : Role.CareGiver
                  }
                  key={relationship.id}
                  relationship={relationship}
                  onPermissionChange={() => {
                    // handleUpdatePermission(relationship.id, value);
                  }}
                  onCaregiverRemove={() => {
                    // handleRemoveCaregiver(relationship.id)
                  }}
                />
              ))}
            </SectionCard>
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
