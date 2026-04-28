import { Stack } from "expo-router";
import { Provider } from "react-redux";

import { store } from "@/shared/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(public)" />
        <Stack.Screen name="(protected)" />
      </Stack>
    </Provider>
  );
}
