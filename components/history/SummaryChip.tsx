import { useAppTheme } from "@/shared/theme/theme";
import { createStyles } from "@/styles/history";
import { useMemo } from "react";
import { Text, View } from "react-native";

type SummaryChipProps = {
  label: string;
  value: number;
};

function SummaryChip({ label, value }: SummaryChipProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.summaryChip}>
      <Text style={styles.summaryChipValue}>{value}</Text>
      <Text style={styles.summaryChipLabel}>{label}</Text>
    </View>
  );
}

export default SummaryChip;
