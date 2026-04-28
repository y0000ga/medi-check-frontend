import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { setAccessToken } from "@/store/api/client";

import { AuthState } from "./types";

const initialState: AuthState = {
  accessToken: null,
  hasInitializedAuth: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      setAccessToken(action.payload);
    },
    markAuthInitialized(state) {
      state.hasInitializedAuth = true;
    },
    clearSession(state) {
      state.accessToken = null;
      state.hasInitializedAuth = true;
      setAccessToken(null);
    },
  },
});

export const { clearSession, markAuthInitialized, setSession } =
  userSlice.actions;

export const userReducer = userSlice.reducer;
