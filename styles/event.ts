import { useAppTheme } from "@/shared/theme/theme";
import { StyleSheet } from "react-native";

export const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    quickCheckButton: {
      minWidth: 64,
      minHeight: 36,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: theme.spacing.xs,
    },

    quickCheckButtonPressed: {
      opacity: 0.85,
    },

    quickCheckButtonDisabled: {
      opacity: 0.5,
    },

    quickCheckText: {
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },

    headerTextGroup: {
      flex: 1,
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

    addButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
    },

    addButtonPressed: {
      opacity: 0.85,
    },

    listContent: {
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

    medicationName: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    metaText: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    statusBox: {
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      minWidth: 56,
    },

    statusText: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
      textAlign: "center",
    },
  });
