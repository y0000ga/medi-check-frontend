import { getStatusIcon, getStatusLabel } from "@/features/history/constants";
import { dosageFormLabelMap } from "@/features/medication/dosageFormOptions";
import { ScheduleMatch } from "@/features/schedule/types";
import { useAppTheme } from "@/shared/theme/theme";
import { createStyles } from "@/styles/event";
import { formatScheduledTime } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

type ScheduleMatchCardProps = {
  match: ScheduleMatch;
  onPress: () => void;
  onQuickCheck: () => void;
  isQuickChecking?: boolean;
};

function ScheduleMatchCard({
  match,
  onPress,
  onQuickCheck,
  isQuickChecking = false,
}: ScheduleMatchCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const status = match.history?.status ?? null;
  const hasHistory = Boolean(match.history);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>
          {formatScheduledTime(match.scheduledAt)}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.medicationName} numberOfLines={1}>
          {match.medicationName}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          照護對象：{match.patientName}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          劑型：{dosageFormLabelMap[match.medicationDosageForm]}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          劑量：{match.amount} {match.doseUnit}
        </Text>
      </View>

      <View style={styles.statusBox}>
        {hasHistory ? (
          <>
            <Ionicons
              name={getStatusIcon(status)}
              size={20}
              color={theme.colors.primary}
            />

            <Text style={styles.statusText}>{getStatusLabel(status)}</Text>
          </>
        ) : (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onQuickCheck();
            }}
            disabled={isQuickChecking}
            style={({ pressed }) => [
              styles.quickCheckButton,
              pressed && styles.quickCheckButtonPressed,
              isQuickChecking && styles.quickCheckButtonDisabled,
            ]}
          >
            <Ionicons
              name="checkmark-outline"
              size={16}
              color={theme.colors.primary}
            />

            <Text style={styles.quickCheckText}>
              {isQuickChecking ? "處理中" : "已服用"}
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

export default ScheduleMatchCard;
