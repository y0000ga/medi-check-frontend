import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";

import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { routes } from "@/constants/route";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  markAuthInitialized,
  selectHasInitializedAuth,
  useAuthUser,
  useLazyGetCurrentUserQuery,
} from "@/store/user";

const PublicLayout = () => {
  const dispatch = useAppDispatch();
  const hasInitializedAuth = useAppSelector(selectHasInitializedAuth);
  const { isAuthenticated, currentUser } = useAuthUser();
  const [loadCurrentUser] = useLazyGetCurrentUserQuery();

  useEffect(() => {
    dispatch(markAuthInitialized());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && !currentUser) {
      loadCurrentUser();
    }
  }, [currentUser, isAuthenticated, loadCurrentUser]);

  if (!hasInitializedAuth) {
    return <FullScreenLoading visible />;
  }

  if (isAuthenticated && currentUser) {
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
