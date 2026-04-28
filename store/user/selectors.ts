import { RootState } from "@/store";

export const selectAuthState = (state: RootState) => state.auth;
export const selectAccessToken = (state: RootState) =>
  state.auth.accessToken;
export const selectHasInitializedAuth = (state: RootState) =>
  state.auth.hasInitializedAuth;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken);
