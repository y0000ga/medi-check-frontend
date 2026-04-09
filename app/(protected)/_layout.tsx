import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";

import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { routes } from "@/constants/route";
import { useUserStore } from "@/stores/user";
import { useViewerStore } from "@/stores/viewer";

const ProtectedLayout = () => {
  const initializeAuth = useUserStore(
    (state) => state.initializeAuth,
  );
  const loadCurrentUser = useUserStore(
    (state) => state.loadCurrentUser,
  );
  const hasInitializedAuth = useUserStore(
    (state) => state.hasInitializedAuth,
  );
  const currentUser = useUserStore((state) => state.currentUser);
  const userLoading = useUserStore((state) => state.isLoading.length > 0);
  const isAuthenticated = useUserStore((state) =>
    state.isAuthenticated(),
  );
  const hydrateViewer = useViewerStore(
    (state) => state.hydrateForUser,
  );
  const viewerLoading = useViewerStore((state) => state.isLoading);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (
      !hasInitializedAuth ||
      !isAuthenticated ||
      currentUser ||
      userLoading
    ) {
      return;
    }

    loadCurrentUser();
  }, [
    currentUser,
    hasInitializedAuth,
    isAuthenticated,
    loadCurrentUser,
    userLoading,
  ]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    hydrateViewer(currentUser.id);
  }, [currentUser, hydrateViewer]);

  if (!hasInitializedAuth || (isAuthenticated && !currentUser)) {
    return <FullScreenLoading visible text="Checking session..." />;
  }

  if (!isAuthenticated) {
    return <Redirect href={routes.public.signIn} />;
  }

  if (viewerLoading) {
    return <FullScreenLoading visible text="Loading your data..." />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(modal)" />
    </Stack>
  );
};

export default ProtectedLayout;
