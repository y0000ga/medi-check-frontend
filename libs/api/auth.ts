import dayjs from "dayjs";

import { RES_USERS } from "@/constants/mock";
import { IRES_User } from "@/types/api";

import { request } from "./client";

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  user_id: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  name: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  token?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatarUrl?: string | null;
}

let mockUsers = [...RES_USERS];
let currentUserId: string | null = RES_USERS[0]?.id ?? null;

export const DEMO_ACCOUNT = {
  email: "demo@medicheck.app",
  password: "demo1234",
} as const;

export const signIn = (payload: SignInPayload) =>
  request<AuthSession>("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(payload),
  })

export const signUp = async (payload: SignUpPayload) =>
  request<AuthSession>("/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(payload),
  })


export async function forgotPassword(payload: ForgotPasswordPayload) {
  // return request<{ success: boolean }>(`/auth/forgot-password`, {
  //   method: "POST",
  //   body: JSON.stringify(payload),
  // });
  return {
    success: true,
    email: payload.email.trim().toLowerCase(),
  };
}

export async function resetPassword(payload: ResetPasswordPayload) {
  // return request<{ success: boolean }>("/auth/reset-password", {
  //   method: "POST",
  //   body: JSON.stringify(payload),
  // });
  if (payload.password !== payload.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  return { success: true };
}

export async function getMe() {
  // return request<IRES_User>("/user/me");
  const user = mockUsers.find((item) => item.id === currentUserId) ?? mockUsers[0];

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  // return request<IRES_User>("/user/me", {
  //   method: "PATCH",
  //   body: JSON.stringify(payload),
  // });
  const userIndex = mockUsers.findIndex((item) => item.id === currentUserId);

  if (userIndex < 0) {
    throw new Error("User not found");
  }

  const currentUser = mockUsers[userIndex];
  const updatedUser: IRES_User = {
    ...currentUser,
    ...payload,
    avatarUrl: payload.avatarUrl === undefined ? currentUser.avatarUrl : payload.avatarUrl,
    name: payload.name ?? currentUser.name,
  };

  mockUsers = mockUsers.map((item, index) => (index === userIndex ? updatedUser : item));

  return updatedUser;
}

export const signOut = () => request<{ success: boolean }>("/auth/sign-out", {
  method: "POST",
})