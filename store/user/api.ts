import { createApi } from "@reduxjs/toolkit/query/react";

import { ApiRequestError, request } from "@/store/api/client";
import {
  ApiUserResponse,
  AuthApiSession,
  AuthSession,
  CurrentUser,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
  UpdateProfilePayload,
} from "./types";

import { mapCurrentUserFromApi } from "./mappers";

type QueryError = {
  status?: number;
  data: string;
};

const baseQuery = async (args: {
  path: string;
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
}) => {
  try {
    const data = await request(args.path, {
      method: args.method,
      body: args.body,
    });

    return { data };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return {
        error: {
          status: error.statusCode,
          data: error.message,
        } satisfies QueryError,
      };
    }

    return {
      error: {
        data:
          error instanceof Error ? error.message : "Request failed",
      } satisfies QueryError,
    };
  }
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<CurrentUser, void>({
      queryFn: async () => {
        try {
          const user = await request<ApiUserResponse>("/users/me");
          return { data: mapCurrentUserFromApi(user) };
        } catch (error) {
          if (error instanceof ApiRequestError) {
            return {
              error: {
                status: error.statusCode,
                data: error.message,
              },
            };
          }

          return {
            error: {
              data:
                error instanceof Error
                  ? error.message
                  : "Request failed",
            },
          };
        }
      },
      providesTags: ["User"],
    }),
    signIn: builder.mutation<AuthSession, SignInPayload>({
      queryFn: async (payload) => {
        try {
          const session = await request<AuthApiSession>(
            "/auth/sign-in",
            {
              method: "POST",
              body: payload,
            },
          );

          return {
            data: {
              accessToken: session.access_token,
              userId: session.user_id,
            },
          };
        } catch (error) {
          if (error instanceof ApiRequestError) {
            return {
              error: {
                status: error.statusCode,
                data: error.message,
              },
            };
          }

          return {
            error: {
              data:
                error instanceof Error
                  ? error.message
                  : "Request failed",
            },
          };
        }
      },
    }),
    signUp: builder.mutation<AuthSession, SignUpPayload>({
      queryFn: async (payload) => {
        try {
          const session = await request<AuthApiSession>(
            "/auth/sign-up",
            {
              method: "POST",
              body: payload,
            },
          );

          return {
            data: {
              accessToken: session.access_token,
              userId: session.user_id,
            },
          };
        } catch (error) {
          if (error instanceof ApiRequestError) {
            return {
              error: {
                status: error.statusCode,
                data: error.message,
              },
            };
          }

          return {
            error: {
              data:
                error instanceof Error
                  ? error.message
                  : "Request failed",
            },
          };
        }
      },
    }),
    forgotPassword: builder.mutation<
      { success: boolean; email: string },
      ForgotPasswordPayload
    >({
      queryFn: async (payload) => {
        try {
          await request("/auth/forgot-password", {
            method: "POST",
            body: payload,
          });

          return {
            data: {
              success: true,
              email: payload.email.trim().toLowerCase(),
            },
          };
        } catch (error) {
          if (error instanceof ApiRequestError) {
            return {
              error: {
                status: error.statusCode,
                data: error.message,
              },
            };
          }

          return {
            error: {
              data:
                error instanceof Error
                  ? error.message
                  : "Request failed",
            },
          };
        }
      },
    }),
    resetPassword: builder.mutation<
      { success: boolean },
      ResetPasswordPayload
    >({
      queryFn: async (payload) => {
        try {
          if (payload.password !== payload.confirmPassword) {
            return {
              error: {
                data: "Passwords do not match",
              },
            };
          }

          await request("/auth/reset-password", {
            method: "POST",
            body: payload,
          });

          return {
            data: {
              success: true,
            },
          };
        } catch (error) {
          if (error instanceof ApiRequestError) {
            return {
              error: {
                status: error.statusCode,
                data: error.message,
              },
            };
          }

          return {
            error: {
              data:
                error instanceof Error
                  ? error.message
                  : "Request failed",
            },
          };
        }
      },
    }),
    updateProfile: builder.mutation<
      CurrentUser,
      UpdateProfilePayload
    >({
      queryFn: async (payload) => {
        try {
          await request<{ id: string }>("/users/me", {
            method: "PATCH",
            body: {
              name: payload.name,
              avatar_url: payload.avatarUrl,
              birth_date: payload.birthDate,
            },
          });
          const user = await request<ApiUserResponse>("/users/me");
          return { data: mapCurrentUserFromApi(user) };
        } catch (error) {
          if (error instanceof ApiRequestError) {
            return {
              error: {
                status: error.statusCode,
                data: error.message,
              },
            };
          }

          return {
            error: {
              data:
                error instanceof Error
                  ? error.message
                  : "Request failed",
            },
          };
        }
      },
      invalidatesTags: ["User"],
    }),
    signOut: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          await request("/auth/logout", {
            method: "POST",
          });
          return { data: undefined };
        } catch (error) {
          if (error instanceof ApiRequestError) {
            return {
              error: {
                status: error.statusCode,
                data: error.message,
              },
            };
          }

          return {
            error: {
              data:
                error instanceof Error
                  ? error.message
                  : "Request failed",
            },
          };
        }
      },
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useResetPasswordMutation,
  useSignInMutation,
  useSignOutMutation,
  useSignUpMutation,
  useUpdateProfileMutation,
} = userApi;
