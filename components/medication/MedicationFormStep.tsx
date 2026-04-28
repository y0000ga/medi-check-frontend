import { AppSelectField } from "@/components/form/AppSelectField";
import { AppTextField } from "@/components/form/AppTextField";
import { AppButton } from "@/components/ui/AppButton";
import { DOSAGE_FORM_OPTIONS } from "@/features/medication/dosageFormOptions";
import {
  MedicationFormErrors,
  MedicationFormField,
  MedicationFormUpdateValue,
  MedicationFormValue,
} from "@/features/medication/formTypes";
import { DosageForm } from "@/features/medication/types";
import { useAppTheme } from "@/shared/theme/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type MedicationFormStepProps = {
  title: string;
  description?: string;
  patientName: string;

  form: MedicationFormValue;
  errors: MedicationFormErrors;

  backLabel?: string;
  nextLabel?: string;

  onBack: () => void;
  onNext: () => void;
  onUpdateForm: (
    field: MedicationFormField,
    value: MedicationFormUpdateValue,
  ) => void;
};

export function MedicationFormStep({
  title,
  description,
  patientName,

  form,
  errors,

  backLabel = "上一步",
  nextLabel = "下一步",

  onBack,
  onNext,
  onUpdateForm,
}: MedicationFormStepProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>
          {description ?? `照護對象：${patientName}`}
        </Text>
      </View>

      {errors.form && (
        <View style={styles.formErrorBox}>
          <Text style={styles.formErrorText}>{errors.form}</Text>
        </View>
      )}

      <AppTextField
        label="藥品名稱"
        value={form.name}
        onChangeText={(text) => onUpdateForm("name", text)}
        placeholder="請輸入藥品名稱"
        error={errors.name}
        required
      />

      <AppSelectField<DosageForm>
        label="劑型"
        value={form.dosageForm}
        onChange={(value) => onUpdateForm("dosageForm", value)}
        placeholder="請選擇劑型"
        modalTitle="選擇劑型"
        options={DOSAGE_FORM_OPTIONS}
        error={errors.dosageForm}
        required
      />

      <AppTextField
        label="筆記"
        value={form.note}
        onChangeText={(text) => onUpdateForm("note", text)}
        placeholder="例如：飯後服用、不可磨粉、特殊提醒"
        error={errors.note}
        multiline
        numberOfLines={4}
        maxLength={500}
      />

      <View style={styles.actions}>
        <AppButton
          title={backLabel}
          variant="secondary"
          onPress={onBack}
          style={styles.actionButton}
        />

        <AppButton
          title={nextLabel}
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

    actions: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },

    actionButton: {
      flex: 1,
    },
  });
