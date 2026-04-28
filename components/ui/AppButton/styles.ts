import { AppTheme } from "@/shared/theme/theme";
import { StyleSheet } from "react-native";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    base: {
      height: theme.layout.buttonHeight,
      borderRadius: theme.radius.md,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },

    primary: {
      backgroundColor: theme.colors.primary,
    },

    secondary: {
      backgroundColor: theme.colors.primarySoft,
    },

    ghost: {
      backgroundColor: "transparent",
    },

    danger: {
      backgroundColor: theme.colors.error,
    },

    pressed: {
      opacity: 0.85,
    },

    disabled: {
      opacity: 0.6,
    },

    text: {
      ...theme.typography.bodyStrong,
    },

    primaryText: {
      color: "#FFFFFF",
    },

    secondaryText: {
      color: theme.colors.primary,
    },

    ghostText: {
      color: theme.colors.primary,
    },

    dangerText: {
      color: "#FFFFFF",
    },
  });
