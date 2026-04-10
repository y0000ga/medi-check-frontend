import { request } from "./client";
import {
  ApiUserResponse,
  AuthApiSession,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
  UpdateProfilePayload,
} from "@/types/api/auth";

/** 登入 */
export const signIn = (payload: SignInPayload) =>
  request<AuthApiSession>("/auth/sign-in", {
    method: "POST",
    body: payload,
  }).then((session) => ({
    accessToken: session.access_token,
    userId: session.user_id,
  }));

/** 註冊 */
export const signUp = async (payload: SignUpPayload) =>
  request<AuthApiSession>("/auth/sign-up", {
    method: "POST",
    body: payload,
  }).then((session) => ({
    accessToken: session.access_token,
    userId: session.user_id,
  }));

/** 更新連線 */
export const refreshSession = () =>
  request<AuthApiSession>("/auth/refresh", {
    method: "POST",
  }).then((session) => ({
    accessToken: session.access_token,
    userId: session.user_id,
  }));

/** 忘記密碼 */
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

/** 重設密碼 */
export const resetPassword = async (
  payload: ResetPasswordPayload,
) => {
  if (payload.password !== payload.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  await request<unknown, ResetPasswordPayload>(
    "/auth/reset-password",
    {
      method: "POST",
      body: payload,
    },
  );

  return { success: true };
};

export const getMe = async () => {
  const user = await request<ApiUserResponse>("/users/me");
  return user;
};

/** 更新個人資訊 */
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

/** 登出 */
export const signOut = () =>
  request<null>("/auth/logout", {
    method: "POST",
  });
