import { useAppTheme } from "@/shared/theme/theme";
import { StyleSheet } from "react-native";

export const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    sortControls: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: theme.spacing.md,
    },

    sortByField: {
      flex: 1,
    },

    sortOrderButton: {
      minHeight: theme.layout.inputHeight,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
    },

    sortOrderButtonPressed: {
      opacity: 0.85,
    },

    sortOrderText: {
      ...theme.typography.captionStrong,
      color: theme.colors.primary,
    },
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingTop: theme.layout.screenPaddingVertical,
    },

    header: {
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
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

    actions: {
      gap: theme.spacing.md,
    },

    filterSection: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },

    sortRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
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

    cardIcon: {
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

    cardTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    cardMeta: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    centerState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
    },

    stateTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
      textAlign: "center",
    },

    stateText: {
      ...theme.typography.body,
      color: theme.colors.textMuted,
      textAlign: "center",
    },

    pagination: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderMuted,
      backgroundColor: theme.colors.background,
    },

    paginationButton: {
      flex: 1,
    },

    paginationInfo: {
      alignItems: "center",
      justifyContent: "center",
      minWidth: 88,
    },

    paginationText: {
      ...theme.typography.captionStrong,
      color: theme.colors.text,
    },

    paginationSubText: {
      ...theme.typography.error,
      color: theme.colors.textMuted,
    },
  });
