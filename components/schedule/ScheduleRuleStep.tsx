import { AppButton } from "@/components/ui/AppButton";
import { AppDateField } from "@/components/form/AppDateField";
import { AppSelectField } from "@/components/form/AppSelectField";
import { AppTextField } from "@/components/form/AppTextField";
import { ScheduleTimeSlotsPickerField } from "@/components/schedule/ScheduleTimeSlotsPickerField";
import {
  FrequencyUnit,
  ScheduleEndType,
  ScheduleFormRequest,
} from "@/features/schedule/types";
import { ScheduleFormErrors } from "@/features/schedule/validators";
import { useAppTheme } from "@/shared/theme/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  DOSE_UNIT_OPTIONS,
  endTypeOptions,
  frequencyUnitOptions,
} from "@/features/medication/dosageFormOptions";
import { formatDateToYYYYMMDD, parseDate } from "@/utils/common";

type ScheduleRuleStepMode = "create" | "edit";

type ScheduleRuleStepProps = {
  mode: ScheduleRuleStepMode;
  form: ScheduleFormRequest;
  errors: ScheduleFormErrors;
  onBack: () => void;
  onNext: () => void;
  onUpdateForm: (
    field: keyof ScheduleFormRequest,
    value: ScheduleFormRequest[keyof ScheduleFormRequest],
  ) => void;
};

export function ScheduleRuleStep({
  mode,
  form,
  errors,
  onBack,
  onNext,
  onUpdateForm,
}: ScheduleRuleStepProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isRecurring = form.endType !== null;
  const isWeekly = form.frequencyUnit === FrequencyUnit.week;

  const title = mode === "create" ? "設定時間規則" : "修改時間規則";
  const description =
    mode === "create"
      ? "設定開始日期、服藥時間、劑量與重複規則。"
      : "修改此排程的時間、劑量與重複規則。";

  const handleChangeEndType = (value: ScheduleEndType | null) => {
    onUpdateForm("endType", value);

    if (value === null) {
      onUpdateForm("frequencyUnit", null);
      onUpdateForm("interval", null);
      onUpdateForm("weekdays", []);
      onUpdateForm("untilDate", null);
      onUpdateForm("occurrenceCount", null);
      return;
    }

    if (!form.frequencyUnit) {
      onUpdateForm("frequencyUnit", FrequencyUnit.day);
    }

    if (!form.interval) {
      onUpdateForm("interval", 1);
    }

    if (value === ScheduleEndType.never) {
      onUpdateForm("untilDate", null);
      onUpdateForm("occurrenceCount", null);
    }

    if (value === ScheduleEndType.until) {
      onUpdateForm("occurrenceCount", null);
    }

    if (value === ScheduleEndType.counts) {
      onUpdateForm("untilDate", null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {errors.form && (
        <View style={styles.formErrorBox}>
          <Text style={styles.formErrorText}>{errors.form}</Text>
        </View>
      )}

      <AppDateField
        label="開始日期"
        value={parseDate(form.startDate)}
        onChange={(date) =>
          onUpdateForm("startDate", formatDateToYYYYMMDD(date))
        }
        placeholder="請選擇開始日期"
        error={errors.startDate}
        required
      />

      <ScheduleTimeSlotsPickerField
        label="服藥時間"
        value={form.timeSlots}
        onChange={(nextTimeSlots) => onUpdateForm("timeSlots", nextTimeSlots)}
        error={errors.timeSlots}
        required
      />

      <AppTextField
        label="劑量"
        value={String(form.amount)}
        onChangeText={(value) => {
          const numberValue = Number(value);
          onUpdateForm(
            "amount",
            Number.isFinite(numberValue) ? numberValue : 0,
          );
        }}
        keyboardType="decimal-pad"
        placeholder="請輸入劑量"
        error={errors.amount}
        required
      />

      <AppSelectField
        label="劑量單位"
        value={form.doseUnit}
        onChange={(value) => {
          if (!value) return;
          onUpdateForm("doseUnit", value);
        }}
        options={DOSE_UNIT_OPTIONS}
        modalTitle="選擇劑量單位"
        error={errors.doseUnit}
        required
      />

      <AppSelectField
        label="排程類型"
        value={form.endType}
        onChange={handleChangeEndType}
        options={endTypeOptions}
        modalTitle="選擇排程類型"
        error={errors.endType}
        required
      />

      {isRecurring && (
        <>
          <AppSelectField
            label="頻率單位"
            value={form.frequencyUnit}
            onChange={(value) => {
              onUpdateForm("frequencyUnit", value);

              if (value !== FrequencyUnit.week) {
                onUpdateForm("weekdays", []);
              }
            }}
            options={frequencyUnitOptions}
            modalTitle="選擇頻率單位"
            error={errors.frequencyUnit}
            required
          />

          <AppTextField
            label="間隔"
            value={String(form.interval ?? "")}
            onChangeText={(value) => {
              const numberValue = Number(value);
              onUpdateForm(
                "interval",
                Number.isFinite(numberValue) ? numberValue : null,
              );
            }}
            keyboardType="number-pad"
            placeholder="例如：1"
            error={errors.interval}
            required
          />

          {isWeekly && (
            <AppTextField
              label="星期"
              value={(form.weekdays ?? []).join(",")}
              onChangeText={(value) => {
                const weekdays = value
                  .split(",")
                  .map((item) => Number(item.trim()))
                  .filter((item) => Number.isFinite(item));

                onUpdateForm("weekdays", weekdays);
              }}
              placeholder="例如：1,3,5"
              error={errors.weekdays}
              required
            />
          )}

          {form.endType === ScheduleEndType.until && (
            <AppDateField
              label="結束日期"
              value={parseDate(form.untilDate)}
              onChange={(date) =>
                onUpdateForm("untilDate", formatDateToYYYYMMDD(date))
              }
              placeholder="請選擇結束日期"
              error={errors.untilDate}
              required
            />
          )}

          {form.endType === ScheduleEndType.counts && (
            <AppTextField
              label="發生次數"
              value={String(form.occurrenceCount ?? "")}
              onChangeText={(value) => {
                const numberValue = Number(value);
                onUpdateForm(
                  "occurrenceCount",
                  Number.isFinite(numberValue) ? numberValue : null,
                );
              }}
              keyboardType="number-pad"
              placeholder="例如：10"
              error={errors.occurrenceCount}
              required
            />
          )}
        </>
      )}

      <View style={styles.actions}>
        <AppButton
          title={mode === "create" ? "上一步" : "取消"}
          variant="secondary"
          onPress={onBack}
          style={styles.actionButton}
        />

        <AppButton
          title="下一步"
          onPress={onNext}
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

    infoBox: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.xs,
    },

    infoLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    infoValue: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
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
