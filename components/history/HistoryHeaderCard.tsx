import { getStatusIcon, getStatusLabel } from "@/features/history/constants";
import { HistoryDetail } from "@/features/history/types";
import { useAppTheme } from "@/shared/theme/theme";
import { createDetailStyles } from "@/styles/history";
import { formatDateTime } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Text, View } from "react-native";

type HistoryHeaderCardProps = {
  history: HistoryDetail;
};

function HistoryHeaderCard({ history }: HistoryHeaderCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createDetailStyles(theme), [theme]);

  return (
    <View style={styles.headerCard}>
      <View style={styles.iconBox}>
        <Ionicons
          name={getStatusIcon(history.status)}
          size={36}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>
          {history.medicationSnapshot.name}
        </Text>

        <Text style={styles.headerMeta}>
          {history.patientSnapshot.name}・{getStatusLabel(history.status)}
        </Text>

        <Text style={styles.headerMeta}>
          {formatDateTime(history.intakeAt)}
        </Text>
      </View>
    </View>
  );
}

export default HistoryHeaderCard;
