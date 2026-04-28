import { AppButton } from "@/components/ui/AppButton";
import { dosageFormLabelMap } from "@/features/medication/dosageFormOptions";
import { MedicationFormValue } from "@/features/medication/formTypes";
import { DosageForm } from "@/features/medication/types";
import { useAppTheme } from "@/shared/theme/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import InfoRow from "../ui/InfoRow";

type MedicationConfirmMode = "create" | "edit";

type MedicationConfirmStepProps = {
  mode: MedicationConfirmMode;

  patientName: string;
  form: MedicationFormValue;

  isSubmitting?: boolean;
  error?: string;

  onBack: () => void;
  onSubmit: () => void;
};

export function MedicationConfirmStep({
  mode,

  patientName,
  form,

  isSubmitting = false,
  error,

  onBack,
  onSubmit,
}: MedicationConfirmStepProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const title = mode === "create" ? "確認新增資訊" : "確認修改資訊";
  const description =
    mode === "create"
      ? "請確認以下內容無誤後，再建立藥品。"
      : "請確認以下內容無誤後，再儲存修改。";
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
        <InfoRow label="名稱" value={patientName} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>藥品資訊</Text>
        <InfoRow label="藥品名稱" value={form.name} />
        <InfoRow
          label="劑型"
          value={dosageFormLabelMap[form.dosageForm || DosageForm.Other]}
        />
        <InfoRow label="筆記" value={form.note || "未填寫"} />
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
