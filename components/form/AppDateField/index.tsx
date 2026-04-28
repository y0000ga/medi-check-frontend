import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme";
import { createDateFieldStyles } from "./styles";
import { formatDateToYYYYMMDD } from "@/utils/common";

type AppDateFieldProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;

  placeholder?: string;
  error?: string;

  required?: boolean;
  disabled?: boolean;

  minimumDate?: Date;
  maximumDate?: Date;

  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;

  formatDate?: (date: Date | string) => string;
};

export function AppDateField({
  label,
  value,
  onChange,

  placeholder = "請選擇日期",
  error,

  required = false,
  disabled = false,

  minimumDate,
  maximumDate,

  prefixIcon,
  suffixIcon,

  formatDate = formatDateToYYYYMMDD,
}: AppDateFieldProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createDateFieldStyles(theme), [theme]);

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);

  const displayText = value ? formatDate(value) : placeholder;

  const handleOpenPicker = () => {
    if (disabled) return;

    setIsFocused(true);
    setIsPickerVisible(true);
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    /**
     * Android:
     * - selected: 使用者選擇日期
     * - dismissed: 使用者取消
     */
    if (Platform.OS === "android") {
      setIsPickerVisible(false);
      setIsFocused(false);
    }

    if (event.type === "dismissed") {
      return;
    }

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, disabled && styles.disabledText]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <Pressable
        onPress={handleOpenPicker}
        disabled={disabled}
        style={[
          styles.fieldContainer,
          isFocused && styles.fieldContainerFocused,
          hasError && styles.fieldContainerError,
          disabled && styles.fieldContainerDisabled,
        ]}
      >
        {prefixIcon ? (
          <View style={styles.prefixIconBox}>{prefixIcon}</View>
        ) : (
          <View style={styles.prefixIconBox}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={theme.colors.textMuted}
            />
          </View>
        )}

        <Text
          style={[
            styles.valueText,
            !value && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>

        {suffixIcon ? (
          <View style={styles.suffixIconBox}>{suffixIcon}</View>
        ) : (
          <View style={styles.suffixIconBox}>
            <Ionicons
              name="chevron-down-outline"
              size={20}
              color={theme.colors.textMuted}
            />
          </View>
        )}
      </Pressable>

      {hasError && <Text style={styles.errorText}>{error}</Text>}

      {isPickerVisible && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.OS === "android" ? "default" : "spinner"}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
}
