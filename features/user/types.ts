export type UserDto = {
  id: string;
  patient_id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  is_email_verified: boolean;
  status: string;
};

export type User = {
  id: string;
  patientId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  status: string;
};

export type UserAuthDto = {
  user_id: string;
  access_token: string;
  refresh_token: string;
};

export type UserAuth = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  birthDate: string;
  password: string;
};

export type SignUpRequestDto = {
  name: string;
  email: string;
  birth_date: string;
  password: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type RefreshAuthRequest = {
  refreshToken: string;
};

export type RefreshAuthRequestDto = {
  refresh_token: string;
};

export type RefreshAuthResponseDto = UserAuthDto;

export type RefreshAuthResponse = UserAuth;

export type LogoutRequest = {
  refreshToken: string;
};

export type LogoutRequestDto = {
  refresh_token: string;
};

export type LogoutResponseDto = null;

export type LogoutResponse = null;

export type EditCurrentUserRequest = {
  name?: string;
  avatarUrl?: string | null;
  birthDate?: string;
};

export type EditCurrentUserRequestDto = {
  name?: string;
  avatar_url?: string | null;
  birth_date?: string;
};

export type EditCurrentUserResponse = {
  id: string;
};

export type EditCurrentUserResponseDto = {
  id: string;
};
