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


const ProtectedLayout = () => {
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

  useEffect(() => {
    if (!currentUser || !currentUser.patientId) {
      return;
    }
  }, [currentUser, dispatch]);

  if (!hasInitializedAuth || (isAuthenticated && !currentUser)) {
    return (
      <FullScreenLoading
        visible
        text="Checking session..."
      />
    );
  }

  if (!isAuthenticated) {
    return <Redirect href={routes.public.signIn} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(modal)" />
    </Stack>
  );
};

export default ProtectedLayout;
