import { Redirect } from "expo-router";
import { useEffect } from "react";

import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { routes } from "@/constants/route";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  markAuthInitialized,
  selectHasInitializedAuth,
  useAuthUser,
} from "@/store/user";

const IndexScreen = () => {
  const dispatch = useAppDispatch();
  const hasInitializedAuth = useAppSelector(selectHasInitializedAuth);
  const { isAuthenticated, currentUser } = useAuthUser();

  useEffect(() => {
    dispatch(markAuthInitialized());
  }, [dispatch]);

  if (!hasInitializedAuth) {
    return <FullScreenLoading visible text="Checking session..." />;
  }

  if (isAuthenticated && currentUser) {
    return <Redirect href={routes.protected.home} />;
  }

  return <Redirect href={routes.public.signIn} />;
};

export default IndexScreen;
