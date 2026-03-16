import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  console.log(process.env.EXPO_PUBLIC_API_URL)

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sign-in"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sign-up"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="reset-password"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(modal)/schedule/[action]"
          options={{
            presentation: 'modal',
            headerShown: false
          }}
        />
        <Stack.Screen
          name="(modal)/medication/[action]"
          options={{
            presentation: 'modal',
            headerShown: false
          }} />
        <Stack.Screen
          name="(modal)/history/[id]"
          options={{
            presentation: 'modal',
            headerShown: false
          }}
        />
        <Stack.Screen
          name="(modal)/me/viewer"
          options={{
            presentation: 'modal',
            headerShown: false
          }}
        />
        <Stack.Screen
          name="(modal)/me/profile"
          options={{
            presentation: 'modal',
            headerShown: false
          }}
        />
        <Stack.Screen
          name="(modal)/me/security"
          options={{
            presentation: 'modal',
            headerShown: false
          }}
        />
        <Stack.Screen
          name="(modal)/me/care-network"
          options={{
            presentation: 'modal',
            headerShown: false
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
