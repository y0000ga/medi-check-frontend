import { UserStatus } from "@/types/common";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  status: UserStatus;
  patientId: string | null;
}

export interface AuthSession {
  accessToken: string;
  userId: string;
}

export interface AuthApiSession {
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

export interface ApiUserResponse {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  // TODO: ?桀??思??? email ?臬隤??脰???
  is_email_verified: boolean;
  status: UserStatus;
  patient_id: string | null;
}

export interface AuthState {
  accessToken: string | null;
  hasInitializedAuth: boolean;
}
