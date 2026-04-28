import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { useAppTheme } from "@/shared/theme/theme";
import { createStyles } from "./styles";

type AppCardProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function AppCard({ children, style }: AppCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return <View style={[styles.card, style]}>{children}</View>;
}
