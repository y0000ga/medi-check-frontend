import { useColorScheme } from "react-native";
import { colors } from "./colors";
import { layout } from "./layout";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const getAppTheme = (scheme: "light" | "dark" | null | undefined) => {
  const colorMode = scheme === "dark" ? "dark" : "light";

  return {
    colorMode,
    colors: colors[colorMode],
    spacing,
    radius,
    typography,
    layout,
    shadows,
  };
};

export const useAppTheme = () => {
  const scheme = useColorScheme();
  return getAppTheme(scheme);
};

export type AppTheme = ReturnType<typeof getAppTheme>;
