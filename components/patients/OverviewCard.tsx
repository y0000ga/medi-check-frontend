import { useAppTheme } from "@/shared/theme/theme";
import { createStyles } from "@/styles/patients";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, View, Text } from "react-native";

type PatientCardProps = {
  patient: {
    id: string;
    name: string;
    permissionLevel: string;
    linkedUserName?: string | null;
  };
  onPress: () => void;
};

function OverviewCard({ patient, onPress }: PatientCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardIcon}>
        <Ionicons
          name="person-outline"
          size={22}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{patient.name}</Text>

        <Text style={styles.cardMeta}>權限：{patient.permissionLevel}</Text>

        <Text style={styles.cardMeta}>
          關聯帳號：{patient.linkedUserName || "未關聯"}
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

export default OverviewCard;
