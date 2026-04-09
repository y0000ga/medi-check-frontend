import { Pressable, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
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
import { fetchMedicationsByPatient } from "@/libs/api/medication";
import {
  fetchCarePatients,
  fetchOwnedPatient,
} from "@/libs/api/patient";
import {
  createSchedule,
  deleteSchedule,
  fetchScheduleDetail,
  updateSchedule,
} from "@/libs/api/schedule";
import { useUserStore } from "@/stores/user";
import { useViewerStore } from "@/stores/viewer";
import {
  Action,
  DoseUnit,
  FrequencyUnit,
  Weekday,
} from "@/types/common";
import { ScheduleEndType } from "@/types/domain";
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
import { DOSE_UNIT_LABELS } from "@/constants/medication";
import {
  toScheduleFormValues,
  toSchedulePayload,
} from "@/utils/schedule";
import { routes } from "@/constants/route";

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

  const currentUser = useUserStore((state) => state.currentUser);
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
  const [patientOptions, setPatientOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [medicationOptions, setMedicationOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    let active = true;

    const loadPatients = async () => {
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
      setSchedule((current) => {
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

    loadPatients();

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

      setMedicationOptions(
        medications.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      );
    };

    loadMedications();

    return () => {
      active = false;
    };
  }, [schedule.patientId]);

  useEffect(() => {
    if (!medicationOptions.length) {
      return;
    }

    if (
      schedule.medicationId &&
      medicationOptions.some(
        (item) => item.value === schedule.medicationId,
      )
    ) {
      return;
    }

    setSchedule((current) => ({
      ...current,
      medicationId: medicationOptions[0]?.value ?? "",
    }));
  }, [medicationOptions, schedule.medicationId]);

  useEffect(() => {
    if (isCreate) {
      setSchedule((current) => ({
        ...DEFAULT_SCHEDULE_FORM,
        patientId: current.patientId,
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

        if (!active || !detail) {
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
      setError("請先選擇服藥者。");
      return;
    }

    if (!schedule.medicationId) {
      setError("請先選擇藥物。");
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
  const selectedPatientLabel =
    patientOptions.find((item) => item.value === schedule.patientId)
      ?.label ?? "";
  const selectedMedicationLabel =
    medicationOptions.find(
      (item) => item.value === schedule.medicationId,
    )?.label ?? schedule.medicationId;

  return (
    <>
      <FullScreenLoading visible={loading || saving} />
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
          {isEditable ? (
            <FieldPicker<string>
              label="服藥者"
              value={schedule.patientId}
              options={patientOptions}
              onValueChange={(patientId) =>
                setSchedule((current) => ({
                  ...current,
                  patientId,
                  medicationId: "",
                }))
              }
              placeholder="請選擇自己或病人"
            />
          ) : (
            <FieldInput
              label="服藥者"
              value={selectedPatientLabel}
              onChangeText={() => {}}
              disabled
            />
          )}

          {isEditable ? (
            <FieldPicker<string>
              label="藥物"
              value={schedule.medicationId}
              options={medicationOptions}
              onValueChange={(medicationId) =>
                setSchedule((current) => ({
                  ...current,
                  medicationId,
                }))
              }
              placeholder="請選擇藥物"
              disabled={!schedule.patientId}
            />
          ) : (
            <FieldInput
              label="藥物"
              value={selectedMedicationLabel}
              onChangeText={() => {}}
              disabled
            />
          )}

          <FieldInput
            label="開始時間"
            value={schedule.startAt}
            onChangeText={(startAt) =>
              setSchedule((current) => ({ ...current, startAt }))
            }
            placeholder="例如 2026-04-03T08:00:00.000Z"
            disabled={!isEditable}
          />

          <FieldInput
            label="每日服藥時段"
            value={schedule.timeSlotsText}
            onChangeText={(timeSlotsText) =>
              setSchedule((current) => ({
                ...current,
                timeSlotsText,
              }))
            }
            placeholder="例如 08:00, 13:00, 21:00"
            disabled={!isEditable}
          />

          <FieldInput
            label="每次服用量"
            value={schedule.amount}
            onChangeText={(amount) =>
              setSchedule((current) => ({ ...current, amount }))
            }
            placeholder="例如 1"
            disabled={!isEditable}
          />

          {isEditable ? (
            <FieldPicker<DoseUnit>
              label="單位"
              value={
                (schedule.doseUnit || DoseUnit.Capsule) as DoseUnit
              }
              options={DOSE_UNIT_OPTIONS}
              onValueChange={(doseUnit) =>
                setSchedule((current) => ({ ...current, doseUnit }))
              }
              placeholder="請選擇單位"
            />
          ) : (
            <FieldInput
              label="單位"
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
              label="提醒類型"
              value={schedule.frequencyUnit}
              options={FREQUENCY_OPTIONS}
              onValueChange={(frequencyUnit) =>
                setSchedule((current) => ({
                  ...current,
                  frequencyUnit,
                  interval: frequencyUnit
                    ? current.interval || "1"
                    : "1",
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
              placeholder="請選擇提醒類型"
            />
          ) : (
            <FieldInput
              label="提醒類型"
              value={
                FREQUENCY_OPTIONS.find(
                  (option) => option.value === schedule.frequencyUnit,
                )?.label ?? "單次提醒"
              }
              onChangeText={() => {}}
              disabled
            />
          )}

          {schedule.frequencyUnit ? (
            <FieldInput
              label="間隔"
              value={schedule.interval}
              onChangeText={(interval) =>
                setSchedule((current) => ({ ...current, interval }))
              }
              placeholder="例如 1"
              disabled={!isEditable}
            />
          ) : null}

          {schedule.frequencyUnit === FrequencyUnit.Week ? (
            <View style={styles.weekdaySection}>
              <ThemedText style={styles.sectionLabel}>
                每週提醒日
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
                          selected && styles.weekdayChipTextSelected,
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
                label="結束方式"
                value={schedule.endType || ScheduleEndType.never}
                options={END_TYPE_OPTIONS}
                onValueChange={(endType) =>
                  setSchedule((current) => ({ ...current, endType }))
                }
              />
            ) : (
              <FieldInput
                label="結束方式"
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

          {schedule.frequencyUnit && schedule.endType === "until" ? (
            <FieldInput
              label="結束日期"
              value={schedule.untilDate}
              onChangeText={(untilDate) =>
                setSchedule((current) => ({ ...current, untilDate }))
              }
              placeholder="例如 2026-04-30T00:00:00.000Z"
              disabled={!isEditable}
            />
          ) : null}

          {schedule.frequencyUnit && schedule.endType === "count" ? (
            <FieldInput
              label="提醒次數"
              value={schedule.occurrenceCount}
              onChangeText={(occurrenceCount) =>
                setSchedule((current) => ({
                  ...current,
                  occurrenceCount,
                }))
              }
              placeholder="例如 10"
              disabled={!isEditable}
            />
          ) : null}

          {!isEditable ? (
            <View style={styles.summaryCard}>
              <ThemedText style={styles.summaryTitle}>
                提醒摘要
              </ThemedText>
              <ThemedText style={styles.summaryText}>
                開始時間：{schedule.startAt}
              </ThemedText>
              <ThemedText style={styles.summaryText}>
                每日時段：{schedule.timeSlotsText || "未設定"}
              </ThemedText>
              <ThemedText style={styles.summaryText}>
                每次服用量：{schedule.amount}{" "}
                {DOSE_UNIT_OPTIONS.find(
                  (option) => option.value === schedule.doseUnit,
                )?.label ?? ""}
              </ThemedText>
              <ThemedText style={styles.summaryText}>
                提醒類型：
                {FREQUENCY_OPTIONS.find(
                  (option) => option.value === schedule.frequencyUnit,
                )?.label ?? "單次提醒"}
              </ThemedText>
              {payload.weekdays?.length ? (
                <ThemedText style={styles.summaryText}>
                  每週提醒日：
                  {payload.weekdays
                    .map(
                      (weekday) =>
                        WEEKDAY_OPTIONS.find(
                          (option) => option.value === weekday,
                        )?.label,
                    )
                    .join("、")}
                </ThemedText>
              ) : null}
            </View>
          ) : null}

          {error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : null}
        </Container>
        <Header>
          {isEditable ? (
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
    width: "100%",
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
});
