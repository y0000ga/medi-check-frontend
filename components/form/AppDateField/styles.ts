import { StyleSheet } from "react-native";
import { AppTheme } from "@/shared/theme/theme";

export const createDateFieldStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
      gap: theme.spacing.xs,
    },

    label: {
      ...theme.typography.captionStrong,
      color: theme.colors.text,
    },

    required: {
      color: theme.colors.error,
    },

    fieldContainer: {
      minHeight: theme.layout.inputHeight,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },

    fieldContainerFocused: {
      borderColor: theme.colors.primary,
    },

    fieldContainerError: {
      borderColor: theme.colors.error,
    },

    fieldContainerDisabled: {
      backgroundColor: theme.colors.disabledBackground,
      borderColor: theme.colors.borderMuted,
    },

    prefixIconBox: {
      width: 28,
      height: 28,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.sm,
    },

    suffixIconBox: {
      width: 28,
      height: 28,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: theme.spacing.sm,
    },

    valueText: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
    },

    placeholderText: {
      color: theme.colors.placeholder,
    },

    disabledText: {
      color: theme.colors.disabledText,
    },

    errorText: {
      ...theme.typography.error,
      color: theme.colors.error,
    },
  });
