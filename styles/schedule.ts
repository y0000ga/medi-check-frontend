import { useAppTheme } from "@/shared/theme/theme";
import { StyleSheet } from "react-native";

export const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
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
    smallButtonPressed: {
      opacity: 0.85,
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
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingTop: theme.layout.screenPaddingVertical,
      gap: theme.spacing.lg,
    },

    header: {
      gap: theme.spacing.lg,
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

    selectedFilterBox: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primarySoft,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },

    selectedFilterTextGroup: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    selectedFilterLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    selectedFilterValue: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    clearButton: {
      minWidth: 72,
    },

    patientListContent: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },

    scheduleListContent: {
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

    cardIconBox: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
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

    cardTitle: {
      flex: 1,
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    cardBadge: {
      ...theme.typography.captionStrong,
      color: theme.colors.primary,
      backgroundColor: theme.colors.primarySoft,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.full,
      overflow: "hidden",
    },

    cardMeta: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    cardRule: {
      ...theme.typography.captionStrong,
      color: theme.colors.text,
      marginTop: theme.spacing.xs,
    },
  });
