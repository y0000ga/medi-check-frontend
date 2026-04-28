import { useCallback } from "react";

import { ApiRequestError } from "@/store/api/client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { userApi } from "./api";
import { clearSession, setSession } from "./slice";
import {
  AuthSession,
  SignInPayload,
  SignUpPayload,
} from "./types";
import { selectIsAuthenticated } from "./selectors";

export const useCurrentUser = () =>
  useAppSelector(userApi.endpoints.getCurrentUser.select()).data;

export const useAuthUser = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useCurrentUser();

  return {
    isAuthenticated,
    currentUser,
  };
};

export const useAuthFlows = () => {
  const dispatch = useAppDispatch();
  const [signInMutation, signInState] = userApi.useSignInMutation();
  const [signUpMutation, signUpState] = userApi.useSignUpMutation();
  const [signOutMutation, signOutState] = userApi.useSignOutMutation();
  const [loadCurrentUser] = userApi.useLazyGetCurrentUserQuery();

  const hydrateSession = useCallback(
    async (session: AuthSession) => {
      dispatch(setSession(session.accessToken));
      const currentUser = await loadCurrentUser().unwrap();
      return { session, currentUser };
    },
    [dispatch, loadCurrentUser],
  );

  const signIn = useCallback(
    async (payload: SignInPayload) => {
      const session = await signInMutation(payload).unwrap();
      return hydrateSession(session);
    },
    [hydrateSession, signInMutation],
  );

  const signUp = useCallback(
    async (payload: SignUpPayload) => {
      const session = await signUpMutation(payload).unwrap();
      return hydrateSession(session);
    },
    [hydrateSession, signUpMutation],
  );

  const signOut = useCallback(async () => {
    try {
      await signOutMutation().unwrap();
    } catch (error) {
      if (!(error instanceof ApiRequestError)) {
        throw error;
      }
    } finally {
      dispatch(clearSession());
    }
  }, [dispatch, signOutMutation]);

  return {
    signIn,
    signUp,
    signOut,
    isSigningIn: signInState.isLoading,
    isSigningUp: signUpState.isLoading,
    isSigningOut: signOutState.isLoading,
  };
};
