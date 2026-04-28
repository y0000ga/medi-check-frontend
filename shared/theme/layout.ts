import { Platform } from "react-native";
import { spacing } from "./spacing";

export const layout = {
  screenPaddingHorizontal: spacing.xl,
  screenPaddingVertical: spacing.xl,

  androidTopSpacing: Platform.OS === "android" ? spacing.lg : spacing.md,

  inputHeight: 48,
  buttonHeight: 48,
  tabBarHeight: 64,
  headerIconHitSlop: 8,

  cardPadding: spacing.lg,
};
