import { useAppTheme } from "@/shared/theme/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default InfoRow;

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },
    infoLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },
    infoValue: {
      flex: 1,
      ...theme.typography.captionStrong,
      color: theme.colors.text,
      textAlign: "right",
    },
  });
