import { BaseQueryFn } from "@reduxjs/toolkit/query/react";

import { ApiRequestError, request } from "@/store/api/client";

export type ApiQueryArgs = {
  path: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  params?: unknown;
};

export type ApiQueryError = {
  status?: number;
  data: string;
};

export const apiBaseQuery: BaseQueryFn<
  ApiQueryArgs,
  unknown,
  ApiQueryError
> = async ({ path, method = "GET", body, params }) => {
  try {
    const data = await request(path, {
      method,
      body,
      params,
    });

    return { data };
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
        data: error instanceof Error ? error.message : "Request failed",
      },
    };
  }
};
