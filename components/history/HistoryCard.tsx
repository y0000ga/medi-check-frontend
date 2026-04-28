import { getStatusIcon, getStatusLabel } from "@/features/history/constants";
import { HistoryOverview } from "@/features/history/types";
import { dosageFormLabelMap } from "@/features/medication/dosageFormOptions";
import { useAppTheme } from "@/shared/theme/theme";
import { createStyles } from "@/styles/history";
import { formatDateTime, formatTime } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

type HistoryCardProps = {
  history: HistoryOverview;
  onPress: () => void;
};

function HistoryCard({ history, onPress }: HistoryCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>{formatTime(history.intakeAt)}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.medicationName} numberOfLines={1}>
            {history.medicationSnapshot.name}
          </Text>

          <View style={styles.statusBadge}>
            <Ionicons
              name={getStatusIcon(history.status)}
              size={14}
              color={theme.colors.primary}
            />
            <Text style={styles.statusBadgeText}>
              {getStatusLabel(history.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.metaText} numberOfLines={1}>
          照護對象：{history.patientSnapshot.name}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          劑型：{dosageFormLabelMap[history.medicationSnapshot.dosageForm]}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          預定時間：{formatDateTime(history.scheduleSnapshot.scheduledAt)}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          實際劑量：{history.takenAmount} {history.scheduleSnapshot.doseUnit}
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

export default HistoryCard;
