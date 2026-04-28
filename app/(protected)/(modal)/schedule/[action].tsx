import {
  Redirect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";

import { scheduleStyles } from "@/components/schedule/index.style";
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
import { DOSE_UNIT_LABELS } from "@/constants/medication";
import { routes } from "@/constants/route";
import {
  BUTTON_BY_ACTION,
  CREATE_STEPS,
  DEFAULT_SCHEDULE_FORM,
  DOSE_UNIT_OPTIONS,
  END_TYPE_LABEL,
  END_TYPE_OPTIONS,
  FREQUENCY_OPTIONS,
  TITLE_BY_ACTION,
  WEEKDAY_OPTIONS,
} from "@/constants/schedule";
import { useGetMedicationsByPatientQuery } from "@/store/medication/api";
import {
  PatientPickerOption,
  useGetPatientListQuery,
  useGetPatientOptionsQuery,
} from "@/store/patient/api";
import {
  useCreateMedicationScheduleMutation,
  useGetScheduleDetailQuery,
  useRemoveScheduleMutation,
  useEditScheduleMutation,
} from "@/store/schedule/api";
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

const ScheduleModal = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    action?: string;
    id?: string;
  }>();
  const action = (params.action ?? Action.Info) as Action;
  const id = typeof params.id === "string" ? params.id : "";

  const isCreate = action === Action.Create;
  const isEditable =
    action === Action.Create || action === Action.Edit;
  const isWizardMode = action !== Action.Info;

  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [patientPage, setPatientPage] = useState(1);
  const [patientFilter, setPatientFilter] = useState("");
  const [medicationFilter, setMedicationFilter] = useState("");

  const patientOptionsQuery = useGetPatientOptionsQuery();
  const patientOptions: PatientPickerOption[] =
    patientOptionsQuery.data?.list ?? [];

  const patientListQuery = useGetPatientListQuery(
    {
      page: patientPage,
      page_size: DEFAULT_PAGE_SIZE,
      sort_by: "created_at",
      sort_order: "desc",
      search: patientFilter || null,
    },
    { skip: !isWizardMode },
  );
  const patientPageItems: PatientPickerOption[] = useMemo(
    () =>
      (patientListQuery.data?.list ?? []).map((patient) => ({
        label: patient.name,
        value: patient.id,
        avatarUrl: patient.avatar_url,
        permissionLevel: patient.permission_level,
      })),
    [patientListQuery.data?.list],
  );
  const patientTotalPages = Math.max(
    1,
    Math.ceil(
      (patientListQuery.data?.total_size ?? 0) / DEFAULT_PAGE_SIZE,
    ),
  );

  useEffect(() => {
    setPatientPage(1);
  }, [patientFilter]);

  const medicationsQuery = useGetMedicationsByPatientQuery(
    {
      patientId: schedule.patientId,
      params: {
        page: 1,
        page_size: 20,
        sort_by: "created_at",
        sort_order: "desc",
        search: medicationFilter.trim() || null,
      },
    },
    { skip: !schedule.patientId },
  );

  const medicationOptions = useMemo(
    () =>
      (medicationsQuery.data?.list ?? []).map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [medicationsQuery.data?.list],
  );

  useEffect(() => {
    if (!schedule.patientId) {
      return;
    }

    setSchedule((current) => {
      if (
        current.medicationId &&
        medicationOptions.some(
          (item) => item.value === current.medicationId,
        )
      ) {
        return current;
      }

      return {
        ...current,
        medicationId: medicationOptions[0]?.value ?? "",
      };
    });
  }, [medicationOptions, schedule.patientId]);

  useEffect(() => {
    setMedicationFilter("");
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

    // noop, handled by query below
  }, [id, isCreate]);
  const scheduleDetailQuery = useGetScheduleDetailQuery(id, {
    skip: isCreate || !id,
  });
  const [createMedicationSchedule] =
    useCreateMedicationScheduleMutation();
  const [editSchedule] = useEditScheduleMutation();
  const [removeSchedule] = useRemoveScheduleMutation();

  useEffect(() => {
    if (scheduleDetailQuery.data) {
      setSchedule(toScheduleFormValues(scheduleDetailQuery.data));
    }
  }, [scheduleDetailQuery.data]);

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
      console.log(schedule);
      const payload = toSchedulePayload(schedule);
      console.log(payload);

      if (isCreate) {
        await createMedicationSchedule({
          medicationId: payload.medicationId,
          body: {
            timezone: payload.timezone,
            start_date: payload.startDate,
            time_slots: payload.timeSlots,
            amount: payload.amount,
            dose_unit: payload.doseUnit,
            frequency_unit: payload.frequencyUnit,
            interval: payload.interval,
            weekdays: payload.weekdays,
            end_type: payload.endType || null,
            until_date: payload.untilDate,
            occurrence_count: payload.occurrenceCount,
          },
        }).unwrap();
      } else if (id) {
        await editSchedule({
          scheduleId: id,
          body: {
            timezone: payload.timezone,
            start_date: payload.startDate,
            time_slots: payload.timeSlots,
            amount: payload.amount,
            dose_unit: payload.doseUnit,
            frequency_unit: payload.frequencyUnit,
            interval: payload.interval,
            weekdays: payload.weekdays,
            end_type: payload.endType || null,
            until_date: payload.untilDate,
            occurrence_count: payload.occurrenceCount,
          },
        }).unwrap();
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
      await removeSchedule(id).unwrap();
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const payload = toSchedulePayload(schedule);

  const renderPatientSelection = () => (
    <>
      <View style={scheduleStyles.stepHeader}>
        <ThemedText type="subtitle">Step 1 of 3</ThemedText>
        <ThemedText style={scheduleStyles.stepDescription}>
          Pick the patient first, then we can narrow medications to
          the right person.
        </ThemedText>
      </View>

      <FieldInput
        placeholder="依病患名稱搜尋"
        value={patientFilter}
        onChangeText={setPatientFilter}
      />

      {patientPageItems.length ? (
        patientPageItems.map((patient) => {
          const selected = schedule.patientId === patient.value;

          return (
            <Pressable
              key={patient.value}
              style={[
                scheduleStyles.selectionCard,
                selected && scheduleStyles.selectionCardSelected,
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
              <View style={scheduleStyles.selectionCardContent}>
                <ThemedText style={scheduleStyles.selectionTitle}>
                  {patient.label}
                </ThemedText>
                <ThemedText style={scheduleStyles.selectionMeta}>
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
        <View style={scheduleStyles.emptyState}>
          <ThemedText style={scheduleStyles.emptyStateTitle}>
            No patients found on this page
          </ThemedText>
          <ThemedText style={scheduleStyles.emptyStateText}>
            Try a different keyword or move to another page.
          </ThemedText>
        </View>
      )}

      <View style={scheduleStyles.paginationRow}>
        <Pressable
          style={[
            scheduleStyles.secondaryButton,
            patientPage === 1 && scheduleStyles.disabledButton,
          ]}
          onPress={() => setPatientPage((current) => current - 1)}
          disabled={patientPage === 1}
        >
          <ThemedText style={scheduleStyles.secondaryButtonText}>
            Previous
          </ThemedText>
        </Pressable>
        <ThemedText style={scheduleStyles.paginationText}>
          Page {patientPage} / {patientTotalPages}
        </ThemedText>
        <Pressable
          style={[
            scheduleStyles.secondaryButton,
            patientPage >= patientTotalPages &&
              scheduleStyles.disabledButton,
          ]}
          onPress={() => setPatientPage((current) => current + 1)}
          disabled={patientPage >= patientTotalPages}
        >
          <ThemedText style={scheduleStyles.secondaryButtonText}>
            Next
          </ThemedText>
        </Pressable>
      </View>
    </>
  );

  const renderMedicationSelection = () => (
    <>
      <View style={scheduleStyles.stepHeader}>
        <ThemedText type="subtitle">Step 2 of 3</ThemedText>
        <ThemedText style={scheduleStyles.stepDescription}>
          Choose one medication under{" "}
          {selectedPatient?.label ?? "the selected patient"}.
        </ThemedText>
      </View>

      <View style={scheduleStyles.selectedSummary}>
        <ThemedText style={scheduleStyles.summaryLabel}>
          Selected patient
        </ThemedText>
        <ThemedText style={scheduleStyles.summaryValue}>
          {selectedPatient?.label ?? "Not selected"}
        </ThemedText>
      </View>

      <FieldInput
        placeholder="依藥品名稱搜尋"
        value={medicationFilter}
        onChangeText={setMedicationFilter}
      />

      {medicationOptions.length ? (
        medicationOptions.map((medication) => {
          const selected = schedule.medicationId === medication.value;

          return (
            <Pressable
              key={medication.value}
              style={[
                scheduleStyles.selectionCard,
                selected && scheduleStyles.selectionCardSelected,
              ]}
              onPress={() => {
                setSchedule((current) => ({
                  ...current,
                  medicationId: medication.value,
                }));
                setError("");
              }}
            >
              <ThemedText style={scheduleStyles.selectionTitle}>
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
        <View style={scheduleStyles.emptyState}>
          <ThemedText style={scheduleStyles.emptyStateTitle}>
            No medications yet
          </ThemedText>
          <ThemedText style={scheduleStyles.emptyStateText}>
            Create a medication for this patient first, then come back
            to add the schedule.
          </ThemedText>
        </View>
      )}
    </>
  );

  const renderForm = (showPickers: boolean) => (
    <>
      {isWizardMode ? (
        <View style={scheduleStyles.stepHeader}>
          <ThemedText type="subtitle">Step 3 of 3</ThemedText>
          <ThemedText style={scheduleStyles.stepDescription}>
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
          <View style={scheduleStyles.selectedSummary}>
            <ThemedText style={scheduleStyles.summaryLabel}>
              Selected patient
            </ThemedText>
            <ThemedText style={scheduleStyles.summaryValue}>
              {selectedPatient?.label ?? "Not selected"}
            </ThemedText>
          </View>

          <View style={scheduleStyles.selectedSummary}>
            <ThemedText style={scheduleStyles.summaryLabel}>
              Selected medication
            </ThemedText>
            <ThemedText style={scheduleStyles.summaryValue}>
              {selectedMedicationLabel || "Not selected"}
            </ThemedText>
          </View>
        </>
      )}

      <FieldInput
        label="開始日期"
        value={schedule.startDate}
        onChangeText={(startDate) =>
          setSchedule((current) => ({ ...current, startDate }))
        }
        placeholder="2026-04-03"
        disabled={!isEditable}
      />

      <FieldInput
        label="時段"
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
                : null,
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
        <View style={scheduleStyles.weekdaySection}>
          <ThemedText style={scheduleStyles.sectionLabel}>
            Weekdays
          </ThemedText>
          <View style={scheduleStyles.weekdayRow}>
            {WEEKDAY_OPTIONS.map((option) => {
              const selected = schedule.weekdays.includes(
                option.value,
              );

              return (
                <Pressable
                  key={option.value}
                  style={[
                    scheduleStyles.weekdayChip,
                    selected && scheduleStyles.weekdayChipSelected,
                  ]}
                  onPress={() =>
                    isEditable && toggleWeekday(option.value)
                  }
                  disabled={!isEditable}
                >
                  <ThemedText
                    style={[
                      scheduleStyles.weekdayChipText,
                      selected &&
                        scheduleStyles.weekdayChipTextSelected,
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
        <View style={scheduleStyles.summaryCard}>
          <ThemedText style={scheduleStyles.summaryTitle}>
            Summary
          </ThemedText>
          <ThemedText style={scheduleStyles.summaryText}>
            Start Time: {schedule.startDate}
          </ThemedText>
          <ThemedText style={scheduleStyles.summaryText}>
            Time Slots: {schedule.timeSlotsText || "Not set"}
          </ThemedText>
          <ThemedText style={scheduleStyles.summaryText}>
            Amount: {schedule.amount}{" "}
            {DOSE_UNIT_OPTIONS.find(
              (option) => option.value === schedule.doseUnit,
            )?.label ?? ""}
          </ThemedText>
          <ThemedText style={scheduleStyles.summaryText}>
            Frequency:{" "}
            {FREQUENCY_OPTIONS.find(
              (option) => option.value === schedule.frequencyUnit,
            )?.label ?? "One time"}
          </ThemedText>
          {payload.weekdays?.length ? (
            <ThemedText style={scheduleStyles.summaryText}>
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
          saving ||
          medicationsQuery.isFetching ||
          patientListQuery.isFetching ||
          patientOptionsQuery.isFetching ||
          scheduleDetailQuery.isFetching
        }
      />
      <ThemedView style={scheduleStyles.container}>
        <ModalHeader
          title={TITLE_BY_ACTION[action]}
          leftIcon={
            !isWizardMode ? (
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
            <ThemedText style={scheduleStyles.errorText}>
              {error}
            </ThemedText>
          ) : null}
        </Container>
        <Header>
          {isWizardMode ? (
            <View style={scheduleStyles.wizardFooter}>
              {stepIndex > 0 ? (
                <Pressable
                  style={scheduleStyles.secondaryFooterButton}
                  onPress={() =>
                    setStepIndex((current) => current - 1)
                  }
                >
                  <ThemedText
                    style={scheduleStyles.secondaryFooterButtonText}
                  >
                    Back
                  </ThemedText>
                </Pressable>
              ) : (
                <View style={scheduleStyles.footerSpacer} />
              )}

              <Pressable
                style={scheduleStyles.primaryButton}
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
                <ThemedText style={scheduleStyles.primaryButtonText}>
                  {stepIndex === CREATE_STEPS.length - 1
                    ? BUTTON_BY_ACTION[action]
                    : "Continue"}
                </ThemedText>
              </Pressable>
            </View>
          ) : isEditable ? (
            <Pressable
              style={scheduleStyles.primaryButton}
              onPress={handleSave}
            >
              <ThemedText style={scheduleStyles.primaryButtonText}>
                {BUTTON_BY_ACTION[action]}
              </ThemedText>
            </Pressable>
          ) : (
            <Pressable
              style={scheduleStyles.deleteButton}
              onPress={handleDelete}
            >
              <ThemedText style={scheduleStyles.deleteButtonText}>
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
