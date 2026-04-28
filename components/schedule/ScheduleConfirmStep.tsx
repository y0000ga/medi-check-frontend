import { AppButton } from "@/components/ui/AppButton";
import { dosageFormLabelMap } from "@/features/medication/dosageFormOptions";
import { DosageForm } from "@/features/medication/types";
import { getEndTypeLabel } from "@/features/schedule/scheduleOptions";
import {
  FrequencyUnit,
  ScheduleEndType,
  ScheduleFormRequest,
} from "@/features/schedule/types";
import { useAppTheme } from "@/shared/theme/theme";
import { formatTimeSlots } from "@/utils/common";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import InfoRow from "../ui/InfoRow";

type ScheduleConfirmMode = "create" | "edit";

type ScheduleConfirmPatient = {
  id: string;
  name: string;
};

type ScheduleConfirmMedication = {
  id: string;
  name: string;
  dosageForm: DosageForm;
  patientId: string;
  patientName: string;
};

type ScheduleConfirmStepProps = {
  mode: ScheduleConfirmMode;
  selectedPatient: ScheduleConfirmPatient;
  selectedMedication: ScheduleConfirmMedication;
  form: ScheduleFormRequest;
  error?: string;
  isSubmitting?: boolean;
  onBack: () => void;
  onSubmit: () => void;
};

const getFrequencyUnitLabel = (value?: FrequencyUnit | null) => {
  switch (value) {
    case FrequencyUnit.day:
      return "天";
    case FrequencyUnit.week:
      return "週";
    case FrequencyUnit.month:
      return "月";
    case FrequencyUnit.year:
      return "年";
    default:
      return "未設定";
  }
};

export function ScheduleConfirmStep({
  mode,
  selectedPatient,
  selectedMedication,
  form,
  error,
  isSubmitting = false,
  onBack,
  onSubmit,
}: ScheduleConfirmStepProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isRecurring = form.endType !== null;

  const title = mode === "create" ? "確認新增排程" : "確認修改排程";
  const description =
    mode === "create"
      ? "請確認所有資訊無誤後，再建立排程。"
      : "請確認修改內容無誤後，再儲存排程。";

  const submitLabel = mode === "create" ? "確認建立" : "確認儲存";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {error && (
        <View style={styles.formErrorBox}>
          <Text style={styles.formErrorText}>{error}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>照護對象</Text>
        <InfoRow label="名稱" value={selectedPatient.name} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>藥品</Text>
        <InfoRow label="名稱" value={selectedMedication.name} />
        <InfoRow
          label="劑型"
          value={
            dosageFormLabelMap[
              selectedMedication.dosageForm || DosageForm.Other
            ]
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>時間規則</Text>
        <InfoRow label="開始日期" value={form.startDate} />
        <InfoRow label="服藥時間" value={formatTimeSlots(form.timeSlots)} />
        <InfoRow label="劑量" value={`${form.amount} ${form.doseUnit}`} />
        <InfoRow label="排程類型" value={getEndTypeLabel(form.endType)} />

        {isRecurring && (
          <>
            <InfoRow
              label="重複頻率"
              value={`每 ${form.interval} ${getFrequencyUnitLabel(
                form.frequencyUnit,
              )}`}
            />

            {form.frequencyUnit === FrequencyUnit.week && (
              <InfoRow label="星期" value={(form.weekdays ?? []).join("、")} />
            )}

            {form.endType === ScheduleEndType.until && (
              <InfoRow label="結束日期" value={form.untilDate || "未設定"} />
            )}

            {form.endType === ScheduleEndType.counts && (
              <InfoRow
                label="發生次數"
                value={String(form.occurrenceCount ?? "未設定")}
              />
            )}
          </>
        )}
      </View>

      <View style={styles.actions}>
        <AppButton
          title="上一步"
          variant="secondary"
          onPress={onBack}
          disabled={isSubmitting}
          style={styles.actionButton}
        />

        <AppButton
          title={submitLabel}
          onPress={onSubmit}
          loading={isSubmitting}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: theme.spacing.lg,
    },

    header: {
      gap: theme.spacing.xs,
    },

    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
    },

    description: {
      ...theme.typography.body,
      color: theme.colors.textMuted,
    },

    formErrorBox: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.error,
      backgroundColor: theme.colors.errorSoft,
    },

    formErrorText: {
      ...theme.typography.captionStrong,
      color: theme.colors.error,
    },

    card: {
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    cardTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },

    infoLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    infoValue: {
      flex: 1,
      ...theme.typography.captionStrong,
      color: theme.colors.text,
      textAlign: "right",
    },

    actions: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },

    actionButton: {
      flex: 1,
    },
  });
