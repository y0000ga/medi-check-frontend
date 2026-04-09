import { IRES_User } from "@/types/api";

import { request } from "./client";

export interface AuthSession {
  accessToken: string;
  userId: string;
}

interface AuthApiSession {
  access_token: string;
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
  birthDate?: string | null;
}

interface ApiUserResponse {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  // TODO: 目前暫不針對 email 是否認證進行處理
  is_email_verified: boolean;
  status: IRES_User["status"];
  patient_id: string | null;
}

export const DEMO_ACCOUNT = {
  email: "demo@medicheck.app",
  password: "demo1234",
} as const;

export const signIn = (payload: SignInPayload) =>
  request<AuthApiSession>(
    "/auth/sign-in",
    {
      method: "POST",
      body: payload,
    },
  ).then((session) => ({
    accessToken: session.access_token,
    userId: session.user_id,
  }));

export const signUp = async (payload: SignUpPayload) =>
  request<AuthApiSession>("/auth/sign-up", {
    method: "POST",
    body: payload,
  }).then((session) => ({
    accessToken: session.access_token,
    userId: session.user_id,
  }));

export const refreshSession = () =>
  request<AuthApiSession>("/auth/refresh", {
    method: "POST",
  }).then((session) => ({
    accessToken: session.access_token,
    userId: session.user_id,
  }));

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
) => {
  await request<unknown, ForgotPasswordPayload>(
    "/auth/forgot-password",
    {
      method: "POST",
      body: payload,
    },
  );

  return {
    success: true,
    email: payload.email.trim().toLowerCase(),
  };
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
) => {
  if (payload.password !== payload.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  await request<unknown, ResetPasswordPayload>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });

  return { success: true };
};

export const getMe = async () => {
  const user = await request<ApiUserResponse>("/users/me");
  return mapApiUser(user);
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
) => {
  await request<{ id: string }>("/users/me", {
    method: "PATCH",
    body: {
      name: payload.name,
      avatar_url: payload.avatarUrl,
      birth_date: payload.birthDate,
    },
  });

  return getMe();
};

export const signOut = () =>
  request<null>("/auth/logout", {
    method: "POST",
  });

export const mapApiUser = (user: ApiUserResponse): IRES_User => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatar_url,
    isEmailVerified: user.is_email_verified,
    status: user.status,
    patient_id: user.patient_id,
  };
};
