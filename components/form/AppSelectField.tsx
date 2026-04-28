import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "@/shared/theme/theme";

export type AppSelectOption<T extends string> = {
  label: string;
  value: T | null;
  description?: string;
};

type AppSelectFieldProps<T extends string> = {
  label: string;
  value: T | null;
  options: AppSelectOption<T>[];
  onChange: (value: T | null) => void;

  placeholder?: string;
  error?: string;

  required?: boolean;
  disabled?: boolean;

  modalTitle?: string;
  prefixIcon?: ReactNode;
};

export function AppSelectField<T extends string>({
  label,
  value,
  options,
  onChange,

  placeholder = "請選擇",
  error,

  required = false,
  disabled = false,

  modalTitle,
  prefixIcon,
}: AppSelectFieldProps<T>) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const hasError = Boolean(error);

  const displayText = selectedOption?.label ?? placeholder;

  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  const handleSelect = (nextValue: T | null) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, disabled && styles.disabledText]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        style={({ pressed }) => [
          styles.field,
          pressed && !disabled && styles.fieldPressed,
          hasError && styles.fieldError,
          disabled && styles.fieldDisabled,
        ]}
      >
        {prefixIcon && <View style={styles.prefixIconBox}>{prefixIcon}</View>}

        <Text
          style={[
            styles.valueText,
            !selectedOption && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>

        <Ionicons
          name="chevron-down-outline"
          size={20}
          color={theme.colors.textMuted}
        />
      </Pressable>

      {hasError && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle ?? label}</Text>

              <Pressable
                onPress={() => setIsOpen(false)}
                hitSlop={12}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close-outline"
                  size={24}
                  color={theme.colors.text}
                />
              </Pressable>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item, index) => `${item.value ?? "null"}-${index}`}
              renderItem={({ item }) => {
                const active = item.value === value;

                return (
                  <Pressable
                    onPress={() => handleSelect(item.value)}
                    style={({ pressed }) => [
                      styles.option,
                      active && styles.optionActive,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <View style={styles.optionTextGroup}>
                      <Text
                        style={[
                          styles.optionLabel,
                          active && styles.optionLabelActive,
                        ]}
                      >
                        {item.label}
                      </Text>

                      {item.description && (
                        <Text style={styles.optionDescription}>
                          {item.description}
                        </Text>
                      )}
                    </View>

                    {active && (
                      <Ionicons
                        name="checkmark-outline"
                        size={20}
                        color={theme.colors.primary}
                      />
                    )}
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
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

    field: {
      minHeight: theme.layout.inputHeight,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.sm,
    },

    fieldPressed: {
      opacity: 0.85,
    },

    fieldError: {
      borderColor: theme.colors.error,
    },

    fieldDisabled: {
      backgroundColor: theme.colors.disabledBackground,
      borderColor: theme.colors.borderMuted,
    },

    prefixIconBox: {
      width: 28,
      height: 28,
      alignItems: "center",
      justifyContent: "center",
    },

    valueText: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
    },

    placeholderText: {
      color: theme.colors.placeholder,
    },

    errorText: {
      ...theme.typography.error,
      color: theme.colors.error,
    },

    disabledText: {
      color: theme.colors.disabledText,
    },

    backdrop: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(15, 23, 42, 0.45)",
    },

    modalCard: {
      maxHeight: "70%",
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      backgroundColor: theme.colors.surface,
      paddingBottom: theme.spacing.lg,
      overflow: "hidden",
    },

    modalHeader: {
      minHeight: 56,
      paddingHorizontal: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderMuted,
    },

    modalTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    closeButton: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },

    option: {
      minHeight: 52,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },

    optionActive: {
      backgroundColor: theme.colors.primarySoft,
    },

    optionPressed: {
      opacity: 0.85,
    },

    optionTextGroup: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    optionLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
    },

    optionLabelActive: {
      ...theme.typography.bodyStrong,
      color: theme.colors.primary,
    },

    optionDescription: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    separator: {
      height: 1,
      backgroundColor: theme.colors.borderMuted,
    },
  });
