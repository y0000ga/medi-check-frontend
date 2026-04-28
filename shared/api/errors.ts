import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type ApiErrorBody = {
  statusCode: number;
  message: string;
  details: string[];
};

type ApiErrorResponse = {
  success: false;
  error: ApiErrorBody;
  data: null;
};

export type NormalizedApiError = {
  statusCode?: number;
  message: string;
  details: string[];
  raw?: unknown;
};

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (!value || typeof value !== "object") return false;

  const maybeResponse = value as Partial<ApiErrorResponse>;

  return (
    maybeResponse.success === false &&
    !!maybeResponse.error &&
    typeof maybeResponse.error.message === "string"
  );
};

const isFetchBaseQueryError = (
  error: unknown,
): error is FetchBaseQueryError => {
  return !!error && typeof error === "object" && "status" in error;
};

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (isFetchBaseQueryError(error)) {
    if (typeof error.status === "number") {
      const responseData = error.data;

      if (isApiErrorResponse(responseData)) {
        return {
          statusCode: responseData.error.statusCode,
          message: responseData.error.message,
          details: responseData.error.details ?? [],
          raw: error,
        };
      }

      return {
        statusCode: error.status,
        message: "API request failed",
        details: [],
        raw: error,
      };
    }

    return {
      message:
        "error" in error && typeof error.error === "string"
          ? error.error
          : "Network error",
      details: [],
      raw: error,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      details: [],
      raw: error,
    };
  }

  return {
    message: "Unknown error",
    details: [],
    raw: error,
  };
};
