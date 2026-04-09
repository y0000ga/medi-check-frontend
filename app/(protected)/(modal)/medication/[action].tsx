import { Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";

import Container from "@/components/ui/container";
import FieldInput from "@/components/ui/field-input";
import FieldPicker from "@/components/ui/field-picker";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import ModalHeader from "@/components/ui/modal-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MEDICATION_DOSAGE_FORM } from "@/constants/medication";
import {
  fetchCarePatients,
  fetchOwnedPatient,
} from "@/libs/api/patient";
import { useMedicationStore } from "@/stores/medication";
import { useUserStore } from "@/stores/user";
import { useViewerStore } from "@/stores/viewer";
import { Action, DosageForm } from "@/types/common";
import { IRES_Medication } from "@/types/api";
import { routes } from "@/constants/route";

const TITLE: Record<Action, string> = {
  [Action.Create]: "新增藥物",
  [Action.Edit]: "編輯藥物",
  [Action.Info]: "藥物資訊",
};

const BUTTON: Record<Action, string> = {
  [Action.Create]: "儲存",
  [Action.Edit]: "儲存",
  [Action.Info]: "刪除藥物",
};

const EMPTY_MEDICATION: IRES_Medication = {
  id: "",
  patientId: "",
  name: "",
  dosageForm: DosageForm.Capsule,
  memo: "",
};

const MedicationModal = () => {
  const router = useRouter();
  const { params } = useRoute();
  const { action, id } = params as { action: Action; id?: string };

  const currentUser = useUserStore((state) => state.currentUser);
  const userLoading = useUserStore(
    (state) => state.isLoading.length > 0,
  );
  const viewerMode = useViewerStore((state) => state.mode);
  const viewerOwnPatient = useViewerStore(
    (state) => state.ownPatient,
  );
  const viewerSelectedPatientId = useViewerStore(
    (state) => state.selectedPatientId,
  );

  const addMedication = useMedicationStore(
    (state) => state.addMedication,
  );
  const editMedication = useMedicationStore(
    (state) => state.editMedication,
  );
  const removeMedication = useMedicationStore(
    (state) => state.removeMedication,
  );
  const loadMedicationDetail = useMedicationStore(
    (state) => state.loadMedicationDetail,
  );
  const selectedMedication = useMedicationStore(
    (state) => state.selectedMedication,
  );
  const medicationLoading = useMedicationStore(
    (state) => state.isLoading.length > 0,
  );

  const [medication, setMedication] = useState<IRES_Medication>({
    ...EMPTY_MEDICATION,
    id: id ?? "",
  });
  const [patientOptions, setPatientOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [error, setError] = useState("");

  const isInfoMode = action === Action.Info;

  useEffect(() => {
    let active = true;

    const loadPatientOptions = async () => {
      if (!currentUser) {
        return;
      }

      const [ownPatient, carePatients] = await Promise.all([
        fetchOwnedPatient(currentUser.id),
        fetchCarePatients(currentUser.id),
      ]);

      if (!active) {
        return;
      }

      const options = [
        ownPatient ? { label: "我自己", value: ownPatient.id } : null,
        ...carePatients.map((patient) => ({
          label: patient.patientName,
          value: patient.patientId,
        })),
      ].filter(
        (item): item is { label: string; value: string } =>
          item !== null,
      );

      setPatientOptions(options);
      setMedication((current) => {
        if (current.patientId) {
          return current;
        }

        const defaultPatientId =
          viewerMode === "caregiver"
            ? (viewerSelectedPatientId ?? options[0]?.value ?? "")
            : (viewerOwnPatient?.id ??
              ownPatient?.id ??
              options[0]?.value ??
              "");

        return {
          ...current,
          patientId: defaultPatientId,
        };
      });
    };

    loadPatientOptions();

    return () => {
      active = false;
    };
  }, [
    currentUser,
    viewerMode,
    viewerOwnPatient?.id,
    viewerSelectedPatientId,
  ]);

  useEffect(() => {
    if (action === Action.Create || !id) {
      return;
    }

    loadMedicationDetail(id);
  }, [action, id, loadMedicationDetail]);

  useEffect(() => {
    if (!selectedMedication || selectedMedication.id !== id) {
      return;
    }

    setMedication(selectedMedication);
  }, [id, selectedMedication]);

  if (action !== Action.Create && !id) {
    return <Redirect href={routes.protected.medication} />;
  }

  const handleSave = async () => {
    if (!medication.patientId) {
      setError("請先選擇服藥者。");
      return;
    }

    if (!medication.name.trim()) {
      setError("請先填寫藥物名稱。");
      return;
    }

    setError("");

    if (action === Action.Create) {
      await addMedication({
        patientId: medication.patientId,
        name: medication.name,
        dosageForm: medication.dosageForm,
        memo: medication.memo,
      });
      router.push(routes.protected.medication);
      return;
    }

    if (action === Action.Edit && id) {
      await editMedication(id, {
        patientId: medication.patientId,
        name: medication.name,
        dosageForm: medication.dosageForm,
        memo: medication.memo,
      });
      router.push(routes.protected.medication);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    await removeMedication(id);
    router.push(routes.protected.medication);
  };

  return (
    <>
      <FullScreenLoading visible={userLoading || medicationLoading} />
      <ThemedView style={styles.container}>
        <ModalHeader
          title={TITLE[action]}
          leftIcon={
            isInfoMode && id ? (
              <Pressable
                onPress={() =>
                  router.push(
                    routes.protected.modal.editMedication(id),
                  )
                }
              >
                <IconSymbol
                  color="#3C83F6"
                  size={28}
                  name="edit"
                />
              </Pressable>
            ) : undefined
          }
        />
        <Container>
          {isInfoMode ? (
            <FieldInput
              label="服藥者"
              value={
                patientOptions.find(
                  (item) => item.value === medication.patientId,
                )?.label ?? ""
              }
              onChangeText={() => {}}
              disabled
            />
          ) : (
            <FieldPicker<string>
              options={patientOptions}
              value={medication.patientId}
              label="服藥者"
              onValueChange={(patientId) => {
                setMedication((prev) => ({ ...prev, patientId }));
              }}
              placeholder="請選擇自己或病人"
            />
          )}

          <FieldInput
            label="藥物名稱"
            placeholder="例如 維他命 C"
            value={medication.name}
            onChangeText={(name) => {
              setMedication((prev) => ({ ...prev, name }));
            }}
            disabled={isInfoMode}
          />

          <FieldPicker<DosageForm>
            options={Object.values(DosageForm).map((value) => ({
              value,
              label: MEDICATION_DOSAGE_FORM[value],
            }))}
            value={medication.dosageForm}
            label="劑型"
            onValueChange={(dosageForm) => {
              setMedication((prev) => ({ ...prev, dosageForm }));
            }}
            disabled={isInfoMode}
          />

          <FieldInput
            label="備註"
            placeholder="可以補充服藥提醒、保存方式或其他資訊"
            value={medication.memo}
            onChangeText={(memo) => {
              setMedication((prev) => ({ ...prev, memo }));
            }}
            disabled={isInfoMode}
            multiline
            numberOfLines={4}
          />

          {error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : null}
        </Container>

        <Header>
          <Pressable
            style={[
              styles.actionButton,
              isInfoMode ? styles.deleteButton : styles.saveButton,
            ]}
            onPress={isInfoMode ? handleDelete : handleSave}
          >
            <ThemedText style={styles.actionButtonText}>
              {BUTTON[action]}
            </ThemedText>
          </Pressable>
        </Header>
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  actionButtonText: {
    color: "white",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
  actionButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#3C83F6",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  errorText: {
    color: "#DC2626",
    lineHeight: 20,
  },
});

export default MedicationModal;
