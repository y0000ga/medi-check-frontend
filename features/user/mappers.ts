import {
  EditCurrentUserRequest,
  EditCurrentUserRequestDto,
  EditCurrentUserResponse,
  EditCurrentUserResponseDto,
  LogoutRequest,
  LogoutRequestDto,
  LogoutResponse,
  LogoutResponseDto,
  RefreshAuthRequest,
  RefreshAuthRequestDto,
  RefreshAuthResponse,
  RefreshAuthResponseDto,
  SignUpRequest,
  SignUpRequestDto,
  User,
  UserAuth,
  UserAuthDto,
  UserDto,
} from "./types";

export const mapUserDtoToUser = (dto: UserDto): User => {
  return {
    id: dto.id,
    patientId: dto.patient_id,
    email: dto.email,
    name: dto.name,
    avatarUrl: dto.avatar_url,
    isEmailVerified: dto.is_email_verified,
    status: dto.status,
  };
};

export const mapUserAuthDto = (dto: UserAuthDto): UserAuth => {
  return {
    userId: dto.user_id,
    accessToken: dto.access_token,
    refreshToken: dto.refresh_token,
  };
};

export const mapRefreshAuthRequestDto = (
  request: RefreshAuthRequest,
): RefreshAuthRequestDto => {
  return {
    refresh_token: request.refreshToken,
  };
};

export const mapRefreshAuthResponseDto = (
  dto: RefreshAuthResponseDto,
): RefreshAuthResponse => {
  return mapUserAuthDto(dto);
};

export const mapLogoutRequestDto = (
  request: LogoutRequest,
): LogoutRequestDto => {
  return {
    refresh_token: request.refreshToken,
  };
};

export const mapLogoutResponseDto = (
  dto: LogoutResponseDto,
): LogoutResponse => {
  return dto;
};

export const mapSignUpRequestToDto = (
  request: SignUpRequest,
): SignUpRequestDto => ({
  name: request.name,
  email: request.email,
  birth_date: request.birthDate,
  password: request.password,
});

export const mapEditCurrentUserRequestDto = (
  request: EditCurrentUserRequest,
): EditCurrentUserRequestDto => {
  return {
    ...(request.name !== undefined ? { name: request.name } : {}),
    ...(request.avatarUrl !== undefined
      ? { avatar_url: request.avatarUrl }
      : {}),
    ...(request.birthDate !== undefined
      ? { birth_date: request.birthDate }
      : {}),
  };
};

export const mapEditCurrentUserResponseDto = (
  dto: EditCurrentUserResponseDto,
): EditCurrentUserResponse => {
  return {
    id: dto.id,
  };
};
