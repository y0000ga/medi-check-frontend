import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { useAppTheme } from "@/shared/theme/theme";
import { formatScheduledTime, formatTimeSlot } from "@/utils/common";

type ScheduleTimeSlotsPickerFieldProps = {
  label: string;
  value: string[];
  onChange: (nextValue: string[]) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
};

const sortTimeSlots = (timeSlots: string[]) => {
  return [...timeSlots].sort((a, b) => a.localeCompare(b));
};

export function ScheduleTimeSlotsPickerField({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}: ScheduleTimeSlotsPickerFieldProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [draftDate, setDraftDate] = useState(new Date());

  const handleOpenPicker = () => {
    if (disabled) return;

    setDraftDate(new Date());
    setIsPickerVisible(true);
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setIsPickerVisible(false);
    }

    if (event.type === "dismissed") {
      return;
    }

    if (!selectedDate) {
      return;
    }

    setDraftDate(selectedDate);

    const nextTimeSlot = formatScheduledTime(selectedDate);

    if (value.includes(nextTimeSlot)) {
      return;
    }

    onChange(sortTimeSlots([...value, nextTimeSlot]));
  };

  const handleRemove = (target: string) => {
    if (disabled) return;

    onChange(value.filter((item) => item !== target));
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, disabled && styles.disabledText]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <AppButton
        title="新增服藥時間"
        onPress={handleOpenPicker}
        disabled={disabled}
      />

      {value.length > 0 ? (
        <View style={styles.chipContainer}>
          {value.map((timeSlot) => (
            <View key={timeSlot} style={styles.chip}>
              <Text style={styles.chipText}>{formatTimeSlot(timeSlot)}</Text>

              <Pressable
                onPress={() => handleRemove(timeSlot)}
                disabled={disabled}
                hitSlop={8}
                style={styles.chipRemoveButton}
              >
                <Ionicons
                  name="close-outline"
                  size={16}
                  color={theme.colors.textMuted}
                />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.helperText}>尚未加入服藥時間</Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {isPickerVisible && (
        <DateTimePicker
          value={draftDate}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour
          onChange={handleChange}
        />
      )}
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

    chipContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      paddingTop: theme.spacing.xs,
    },

    chip: {
      minHeight: 32,
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.xs,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },

    chipText: {
      ...theme.typography.captionStrong,
      color: theme.colors.text,
    },

    chipRemoveButton: {
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
    },

    helperText: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    errorText: {
      ...theme.typography.error,
      color: theme.colors.error,
    },

    disabledText: {
      color: theme.colors.disabledText,
    },
  });
