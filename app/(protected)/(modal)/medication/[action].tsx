import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";

import { medicationStyles } from "@/components/medication/index.style";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Container from "@/components/ui/container";
import FieldInput from "@/components/ui/field-input";
import FieldPicker from "@/components/ui/field-picker";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import ModalHeader from "@/components/ui/modal-header";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import {
  ACTION_BUTTON,
  ACTION_TITLE,
  CREATE_STEPS,
  EMPTY_MEDICATION,
  MEDICATION_DOSAGE_FORM,
} from "@/constants/medication";
import { routes } from "@/constants/route";
import {
  PatientPickerOption,
  useGetPatientListQuery,
} from "@/store/patient/api";
import {
  mapMedicationToFormValues,
  useCreateMedicationMutation,
  useDeleteMedicationMutation,
  useGetMedicationDetailQuery,
  useUpdateMedicationMutation,
} from "@/store/medication";

import { Action, DosageForm } from "@/types/common";

const MedicationModal = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    action?: string;
    id?: string;
  }>();
  const action = (params.action ?? Action.Info) as Action;
  const id = typeof params.id === "string" ? params.id : "";


  const [createMedication, createState] =
    useCreateMedicationMutation();
  const [updateMedication, updateState] =
    useUpdateMedicationMutation();
  const [deleteMedication, deleteState] =
    useDeleteMedicationMutation();
  const medicationDetailQuery = useGetMedicationDetailQuery(id, {
    skip: action === Action.Create || !id,
  });

  const [medication, setMedication] = useState(EMPTY_MEDICATION);
  const [patientPage, setPatientPage] = useState(1);
  const [patientFilter, setPatientFilter] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");

  const isInfoMode = action === Action.Info;
  const patientListQuery = useGetPatientListQuery({
    page: patientPage,
    page_size: DEFAULT_PAGE_SIZE,
    sort_by: "created_at",
    sort_order: "desc",
    search: patientFilter || null,
  });
  const patientOptions: PatientPickerOption[] = useMemo(
    () =>
      (patientListQuery.data?.list ?? []).map((patient) => ({
        label: patient.name,
        value: patient.id,
        avatarUrl: patient.avatar_url,
        permissionLevel: patient.permission_level,
      })),
    [patientListQuery.data?.list],
  );
  const patientPageItems = patientOptions;
  const patientTotalPages = Math.max(
    1,
    Math.ceil(
      (patientListQuery.data?.total_size ?? 0) / DEFAULT_PAGE_SIZE,
    ),
  );

  useEffect(() => {
    setPatientPage(1);
  }, [patientFilter]);

  useEffect(() => {
    if (!medicationDetailQuery.data) {
      return;
    }

    setMedication(mapMedicationToFormValues(medicationDetailQuery.data));
  }, [medicationDetailQuery.data]);

  const selectedPatient = useMemo(
    () =>
      [...patientOptions, ...patientPageItems].find(
        (item) => item.value === medication.patientId,
      ),
    [medication.patientId, patientOptions, patientPageItems],
  );

  useEffect(() => {
    if (!selectedPatient) {
      return;
    }

    setMedication((current) => ({
      ...current,
      patientName: selectedPatient.label,
    }));
  }, [selectedPatient]);

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

    const payload = {
      patientId: medication.patientId,
      name: medication.name.trim(),
      dosageForm: medication.dosageForm,
      note: medication.note.trim() || null,
    };

    setError("");

    if (action === Action.Create) {
      await createMedication(payload).unwrap();
      router.push(routes.protected.medication);
      return;
    }

    if (action === Action.Edit && id) {
      await updateMedication({
        id,
        changes: payload,
      }).unwrap();
      router.push(routes.protected.medication);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    await deleteMedication(id).unwrap();
    router.push(routes.protected.medication);
  };

  const renderPatientSelection = () => (
    <>
      <View style={medicationStyles.stepHeader}>
        <ThemedText type="subtitle">Step 1 of 2</ThemedText>
        <ThemedText style={medicationStyles.stepDescription}>
          Choose the patient before filling medication details.
        </ThemedText>
      </View>

      <View style={medicationStyles.filterSection}>
        <FieldInput
          value={patientFilter}
          onChangeText={setPatientFilter}
          placeholder="Search patients"
        />
      </View>

      {patientOptions.length ? (
        patientOptions.map((patient) => {
          const selected = medication.patientId === patient.value;

          return (
            <Pressable
              key={patient.value}
              style={[
                medicationStyles.selectionCard,
                selected && medicationStyles.selectionCardSelected,
              ]}
              onPress={() => {
                setMedication((current) => ({
                  ...current,
                  patientId: patient.value,
                  patientName: patient.label,
                }));
                setError("");
              }}
            >
              <View style={medicationStyles.selectionCardContent}>
                <ThemedText style={medicationStyles.selectionTitle}>
                  {patient.label}
                </ThemedText>
                <ThemedText style={medicationStyles.selectionMeta}>
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
        <View style={medicationStyles.emptyState}>
          <ThemedText style={medicationStyles.emptyStateTitle}>
            No patients found on this page
          </ThemedText>
          <ThemedText style={medicationStyles.emptyStateText}>
            Try a different keyword or move to another page.
          </ThemedText>
        </View>
      )}

      <View style={medicationStyles.paginationRow}>
        <Pressable
          style={[
            medicationStyles.secondaryButton,
            patientPage === 1 && medicationStyles.disabledButton,
          ]}
          onPress={() => setPatientPage((current) => current - 1)}
          disabled={patientPage === 1}
        >
          <ThemedText style={medicationStyles.secondaryButtonText}>
            Previous
          </ThemedText>
        </Pressable>
        <ThemedText style={medicationStyles.paginationText}>
          Page {patientPage} / {patientTotalPages}
        </ThemedText>
        <Pressable
          style={[
            medicationStyles.secondaryButton,
            patientPage >= patientTotalPages &&
              medicationStyles.disabledButton,
          ]}
          onPress={() => setPatientPage((current) => current + 1)}
          disabled={patientPage >= patientTotalPages}
        >
          <ThemedText style={medicationStyles.secondaryButtonText}>
            Next
          </ThemedText>
        </Pressable>
      </View>
    </>
  );

  const renderForm = (showPatientPicker: boolean) => (
    <>
      {!isInfoMode ? (
        <View style={medicationStyles.stepHeader}>
          <ThemedText type="subtitle">Step 2 of 2</ThemedText>
          <ThemedText style={medicationStyles.stepDescription}>
            Fill out the medication details for the selected patient.
          </ThemedText>
        </View>
      ) : null}

      {showPatientPicker ? (
        isInfoMode ? (
          <FieldInput
            label="Patient"
            value={selectedPatient?.label ?? medication.patientName}
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
              const patientName =
                patientOptions.find(
                  (item) => item.value === patientId,
                )?.label ?? "";

              setMedication((prev) => ({
                ...prev,
                patientId,
                patientName,
              }));
            }}
            placeholder="Select a patient"
          />
        )
      ) : (
        <View style={medicationStyles.selectedSummary}>
          <ThemedText style={medicationStyles.summaryLabel}>
            Selected patient
          </ThemedText>
          <ThemedText style={medicationStyles.summaryValue}>
            {(selectedPatient?.label ?? medication.patientName) ||
              "Not selected"}
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
        label="Note"
        placeholder="Optional notes"
        value={medication.note}
        onChangeText={(note) => {
          setMedication((prev) => ({ ...prev, note }));
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
          medicationDetailQuery.isFetching ||
          patientListQuery.isFetching ||
          createState.isLoading ||
          updateState.isLoading ||
          deleteState.isLoading
        }
      />
      <ThemedView style={medicationStyles.container}>
        <ModalHeader
          title={ACTION_TITLE[action]}
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
          {!isInfoMode && stepIndex === 0
            ? renderPatientSelection()
            : renderForm(isInfoMode)}

          {error ? (
            <ThemedText style={medicationStyles.errorText}>
              {error}
            </ThemedText>
          ) : null}
        </Container>

        <Header>
          {!isInfoMode ? (
            <View style={medicationStyles.wizardFooter}>
              {stepIndex > 0 ? (
                <Pressable
                  style={[medicationStyles.secondaryFooterButton]}
                  onPress={() =>
                    setStepIndex((current) => current - 1)
                  }
                >
                  <ThemedText
                    style={medicationStyles.secondaryFooterButtonText}
                  >
                    Back
                  </ThemedText>
                </Pressable>
              ) : (
                <View style={medicationStyles.footerSpacer} />
              )}

              <Pressable
                style={medicationStyles.actionButton}
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

                  void handleSave();
                }}
              >
                <ThemedText style={medicationStyles.actionButtonText}>
                  {stepIndex === CREATE_STEPS.length - 1
                    ? ACTION_BUTTON[action]
                    : "Continue"}
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[
                medicationStyles.actionButton,
                isInfoMode ? medicationStyles.deleteButton : null,
              ]}
              onPress={() => void handleDelete()}
            >
              <ThemedText style={medicationStyles.actionButtonText}>
                {ACTION_BUTTON[action]}
              </ThemedText>
            </Pressable>
          )}
        </Header>
      </ThemedView>
    </>
  );
};

export default MedicationModal;
