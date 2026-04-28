import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./types";

type UserState = {
  isBootstrapped: boolean;
  isAuthenticated: boolean;
  currentUser: User | null;
};

const initialState: UserState = {
  isBootstrapped: false,
  isAuthenticated: false,
  currentUser: null,
};

export const userStore = createSlice({
  name: "user",
  initialState,
  reducers: {
    setBootstrapped: (state, action: PayloadAction<boolean>) => {
      state.isBootstrapped = action.payload;
    },

    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },

    clearUser: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
    },
  },
});

export const { setBootstrapped, setAuthenticated, setCurrentUser, clearUser } =
  userStore.actions;

export const userReducer = userStore.reducer;
