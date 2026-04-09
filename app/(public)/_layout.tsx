import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";

import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { routes } from "@/constants/route";
import { useUserStore } from "@/stores/user";

const PublicLayout = () => {
  const initializeAuth = useUserStore(
    (state) => state.initializeAuth,
  );
  const hasInitializedAuth = useUserStore(
    (state) => state.hasInitializedAuth,
  );
  const isAuthenticated = useUserStore((state) =>
    state.isAuthenticated(),
  );

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!hasInitializedAuth) {
    return <FullScreenLoading visible text="Checking session..." />;
  }

  if (isAuthenticated) {
    return <Redirect href={routes.protected.home} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
};

export default PublicLayout;
