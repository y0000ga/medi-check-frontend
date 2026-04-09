import { Redirect } from "expo-router";
import { useEffect } from "react";

import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { routes } from "@/constants/route";
import { useUserStore } from "@/stores/user";

const IndexScreen = () => {
  const initializeAuth = useUserStore(
    (state) => state.initializeAuth,
  );
  const hasInitializedAuth = useUserStore(
    (state) => state.hasInitializedAuth,
  );
  const currentUser = useUserStore((state) => state.currentUser);
  const isAuthenticated = useUserStore((state) =>
    state.isAuthenticated(),
  );

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!hasInitializedAuth) {
    return <FullScreenLoading visible text="Checking session..." />;
  }

  if (isAuthenticated && currentUser) {
    return <Redirect href={routes.protected.home} />;
  }

  return <Redirect href={routes.public.signIn} />;
};

export default IndexScreen;
