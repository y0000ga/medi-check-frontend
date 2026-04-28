import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { env } from "@/shared/config/env";
import { tokenStorage } from "@/shared/storage/tokenStorage";
import { ApiResponse } from "./types";

type AppBaseQueryError = {
  statusCode?: number;
  message: string;
  details: string[];
  raw?: unknown;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
});

const normalizeFetchError = (error: FetchBaseQueryError): AppBaseQueryError => {
  if ("status" in error) {
    const data = error.data as Partial<ApiResponse<unknown>> | undefined;

    return {
      statusCode:
        data?.error?.statusCode ??
        (typeof error.status === "number" ? error.status : undefined),
      message: data?.error?.message ?? "API request failed",
      details: data?.error?.details ?? [],
      raw: error,
    };
  }

  return {
    message: "Network error",
    details: [],
    raw: error,
  };
};

const appBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  AppBaseQueryError
> = async (args, api, extraOptions) => {
  const accessToken = await tokenStorage.getAccessToken();

  const headers = new Headers(
    args && typeof args === "object" && "headers" in args
      ? args.headers
      : undefined,
  );

  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  headers.set("content-type", "application/json");

  const requestArgs =
    typeof args === "string"
      ? args
      : {
          ...args,
          headers,
        };

  const result = await rawBaseQuery(requestArgs, api, extraOptions);

  if (result.error) {
    return {
      error: normalizeFetchError(result.error),
    };
  }

  const response = result.data as ApiResponse<unknown>;

  if (!response.success) {
    return {
      error: {
        statusCode: response.error?.statusCode,
        message: response.error?.message ?? "API request failed",
        details: response.error?.details ?? [],
        raw: response,
      },
    };
  }

  return {
    data: response.data,
  };
};

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: appBaseQuery,
  tagTypes: [
    "User",
    "Patient",
    "Medication",
    "Schedule",
    "History",
    "AppConfig",
    "ScheduleMatch",
    "CareInvitation",
    "CareRelationship",
  ],
  endpoints: () => ({}),
});
