import { StyleSheet } from "react-native";
import { AppTheme } from "@/shared/theme/theme";

export const createStyles = (theme: AppTheme) =>
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

    inputContainer: {
      minHeight: theme.layout.inputHeight,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },

    textareaContainer: {
      minHeight: 120,
      alignItems: "stretch",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },

    inputContainerFocused: {
      borderColor: theme.colors.primary,
    },

    inputContainerError: {
      borderColor: theme.colors.error,
    },

    inputContainerDisabled: {
      backgroundColor: theme.colors.disabledBackground,
      borderColor: theme.colors.borderMuted,
    },

    input: {
      flex: 1,
      minHeight: theme.layout.inputHeight,
      paddingVertical: 0,
      ...theme.typography.body,
      color: theme.colors.text,
    },

    textareaInput: {
      minHeight: 96,
      maxHeight: 160,
      paddingTop: 0,
      paddingBottom: 0,
      textAlignVertical: "top",
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

    suffixIconButton: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: theme.spacing.sm,
    },

    metaRow: {
      minHeight: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: theme.spacing.sm,
    },

    errorText: {
      flex: 1,
      ...theme.typography.error,
      color: theme.colors.error,
    },

    counterText: {
      ...theme.typography.error,
      color: theme.colors.textMuted,
    },

    disabledText: {
      color: theme.colors.disabledText,
    },
  });
