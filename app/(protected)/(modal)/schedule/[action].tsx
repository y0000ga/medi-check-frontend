import { Pressable, StyleSheet, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import {
  Redirect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import Container from "@/components/ui/container";
import FieldInput from "@/components/ui/field-input";
import FieldPicker from "@/components/ui/field-picker";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import ModalHeader from "@/components/ui/modal-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DOSE_UNIT_LABELS } from "@/constants/medication";
import { routes } from "@/constants/route";
import {
  BUTTON_BY_ACTION,
  DEFAULT_SCHEDULE_FORM,
  DOSE_UNIT_OPTIONS,
  END_TYPE_LABEL,
  END_TYPE_OPTIONS,
  FREQUENCY_OPTIONS,
  TITLE_BY_ACTION,
  WEEKDAY_OPTIONS,
} from "@/constants/schedule";
import { fetchMedicationsByPatient } from "@/libs/api/medication";
import {
  fetchPatientOptions,
  getPatientList,
  PatientPickerOption,
} from "@/libs/api/patient";
import {
  createSchedule,
  deleteSchedule,
  fetchScheduleDetail,
  updateSchedule,
} from "@/libs/api/schedule";
import { useViewerStore } from "@/stores/viewer";
import {
  Action,
  DoseUnit,
  FrequencyUnit,
  Weekday,
} from "@/types/common";
import { ScheduleEndType } from "@/types/domain";
import {
  toScheduleFormValues,
  toSchedulePayload,
} from "@/utils/schedule";

const PAGE_SIZE = 20;
const CREATE_STEPS = [
  "Select patient",
  "Select medication",
  "Schedule details",
] as const;

const ScheduleModal = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    action?: string;
    id?: string;
  }>();
  const action = (params.action ?? Action.Info) as Action;
  const id = typeof params.id === "string" ? params.id : "";

  const isInfo = action === Action.Info;
  const isCreate = action === Action.Create;
  const isEditable =
    action === Action.Create || action === Action.Edit;
  const isWizardMode = action !== Action.Info;

  const viewerMode = useViewerStore((state) => state.mode);
  const viewerOwnPatient = useViewerStore(
    (state) => state.ownPatient,
  );
  const viewerSelectedPatientId = useViewerStore(
    (state) => state.selectedPatientId,
  );

  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [patientOptions, setPatientOptions] = useState<
    PatientPickerOption[]
  >([]);
  const [patientPageItems, setPatientPageItems] = useState<
    PatientPickerOption[]
  >([]);
  const [patientPage, setPatientPage] = useState(1);
  const [patientTotalPages, setPatientTotalPages] = useState(1);
  const [patientListLoading, setPatientListLoading] = useState(false);
  const [medicationOptions, setMedicationOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    let active = true;

    const loadPatients = async () => {
      const options = await fetchPatientOptions();

      if (!active) {
        return;
      }

      setPatientOptions(options);

      if (!isWizardMode) {
        setSchedule((current) => {
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
      }
    };

    loadPatients();

    return () => {
      active = false;
    };
  }, [
    isWizardMode,
    viewerMode,
    viewerOwnPatient?.id,
    viewerSelectedPatientId,
  ]);

  useEffect(() => {
    let active = true;

    const loadPatientPage = async () => {
      if (!isWizardMode) {
        return;
      }

      setPatientListLoading(true);
      try {
        const response = await getPatientList({
          page: patientPage,
          page_size: PAGE_SIZE,
          sort_by: "created_at",
          sort_order: "desc",
        });

        if (!active) {
          return;
        }

        const items = response.list.map((patient) => ({
          label: patient.name,
          value: patient.id,
          avatarUrl: patient.avatar_url,
          permissionLevel: patient.permission_level,
        }));

        setPatientPageItems(items);
        setPatientTotalPages(
          Math.max(1, Math.ceil(response.total_size / PAGE_SIZE)),
        );
        setSchedule((current) => {
          if (
            current.patientId &&
            (items.some((item) => item.value === current.patientId) ||
              current.patientId === viewerSelectedPatientId ||
              current.patientId === viewerOwnPatient?.id)
          ) {
            return current;
          }

          const preferredPatientId =
            viewerMode === "caregiver"
              ? viewerSelectedPatientId
              : viewerOwnPatient?.id;

          return {
            ...current,
            patientId:
              items.find((item) => item.value === preferredPatientId)
                ?.value ??
              items[0]?.value ??
              "",
          };
        });
      } finally {
        if (active) {
          setPatientListLoading(false);
        }
      }
    };

    loadPatientPage();

    return () => {
      active = false;
    };
  }, [
    isWizardMode,
    patientPage,
    viewerMode,
    viewerOwnPatient?.id,
    viewerSelectedPatientId,
  ]);

  useEffect(() => {
    let active = true;

    const loadMedications = async () => {
      if (!schedule.patientId) {
        setMedicationOptions([]);
        return;
      }

      const medications = await fetchMedicationsByPatient(
        schedule.patientId,
      );

      if (!active) {
        return;
      }

      const nextOptions = medications.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setMedicationOptions(nextOptions);
      setSchedule((current) => {
        if (
          current.medicationId &&
          nextOptions.some(
            (item) => item.value === current.medicationId,
          )
        ) {
          return current;
        }

        return {
          ...current,
          medicationId: nextOptions[0]?.value ?? "",
        };
      });
    };

    loadMedications();

    return () => {
      active = false;
    };
  }, [schedule.patientId]);

  useEffect(() => {
    if (isCreate) {
      setSchedule((current) => ({
        ...DEFAULT_SCHEDULE_FORM,
        patientId: current.patientId,
        medicationId: current.medicationId,
      }));
      return;
    }

    if (!id) {
      return;
    }

    let active = true;

    const loadSchedule = async () => {
      setLoading(true);
      try {
        const detail = await fetchScheduleDetail(id);

        if (!active) {
          return;
        }

        setSchedule(toScheduleFormValues(detail));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSchedule();

    return () => {
      active = false;
    };
  }, [id, isCreate]);

  const selectedPatient = useMemo(
    () =>
      [...patientOptions, ...patientPageItems].find(
        (item) => item.value === schedule.patientId,
      ),
    [patientOptions, patientPageItems, schedule.patientId],
  );
  const selectedMedicationLabel =
    medicationOptions.find(
      (item) => item.value === schedule.medicationId,
    )?.label ?? "";

  if (!isCreate && !id) {
    return <Redirect href={routes.protected.home} />;
  }

  const toggleWeekday = (weekday: Weekday) => {
    setSchedule((current) => ({
      ...current,
      weekdays: current.weekdays.includes(weekday)
        ? current.weekdays.filter((item) => item !== weekday)
        : [...current.weekdays, weekday].sort((a, b) => a - b),
    }));
  };

  const handleSave = async () => {
    if (!schedule.patientId) {
      setError("Please select a patient.");
      return;
    }

    if (!schedule.medicationId) {
      setError("Please select a medication.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const payload = toSchedulePayload(schedule);

      if (isCreate) {
        await createSchedule(payload);
      } else if (id) {
        await updateSchedule(id, payload);
      }

      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    setSaving(true);
    try {
      await deleteSchedule(id);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const payload = toSchedulePayload(schedule);

  const renderPatientSelection = () => (
    <>
      <View style={styles.stepHeader}>
        <ThemedText type="subtitle">Step 1 of 3</ThemedText>
        <ThemedText style={styles.stepDescription}>
          Pick the patient first, then we can narrow medications to
          the right person.
        </ThemedText>
      </View>

      {patientPageItems.map((patient) => {
        const selected = schedule.patientId === patient.value;

        return (
          <Pressable
            key={patient.value}
            style={[
              styles.selectionCard,
              selected && styles.selectionCardSelected,
            ]}
            onPress={() => {
              setSchedule((current) => ({
                ...current,
                patientId: patient.value,
                medicationId: "",
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
      })}

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
            patientPage >= patientTotalPages &&
              styles.disabledButton,
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

  const renderMedicationSelection = () => (
    <>
      <View style={styles.stepHeader}>
        <ThemedText type="subtitle">Step 2 of 3</ThemedText>
        <ThemedText style={styles.stepDescription}>
          Choose one medication under {selectedPatient?.label ?? "the selected patient"}.
        </ThemedText>
      </View>

      <View style={styles.selectedSummary}>
        <ThemedText style={styles.summaryLabel}>
          Selected patient
        </ThemedText>
        <ThemedText style={styles.summaryValue}>
          {selectedPatient?.label ?? "Not selected"}
        </ThemedText>
      </View>

      {medicationOptions.length ? (
        medicationOptions.map((medication) => {
          const selected =
            schedule.medicationId === medication.value;

          return (
            <Pressable
              key={medication.value}
              style={[
                styles.selectionCard,
                selected && styles.selectionCardSelected,
              ]}
              onPress={() => {
                setSchedule((current) => ({
                  ...current,
                  medicationId: medication.value,
                }));
                setError("");
              }}
            >
              <ThemedText style={styles.selectionTitle}>
                {medication.label}
              </ThemedText>
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
            No medications yet
          </ThemedText>
          <ThemedText style={styles.emptyStateText}>
            Create a medication for this patient first, then come
            back to add the schedule.
          </ThemedText>
        </View>
      )}
    </>
  );

  const renderForm = (showPickers: boolean) => (
    <>
      {isWizardMode ? (
        <View style={styles.stepHeader}>
          <ThemedText type="subtitle">Step 3 of 3</ThemedText>
          <ThemedText style={styles.stepDescription}>
            Set up the schedule details for the selected medication.
          </ThemedText>
        </View>
      ) : null}

      {showPickers ? (
        <>
          {isEditable ? (
            <FieldPicker<string>
              label="Patient"
              value={schedule.patientId}
              options={patientOptions.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
              onValueChange={(patientId) =>
                setSchedule((current) => ({
                  ...current,
                  patientId,
                  medicationId: "",
                }))
              }
              placeholder="Select a patient"
            />
          ) : (
            <FieldInput
              label="Patient"
              value={selectedPatient?.label ?? ""}
              onChangeText={() => {}}
              disabled
            />
          )}

          {isEditable ? (
            <FieldPicker<string>
              label="Medication"
              value={schedule.medicationId}
              options={medicationOptions}
              onValueChange={(medicationId) =>
                setSchedule((current) => ({
                  ...current,
                  medicationId,
                }))
              }
              placeholder="Select a medication"
              disabled={!schedule.patientId}
            />
          ) : (
            <FieldInput
              label="Medication"
              value={selectedMedicationLabel}
              onChangeText={() => {}}
              disabled
            />
          )}
        </>
      ) : (
        <>
          <View style={styles.selectedSummary}>
            <ThemedText style={styles.summaryLabel}>
              Selected patient
            </ThemedText>
            <ThemedText style={styles.summaryValue}>
              {selectedPatient?.label ?? "Not selected"}
            </ThemedText>
          </View>

          <View style={styles.selectedSummary}>
            <ThemedText style={styles.summaryLabel}>
              Selected medication
            </ThemedText>
            <ThemedText style={styles.summaryValue}>
              {selectedMedicationLabel || "Not selected"}
            </ThemedText>
          </View>
        </>
      )}

      <FieldInput
        label="Start Time"
        value={schedule.startAt}
        onChangeText={(startAt) =>
          setSchedule((current) => ({ ...current, startAt }))
        }
        placeholder="2026-04-03T08:00:00.000Z"
        disabled={!isEditable}
      />

      <FieldInput
        label="Time Slots"
        value={schedule.timeSlotsText}
        onChangeText={(timeSlotsText) =>
          setSchedule((current) => ({
            ...current,
            timeSlotsText,
          }))
        }
        placeholder="08:00, 13:00, 21:00"
        disabled={!isEditable}
      />

      <FieldInput
        label="Amount"
        value={schedule.amount}
        onChangeText={(amount) =>
          setSchedule((current) => ({ ...current, amount }))
        }
        placeholder="1"
        disabled={!isEditable}
      />

      {isEditable ? (
        <FieldPicker<DoseUnit>
          label="Dose Unit"
          value={(schedule.doseUnit || DoseUnit.Capsule) as DoseUnit}
          options={DOSE_UNIT_OPTIONS}
          onValueChange={(doseUnit) =>
            setSchedule((current) => ({ ...current, doseUnit }))
          }
          placeholder="Select a unit"
        />
      ) : (
        <FieldInput
          label="Dose Unit"
          value={
            schedule.doseUnit
              ? DOSE_UNIT_LABELS[schedule.doseUnit]
              : ""
          }
          onChangeText={() => {}}
          disabled
        />
      )}

      {isEditable ? (
        <FieldPicker<FrequencyUnit | "">
          label="Frequency"
          value={schedule.frequencyUnit}
          options={FREQUENCY_OPTIONS}
          onValueChange={(frequencyUnit) =>
            setSchedule((current) => ({
              ...current,
              frequencyUnit,
              interval: frequencyUnit ? current.interval || "1" : "1",
              endType: frequencyUnit
                ? current.endType || ScheduleEndType.never
                : "",
              untilDate: frequencyUnit ? current.untilDate : "",
              occurrenceCount: frequencyUnit
                ? current.occurrenceCount
                : "",
              weekdays:
                frequencyUnit === FrequencyUnit.Week
                  ? current.weekdays
                  : [],
            }))
          }
          placeholder="Select frequency"
        />
      ) : (
        <FieldInput
          label="Frequency"
          value={
            FREQUENCY_OPTIONS.find(
              (option) => option.value === schedule.frequencyUnit,
            )?.label ?? "One time"
          }
          onChangeText={() => {}}
          disabled
        />
      )}

      {schedule.frequencyUnit ? (
        <FieldInput
          label="Interval"
          value={schedule.interval}
          onChangeText={(interval) =>
            setSchedule((current) => ({ ...current, interval }))
          }
          placeholder="1"
          disabled={!isEditable}
        />
      ) : null}

      {schedule.frequencyUnit === FrequencyUnit.Week ? (
        <View style={styles.weekdaySection}>
          <ThemedText style={styles.sectionLabel}>
            Weekdays
          </ThemedText>
          <View style={styles.weekdayRow}>
            {WEEKDAY_OPTIONS.map((option) => {
              const selected = schedule.weekdays.includes(
                option.value,
              );

              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.weekdayChip,
                    selected && styles.weekdayChipSelected,
                  ]}
                  onPress={() =>
                    isEditable && toggleWeekday(option.value)
                  }
                  disabled={!isEditable}
                >
                  <ThemedText
                    style={[
                      styles.weekdayChipText,
                      selected &&
                        styles.weekdayChipTextSelected,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {schedule.frequencyUnit ? (
        isEditable ? (
          <FieldPicker<ScheduleEndType>
            label="End Type"
            value={schedule.endType || ScheduleEndType.never}
            options={END_TYPE_OPTIONS}
            onValueChange={(endType) =>
              setSchedule((current) => ({ ...current, endType }))
            }
          />
        ) : (
          <FieldInput
            label="End Type"
            value={
              END_TYPE_LABEL[
                schedule.endType || ScheduleEndType.never
              ]
            }
            onChangeText={() => {}}
            disabled
          />
        )
      ) : null}

      {schedule.frequencyUnit &&
      schedule.endType === ScheduleEndType.until ? (
        <FieldInput
          label="Until Date"
          value={schedule.untilDate}
          onChangeText={(untilDate) =>
            setSchedule((current) => ({ ...current, untilDate }))
          }
          placeholder="2026-04-30"
          disabled={!isEditable}
        />
      ) : null}

      {schedule.frequencyUnit &&
      schedule.endType === ScheduleEndType.count ? (
        <FieldInput
          label="Occurrences"
          value={schedule.occurrenceCount}
          onChangeText={(occurrenceCount) =>
            setSchedule((current) => ({
              ...current,
              occurrenceCount,
            }))
          }
          placeholder="10"
          disabled={!isEditable}
        />
      ) : null}

      {!isEditable ? (
        <View style={styles.summaryCard}>
          <ThemedText style={styles.summaryTitle}>
            Summary
          </ThemedText>
          <ThemedText style={styles.summaryText}>
            Start Time: {schedule.startAt}
          </ThemedText>
          <ThemedText style={styles.summaryText}>
            Time Slots: {schedule.timeSlotsText || "Not set"}
          </ThemedText>
          <ThemedText style={styles.summaryText}>
            Amount: {schedule.amount}{" "}
            {DOSE_UNIT_OPTIONS.find(
              (option) => option.value === schedule.doseUnit,
            )?.label ?? ""}
          </ThemedText>
          <ThemedText style={styles.summaryText}>
            Frequency:{" "}
            {FREQUENCY_OPTIONS.find(
              (option) => option.value === schedule.frequencyUnit,
            )?.label ?? "One time"}
          </ThemedText>
          {payload.weekdays?.length ? (
            <ThemedText style={styles.summaryText}>
              Weekdays:{" "}
              {payload.weekdays
                .map(
                  (weekday) =>
                    WEEKDAY_OPTIONS.find(
                      (option) => option.value === weekday,
                    )?.label,
                )
                .join(", ")}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
    </>
  );

  return (
    <>
      <FullScreenLoading
        visible={
          loading || saving || patientListLoading
        }
      />
      <ThemedView style={styles.container}>
        <ModalHeader
          title={TITLE_BY_ACTION[action]}
          leftIcon={
            isInfo ? (
              <Pressable
                onPress={() =>
                  router.push(routes.protected.modal.editSchedule(id))
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
            : null}
          {isWizardMode && stepIndex === 1
            ? renderMedicationSelection()
            : null}
          {!isWizardMode || stepIndex === 2
            ? renderForm(!isWizardMode)
            : null}

          {error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : null}
        </Container>
        <Header>
          {isWizardMode ? (
            <View style={styles.wizardFooter}>
              {stepIndex > 0 ? (
                <Pressable
                  style={styles.secondaryFooterButton}
                  onPress={() => setStepIndex((current) => current - 1)}
                >
                  <ThemedText style={styles.secondaryFooterButtonText}>
                    Back
                  </ThemedText>
                </Pressable>
              ) : (
                <View style={styles.footerSpacer} />
              )}

              <Pressable
                style={styles.primaryButton}
                onPress={() => {
                  if (stepIndex === 0) {
                    if (!schedule.patientId) {
                      setError("Please select a patient.");
                      return;
                    }

                    setError("");
                    setStepIndex(1);
                    return;
                  }

                  if (stepIndex === 1) {
                    if (!schedule.medicationId) {
                      setError("Please select a medication.");
                      return;
                    }

                    setError("");
                    setStepIndex(2);
                    return;
                  }

                  handleSave();
                }}
              >
                <ThemedText style={styles.primaryButtonText}>
                  {stepIndex === CREATE_STEPS.length - 1
                    ? BUTTON_BY_ACTION[action]
                    : "Continue"}
                </ThemedText>
              </Pressable>
            </View>
          ) : isEditable ? (
            <Pressable
              style={styles.primaryButton}
              onPress={handleSave}
            >
              <ThemedText style={styles.primaryButtonText}>
                {BUTTON_BY_ACTION[action]}
              </ThemedText>
            </Pressable>
          ) : (
            <Pressable
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <ThemedText style={styles.deleteButtonText}>
                {BUTTON_BY_ACTION[action]}
              </ThemedText>
            </Pressable>
          )}
        </Header>
      </ThemedView>
    </>
  );
};

export default ScheduleModal;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  primaryButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#3C83F6",
  },
  primaryButtonText: {
    color: "white",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
  deleteButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
  },
  deleteButtonText: {
    color: "white",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
  weekdaySection: {
    gap: 8,
  },
  sectionLabel: {
    color: "#334155",
  },
  weekdayRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  weekdayChip: {
    minWidth: 38,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  weekdayChipSelected: {
    backgroundColor: "#DBEAFE",
  },
  weekdayChipText: {
    color: "#475569",
    fontWeight: "600",
  },
  weekdayChipTextSelected: {
    color: "#2563EB",
  },
  summaryCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  summaryTitle: {
    color: "#0F172A",
    fontWeight: "700",
  },
  summaryText: {
    color: "#475569",
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
    justifyContent: "space-between",
    alignItems: "center",
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
