import { appApi } from "@/shared/api/appApi";
import { tokenStorage } from "@/shared/storage/tokenStorage";
import {
  mapEditCurrentUserRequestDto,
  mapEditCurrentUserResponseDto,
  mapLogoutRequestDto,
  mapLogoutResponseDto,
  mapRefreshAuthRequestDto,
  mapRefreshAuthResponseDto,
  mapSignUpRequestToDto,
  mapUserAuthDto,
  mapUserDtoToUser,
} from "./mappers";
import {
  EditCurrentUserRequest,
  EditCurrentUserResponse,
  EditCurrentUserResponseDto,
  LogoutRequest,
  LogoutResponse,
  LogoutResponseDto,
  RefreshAuthRequest,
  RefreshAuthResponse,
  RefreshAuthResponseDto,
  SignInRequest,
  SignUpRequest,
  User,
  UserAuth,
  UserAuthDto,
  UserDto,
} from "./types";
import {
  clearUser,
  setAuthenticated,
  setBootstrapped,
  setCurrentUser,
} from "./userStore";

export const userApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<UserAuth, SignUpRequest>({
      query: (payload) => ({
        url: "/auth/sign-up",
        method: "POST",
        body: mapSignUpRequestToDto(payload),
      }),
      transformResponse: (response: UserAuthDto) => {
        return mapUserAuthDto(response);
      },
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          await tokenStorage.setAccessToken(data.accessToken);
          await tokenStorage.setRefreshToken(data.refreshToken);

          dispatch(setAuthenticated(true));
          dispatch(setBootstrapped(true));
        } catch {
          await tokenStorage.clearTokens();

          dispatch(clearUser());
          dispatch(setBootstrapped(true));
        }
      },
    }),

    signIn: builder.mutation<UserAuth, SignInRequest>({
      query: (payload) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: UserAuthDto) => {
        return mapUserAuthDto(response);
      },
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          await tokenStorage.setAccessToken(data.accessToken);
          await tokenStorage.setRefreshToken(data.refreshToken);

          dispatch(setAuthenticated(true));
          dispatch(setBootstrapped(true));
        } catch {
          await tokenStorage.clearTokens();

          dispatch(clearUser());
          dispatch(setBootstrapped(true));
        }
      },
    }),

    refreshAuth: builder.mutation<RefreshAuthResponse, RefreshAuthRequest>({
      query: (payload) => ({
        url: "/auth/refresh",
        method: "POST",
        body: mapRefreshAuthRequestDto(payload),
      }),
      transformResponse: (response: RefreshAuthResponseDto) => {
        return mapRefreshAuthResponseDto(response);
      },
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          await tokenStorage.setAccessToken(data.accessToken);
          await tokenStorage.setRefreshToken(data.refreshToken);

          dispatch(setAuthenticated(true));
          dispatch(setBootstrapped(true));
        } catch {
          await tokenStorage.clearTokens();

          dispatch(clearUser());
          dispatch(setBootstrapped(true));
        }
      },
    }),

    logout: builder.mutation<LogoutResponse, LogoutRequest>({
      query: (payload) => ({
        url: "/auth/logout",
        method: "POST",
        body: mapLogoutRequestDto(payload),
      }),
      transformResponse: (response: LogoutResponseDto) => {
        return mapLogoutResponseDto(response);
      },
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // logout should not block local sign-out
        } finally {
          await tokenStorage.clearTokens();

          dispatch(clearUser());
          dispatch(setBootstrapped(true));
          dispatch(appApi.util.resetApiState());
        }
      },
    }),
    editCurrentUser: builder.mutation<
      EditCurrentUserResponse,
      EditCurrentUserRequest
    >({
      query: (payload) => ({
        url: "/users/me",
        method: "PATCH",
        body: mapEditCurrentUserRequestDto(payload),
      }),
      transformResponse: (response: EditCurrentUserResponseDto) => {
        return mapEditCurrentUserResponseDto(response);
      },
      invalidatesTags: ["User"],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      transformResponse: (response: UserDto) => {
        return mapUserDtoToUser(response);
      },
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setCurrentUser(data));
          dispatch(setAuthenticated(true));
          dispatch(setBootstrapped(true));
        } catch {
          dispatch(clearUser());
          dispatch(setBootstrapped(true));
        }
      },
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useRefreshAuthMutation,
  useLogoutMutation,
  useEditCurrentUserMutation,
  useGetCurrentUserQuery,
} = userApi;
