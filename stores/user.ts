import { create } from "zustand";

import {
  forgotPassword,
  getMe,
  resetPassword,
  signIn,
  signOut,
  signUp,
  updateProfile,
  type AuthSession,
  type ForgotPasswordPayload,
  type ResetPasswordPayload,
  type SignInPayload,
  type SignUpPayload,
  type UpdateProfilePayload,
} from "@/libs/api/auth";
import { IRES_User } from "@/types/api";

interface UserStore {
  currentUser: IRES_User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean[];
  error: string | null;

  isAuthenticated: () => boolean;
  clearError: () => void;
  addLoading: () => void;
  removeLoading: () => void;

  loadCurrentUser: () => Promise<IRES_User | null>;
  login: (payload: SignInPayload) => Promise<AuthSession>;
  register: (payload: SignUpPayload) => Promise<AuthSession>;
  requestPasswordReset: (payload: ForgotPasswordPayload) => Promise<{ success: boolean; email: string }>;
  confirmPasswordReset: (payload: ResetPasswordPayload) => Promise<{ success: boolean }>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<IRES_User>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>()((set, get) => ({
  currentUser: null,
  accessToken: null,
  refreshToken: null,
  isLoading: [],
  error: null,

  isAuthenticated: () => Boolean(get().currentUser && get().accessToken && get().refreshToken),
  clearError: () => set({ error: null }),
  addLoading: () => set((state) => ({ isLoading: [...state.isLoading, true] })),
  removeLoading: () =>
    set((state) => ({ isLoading: state.isLoading.slice(0, Math.max(0, state.isLoading.length - 1)) })),

  loadCurrentUser: async () => {
    const { addLoading, removeLoading, clearError } = get();

    try {
      addLoading();
      clearError();
      const user = await getMe();
      set({ currentUser: user });
      return user;
    } catch (error) {
      set({
        currentUser: null,
        token: null,
        error: error instanceof Error ? error.message : "Load current user failed",
      });
      return null;
    } finally {
      removeLoading();
    }
  },

  login: async (payload) => {
    const { addLoading, removeLoading, clearError } = get();

    try {
      addLoading();
      clearError();
      const session = await signIn(payload);
      set({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
      });
      return session;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign in failed";
      set({ error: message });
      throw error;
    } finally {
      removeLoading();
    }
  },

  register: async (payload) => {
    const { addLoading, removeLoading, clearError } = get();

    try {
      addLoading();
      clearError();
      const session = await signUp(payload);
      set({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
      });
      return session;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign up failed";
      set({ error: message });
      throw error;
    } finally {
      removeLoading();
    }
  },

  requestPasswordReset: async (payload) => {
    const { addLoading, removeLoading, clearError } = get();

    try {
      addLoading();
      clearError();
      return await forgotPassword(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Forgot password failed";
      set({ error: message });
      throw error;
    } finally {
      removeLoading();
    }
  },

  confirmPasswordReset: async (payload) => {
    const { addLoading, removeLoading, clearError } = get();

    try {
      addLoading();
      clearError();
      return await resetPassword(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Reset password failed";
      set({ error: message });
      throw error;
    } finally {
      removeLoading();
    }
  },

  updateProfile: async (payload) => {
    const { addLoading, removeLoading, clearError } = get();

    try {
      addLoading();
      clearError();
      const user = await updateProfile(payload);
      set({ currentUser: user });
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update profile failed";
      set({ error: message });
      throw error;
    } finally {
      removeLoading();
    }
  },

  logout: async () => {
    const { addLoading, removeLoading, clearError } = get();

    try {
      addLoading();
      clearError();
      await signOut();
      set({
        currentUser: null,
        token: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign out failed";
      set({ error: message });
      throw error;
    } finally {
      removeLoading();
    }
  },
}));
