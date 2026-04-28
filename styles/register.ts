import { StyleSheet } from "react-native";
import { AppTheme } from "@/shared/theme/theme";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    container: {
      flex: 1,
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      justifyContent: "center",
      gap: theme.spacing.xxl,
    },
    formErrorBox: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.errorSoft,
      borderWidth: 1,
      borderColor: theme.colors.error,
    },

    formErrorText: {
      ...theme.typography.captionStrong,
      color: theme.colors.error,
    },

    header: {
      gap: theme.spacing.sm,
    },

    title: {
      ...theme.typography.title,
      color: theme.colors.text,
    },

    description: {
      ...theme.typography.body,
      color: theme.colors.textMuted,
    },

    form: {
      gap: theme.spacing.lg,
    },

    footer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: theme.spacing.xs,
    },

    footerText: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    footerLink: {
      ...theme.typography.captionStrong,
      color: theme.colors.primary,
    },
  });
