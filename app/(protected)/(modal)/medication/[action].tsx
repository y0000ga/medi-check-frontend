import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
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
import { routes } from "@/constants/route";
import {
  getPatientList,
  PatientPickerOption,
} from "@/libs/api/patient";
import { useMedicationStore } from "@/stores/medication";
import { useUserStore } from "@/stores/user";
import { useViewerStore } from "@/stores/viewer";
import { Action, DosageForm } from "@/types/common";
import { IRES_Medication } from "@/types/api";

const TITLE: Record<Action, string> = {
  [Action.Create]: "Create Medication",
  [Action.Edit]: "Edit Medication",
  [Action.Info]: "Medication Detail",
};

const BUTTON: Record<Action, string> = {
  [Action.Create]: "Create",
  [Action.Edit]: "Save",
  [Action.Info]: "Delete Medication",
};

const EMPTY_MEDICATION: IRES_Medication = {
  id: "",
  patientId: "",
  name: "",
  dosageForm: DosageForm.Capsule,
  memo: "",
};

const CREATE_STEPS = [
  "Select patient",
  "Medication details",
] as const;

const PAGE_SIZE = 20;

const MedicationModal = () => {
  const router = useRouter();
  const { params } = useRoute();
  const { action, id } = params as { action: Action; id?: string };

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
    PatientPickerOption[]
  >([]);
  const [patientPageItems, setPatientPageItems] = useState<
    PatientPickerOption[]
  >([]);
  const [patientPage, setPatientPage] = useState(1);
  const [patientTotalPages, setPatientTotalPages] = useState(1);
  const [patientListLoading, setPatientListLoading] = useState(false);
  const [patientFilter, setPatientFilter] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");

  const isInfoMode = action === Action.Info;
  const isCreateMode = action === Action.Create;
  const isWizardMode = action !== Action.Info;

  useEffect(() => {
    let active = true;

    const loadOptions = async () => {
      setPatientListLoading(true);
      try {
        const response = await getPatientList({
          page: patientPage,
          page_size: PAGE_SIZE,
          sort_by: "created_at",
          sort_order: "desc",
          name: patientFilter || null,
        });

        if (!active) {
          return;
        }

        const options = response.list.map((patient) => ({
          label: patient.name,
          value: patient.id,
          avatarUrl: patient.avatar_url,
          permissionLevel: patient.permission_level,
        }));

        setPatientOptions(options);
        setPatientPageItems(options);
        setPatientTotalPages(
          Math.max(1, Math.ceil(response.total_size / PAGE_SIZE)),
        );

        setMedication((current) => {
          if (current.patientId) {
            return current;
          }

          const defaultPatientId =
            viewerMode === "caregiver"
              ? (viewerSelectedPatientId ?? options[0]?.value ?? "")
              : (viewerOwnPatient?.id ?? options[0]?.value ?? "");

          return {
            ...current,
            patientId: defaultPatientId,
          };
        });
      } finally {
        if (active) {
          setPatientListLoading(false);
        }
      }
    };

    loadOptions();

    return () => {
      active = false;
    };
  }, [
    patientPage,
    viewerMode,
    viewerOwnPatient?.id,
    viewerSelectedPatientId,
    patientFilter,
  ]);

  useEffect(() => {
    setPatientPage(1);
  }, [patientFilter]);

  useEffect(() => {
    if (action === Action.Create || !id) {
      return;
    }

    console.log('here')

    loadMedicationDetail(id);
  }, [action, id, loadMedicationDetail]);

  useEffect(() => {
    if (!selectedMedication || selectedMedication.id !== id) {
      return;
    }

    setMedication(selectedMedication);
  }, [id, selectedMedication]);

  const selectedPatient = useMemo(
    () =>
      [...patientOptions, ...patientPageItems].find(
        (item) => item.value === medication.patientId,
      ),
    [medication.patientId, patientOptions, patientPageItems],
  );

  if (action !== Action.Create && !id) {
    return <Redirect href={routes.protected.medication} />;
  }

  const handleSave = async () => {
    if (!medication.patientId) {
      setError("Please select a patient.");
      return;
    }

    if (!medication.name.trim()) {
      setError("Please enter a medication name.");
      return;
    }

    setError("");

    if (action === Action.Create) {
      await addMedication({
        patientId: medication.patientId,
        name: medication.name.trim(),
        dosageForm: medication.dosageForm,
        memo: medication.memo.trim(),
      });
      router.push(routes.protected.medication);
      return;
    }

    if (action === Action.Edit && id) {
      await editMedication(id, {
        patientId: medication.patientId,
        name: medication.name.trim(),
        dosageForm: medication.dosageForm,
        memo: medication.memo.trim(),
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

  const renderPatientSelection = () => (
    <>
      <View style={styles.stepHeader}>
        <ThemedText type="subtitle">Step 1 of 2</ThemedText>
        <ThemedText style={styles.stepDescription}>
          Choose the patient before filling medication details.
        </ThemedText>
      </View>

      <View style={styles.filterSection}>
        <ThemedText style={styles.filterLabel}>
          Filter patients on this page
        </ThemedText>
        <TextInput
          style={styles.filterInput}
          value={patientFilter}
          onChangeText={setPatientFilter}
          placeholder="Search by patient name"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {patientOptions.length ? (
        patientOptions.map((patient) => {
          const selected = medication.patientId === patient.value;

          return (
            <Pressable
              key={patient.value}
              style={[
                styles.selectionCard,
                selected && styles.selectionCardSelected,
              ]}
              onPress={() => {
                setMedication((current) => ({
                  ...current,
                  patientId: patient.value,
                }));
                setError("");
              }}
            >
              <View style={styles.selectionCardContent}>
                <ThemedText style={styles.selectionTitle}>
                  {patient.label}
                </ThemedText>
                <ThemedText style={styles.selectionMeta}>
                  Permission: {patient.permissionLevel}
                </ThemedText>
              </View>
              {selected ? (
                <IconSymbol
                  name="check-circle"
                  size={22}
                  color="#2563EB"
                />
              ) : null}
            </Pressable>
          );
        })
      ) : (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateTitle}>
            No patients found on this page
          </ThemedText>
          <ThemedText style={styles.emptyStateText}>
            Try a different keyword or move to another page.
          </ThemedText>
        </View>
      )}

      <View style={styles.paginationRow}>
        <Pressable
          style={[
            styles.secondaryButton,
            patientPage === 1 && styles.disabledButton,
          ]}
          onPress={() => setPatientPage((current) => current - 1)}
          disabled={patientPage === 1}
        >
          <ThemedText style={styles.secondaryButtonText}>
            Previous
          </ThemedText>
        </Pressable>
        <ThemedText style={styles.paginationText}>
          Page {patientPage} / {patientTotalPages}
        </ThemedText>
        <Pressable
          style={[
            styles.secondaryButton,
            patientPage >= patientTotalPages && styles.disabledButton,
          ]}
          onPress={() => setPatientPage((current) => current + 1)}
          disabled={patientPage >= patientTotalPages}
        >
          <ThemedText style={styles.secondaryButtonText}>
            Next
          </ThemedText>
        </Pressable>
      </View>
    </>
  );

  const renderForm = (showPatientPicker: boolean) => (
    <>
      {isWizardMode ? (
        <View style={styles.stepHeader}>
          <ThemedText type="subtitle">Step 2 of 2</ThemedText>
          <ThemedText style={styles.stepDescription}>
            Fill out the medication details for the selected patient.
          </ThemedText>
        </View>
      ) : null}

      {showPatientPicker ? (
        isInfoMode ? (
          <FieldInput
            label="Patient"
            value={selectedPatient?.label ?? ""}
            onChangeText={() => {}}
            disabled
          />
        ) : (
          <FieldPicker<string>
            options={patientOptions.map((item) => ({
              label: item.label,
              value: item.value,
            }))}
            value={medication.patientId}
            label="Patient"
            onValueChange={(patientId) => {
              setMedication((prev) => ({ ...prev, patientId }));
            }}
            placeholder="Select a patient"
          />
        )
      ) : (
        <View style={styles.selectedSummary}>
          <ThemedText style={styles.summaryLabel}>
            Selected patient
          </ThemedText>
          <ThemedText style={styles.summaryValue}>
            {selectedPatient?.label ?? "Not selected"}
          </ThemedText>
        </View>
      )}

      <FieldInput
        label="Medication name"
        placeholder="Vitamin C"
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
        label="Dosage form"
        onValueChange={(dosageForm) => {
          setMedication((prev) => ({ ...prev, dosageForm }));
        }}
        disabled={isInfoMode}
      />

      <FieldInput
        label="Memo"
        placeholder="Optional notes"
        value={medication.memo}
        onChangeText={(memo) => {
          setMedication((prev) => ({ ...prev, memo }));
        }}
        disabled={isInfoMode}
        multiline
        numberOfLines={4}
      />
    </>
  );

  return (
    <>
      <FullScreenLoading
        visible={
          userLoading || medicationLoading || patientListLoading
        }
      />
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
          {isWizardMode && stepIndex === 0
            ? renderPatientSelection()
            : renderForm(!isWizardMode)}

          {error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : null}
        </Container>

        <Header>
          {isWizardMode ? (
            <View style={styles.wizardFooter}>
              {stepIndex > 0 ? (
                <Pressable
                  style={[styles.secondaryFooterButton]}
                  onPress={() =>
                    setStepIndex((current) => current - 1)
                  }
                >
                  <ThemedText
                    style={styles.secondaryFooterButtonText}
                  >
                    Back
                  </ThemedText>
                </Pressable>
              ) : (
                <View style={styles.footerSpacer} />
              )}

              <Pressable
                style={styles.actionButton}
                onPress={() => {
                  if (stepIndex === 0) {
                    if (!medication.patientId) {
                      setError("Please select a patient.");
                      return;
                    }

                    setError("");
                    setStepIndex(1);
                    return;
                  }

                  handleSave();
                }}
              >
                <ThemedText style={styles.actionButtonText}>
                  {stepIndex === CREATE_STEPS.length - 1
                    ? BUTTON[action]
                    : "Continue"}
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[
                styles.actionButton,
                isInfoMode ? styles.deleteButton : null,
              ]}
              onPress={isInfoMode ? handleDelete : handleSave}
            >
              <ThemedText style={styles.actionButtonText}>
                {BUTTON[action]}
              </ThemedText>
            </Pressable>
          )}
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
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#3C83F6",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  errorText: {
    color: "#DC2626",
    lineHeight: 20,
  },
  stepHeader: {
    gap: 4,
  },
  stepDescription: {
    color: "#64748B",
    lineHeight: 20,
  },
  selectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  selectionCardSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  selectionCardContent: {
    flex: 1,
    gap: 4,
  },
  selectionTitle: {
    color: "#0F172A",
    fontWeight: "700",
  },
  selectionMeta: {
    color: "#64748B",
  },
  filterSection: {
    gap: 8,
  },
  filterLabel: {
    color: "#475569",
    fontWeight: "600",
  },
  filterInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0F172A",
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  secondaryButtonText: {
    color: "#334155",
    fontWeight: "600",
  },
  paginationText: {
    color: "#64748B",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyState: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F8FAFC",
    gap: 6,
  },
  emptyStateTitle: {
    color: "#0F172A",
    fontWeight: "700",
  },
  emptyStateText: {
    color: "#64748B",
    lineHeight: 20,
  },
  selectedSummary: {
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    padding: 16,
    gap: 4,
  },
  summaryLabel: {
    color: "#64748B",
  },
  summaryValue: {
    color: "#0F172A",
    fontWeight: "700",
  },
  wizardFooter: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },
  secondaryFooterButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  secondaryFooterButtonText: {
    color: "#334155",
    textAlign: "center",
    fontWeight: "700",
  },
  footerSpacer: {
    flex: 1,
  },
});

export default MedicationModal;
