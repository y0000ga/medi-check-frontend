import { dosageFormLabelMap } from "@/features/medication/dosageFormOptions";
import {
  getEndConditionText,
  getEndTypeLabel,
  getScheduleRuleText,
} from "@/features/schedule/scheduleOptions";
import { Schedule } from "@/features/schedule/types";
import { useAppTheme } from "@/shared/theme/theme";
import { createStyles } from "@/styles/schedule";
import { formatTimeSlots } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, View, Text } from "react-native";

type ScheduleCardProps = {
  schedule: Schedule;
  onPress: () => void;
};

function ScheduleCard({ schedule, onPress }: ScheduleCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardIconBox}>
        <Ionicons
          name="calendar-outline"
          size={22}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {schedule.medicationName}
          </Text>

          <Text style={styles.cardBadge}>
            {getEndTypeLabel(schedule.endType)}
          </Text>
        </View>

        <Text style={styles.cardMeta} numberOfLines={1}>
          照護對象：{schedule.patientName}
        </Text>

        <Text style={styles.cardMeta} numberOfLines={1}>
          劑型：{dosageFormLabelMap[schedule.medicationDosageForm]}
        </Text>

        <Text style={styles.cardMeta} numberOfLines={1}>
          時間：{formatTimeSlots(schedule.timeSlots)}
        </Text>

        <Text style={styles.cardMeta} numberOfLines={1}>
          劑量：{schedule.amount} {schedule.doseUnit}
        </Text>

        <Text style={styles.cardRule} numberOfLines={2}>
          {getScheduleRuleText(schedule)}｜{getEndConditionText(schedule)}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward-outline"
        size={20}
        color={theme.colors.textMuted}
      />
    </Pressable>
  );
}

export default ScheduleCard;
