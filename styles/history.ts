import { useAppTheme } from "@/shared/theme/theme";
import { StyleSheet } from "react-native";

export const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingTop: theme.layout.screenPaddingVertical,
      gap: theme.spacing.md,
    },

    header: {
      gap: theme.spacing.xs,
    },

    headerTextGroup: {
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

    compactDateCard: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    compactSummaryRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },

    summaryChip: {
      flex: 1,
      minHeight: 40,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primarySoft,
      alignItems: "center",
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },

    summaryChipValue: {
      ...theme.typography.bodyStrong,
      color: theme.colors.primary,
    },

    summaryChipLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    compactPatientFilterBox: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      backgroundColor: theme.colors.surface,
    },

    compactPatientFilterTextGroup: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    compactFilterLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    compactFilterValue: {
      ...theme.typography.captionStrong,
      color: theme.colors.text,
    },

    compactFilterActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },

    smallTextButton: {
      minHeight: 32,
      paddingHorizontal: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },

    smallTextButtonText: {
      ...theme.typography.captionStrong,
      color: theme.colors.textMuted,
    },

    smallPrimaryButton: {
      minHeight: 32,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },

    smallPrimaryButtonText: {
      ...theme.typography.captionStrong,
      color: theme.colors.primary,
    },

    smallButtonPressed: {
      opacity: 0.85,
    },

    patientPickerBox: {
      gap: theme.spacing.md,
    },

    compactPatientListContent: {
      gap: theme.spacing.sm,
    },

    compactPatientItem: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      backgroundColor: theme.colors.surface,
    },

    compactPatientItemPressed: {
      opacity: 0.85,
    },

    compactPatientName: {
      flex: 1,
      ...theme.typography.captionStrong,
      color: theme.colors.text,
    },

    historyListContent: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },

    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      ...theme.shadows.card,
    },

    cardPressed: {
      opacity: 0.85,
    },

    timeBox: {
      width: 56,
      minHeight: 44,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.sm,
    },

    timeText: {
      ...theme.typography.bodyStrong,
      color: theme.colors.primary,
    },

    cardContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    cardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },

    medicationName: {
      flex: 1,
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    metaText: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primarySoft,
    },

    statusBadgeText: {
      ...theme.typography.captionStrong,
      color: theme.colors.primary,
    },
  });

export const createDetailStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    content: {
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingVertical: theme.layout.screenPaddingVertical,
      gap: theme.spacing.lg,
    },

    headerCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      ...theme.shadows.card,
    },

    iconBox: {
      width: 72,
      height: 72,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
    },

    headerInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    headerTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },

    headerMeta: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
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
      alignItems: "flex-start",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
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

    noteBlock: {
      gap: theme.spacing.xs,
    },

    noteLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    noteText: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 24,
    },

    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textMuted,
    },

    actions: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
  });

export const createEditStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    content: {
      flexGrow: 1,
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingVertical: theme.layout.screenPaddingVertical,
      gap: theme.spacing.lg,
    },

    headerCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      ...theme.shadows.card,
    },

    iconBox: {
      width: 72,
      height: 72,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
    },

    headerInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    headerTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },

    headerMeta: {
      ...theme.typography.caption,
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

    referenceBox: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primarySoft,
    },

    referenceText: {
      ...theme.typography.captionStrong,
      color: theme.colors.primary,
    },

    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
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
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
  });
