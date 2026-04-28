import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AppStoreProvider } from "@/store/provider";

export const unstable_settings = {
  anchor: "(protected)",
};

const RootLayout = () => {
  const colorScheme = useColorScheme();
  return (
    <AppStoreProvider>
      <ThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(public)" />
          <Stack.Screen name="(protected)" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppStoreProvider>
  );
};

export default RootLayout;
