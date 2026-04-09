const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface ApiErrorDetail {
  field: string;
  message: string;
  type: string;
}

interface ApiError {
  statusCode: number;
  message: string;
  details?: ApiErrorDetail[] | null;
}

interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface ValidationErrorResponse {
  detail?: ValidationErrorItem[];
}

interface ApiResponse<T> {
  success: boolean;
  error: ApiError | null;
  data: T | null;
}

let accessToken: string | null = null;

export class ApiRequestError extends Error {
  statusCode?: number;
  details?: ApiErrorDetail[] | ValidationErrorItem[] | null;
  raw?: unknown;

  constructor({
    message,
    statusCode,
    details,
    raw,
  }: {
    message: string;
    statusCode?: number;
    details?: ApiErrorDetail[] | ValidationErrorItem[] | null;
    raw?: unknown;
  }) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.details = details;
    this.raw = raw;
  }
}

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const isApiResponse = <T>(
  payload: unknown,
): payload is ApiResponse<T> => {
  return Boolean(
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "error" in payload &&
    "data" in payload,
  );
};

const isValidationErrorResponse = (
  payload: unknown,
): payload is ValidationErrorResponse => {
  return Boolean(
    payload && typeof payload === "object" && "detail" in payload,
  );
};

const formatErrorMessage = (
  error: ApiError | null | undefined,
  fallback = "Request failed",
) => {
  if (!error) {
    return fallback;
  }

  const detailMessage = error.details
    ?.map((detail) => detail.message)
    .filter(Boolean)
    .join(", ");
  return detailMessage
    ? `${error.message}: ${detailMessage}`
    : error.message;
};

const formatValidationErrorMessage = (
  payload: ValidationErrorResponse,
  fallback = "Validation failed",
) => {
  const details = payload.detail ?? [];

  if (!details.length) {
    return fallback;
  }

  return details
    .map((detail) => {
      const fieldPath = detail.loc
        .filter(
          (segment) =>
            segment !== "body" &&
            segment !== "query" &&
            segment !== "path",
        )
        .join(".");

      return fieldPath ? `${fieldPath}: ${detail.msg}` : detail.msg;
    })
    .join(", ");
};

type QueryParamPrimitive =
  | string
  | number
  | boolean
  | null
  | undefined;

type QueryParamValue =
  | QueryParamPrimitive
  | (string | number | boolean)[];

interface RequestOptions<B = unknown, P = unknown> extends Omit<
  RequestInit,
  "body"
> {
  body?: B;
  params?: P;
  token?: string | null;
}

export const request = async <R, B = unknown, P = unknown>(
  path: string,
  options: RequestOptions<B, P> = {},
): Promise<R> => {
  const { body, params, token, headers, ...rest } = options;

  const searchParams = new URLSearchParams();

  Object.entries(
    (params ?? {}) as Record<string, QueryParamValue>,
  ).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(key, String(item));
      });
      return;
    }

    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  const url = `${BASE_URL}${path}${queryString ? `?${queryString}` : ""}`;
  const requestBody: BodyInit | undefined =
    body === undefined || body === null
      ? undefined
      : typeof body === "string"
        ? body
        : JSON.stringify(body);

  const response = await fetch(url, {
    ...rest,
    body: requestBody,
    headers: {
      "Content-Type": "application/json",
      ...((token ?? accessToken)
        ? { Authorization: `Bearer ${token ?? accessToken}` }
        : {}),
      ...headers,
    },
  });

  const rawText = await response.text();
  let payload: unknown = null;

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = rawText;
    }
  }

  if (!response.ok) {
    if (isApiResponse(payload)) {
      throw new ApiRequestError({
        message: formatErrorMessage(payload.error),
        statusCode: payload.error?.statusCode ?? response.status,
        details: payload.error?.details,
        raw: payload,
      });
    }

    if (isValidationErrorResponse(payload)) {
      throw new ApiRequestError({
        message: formatValidationErrorMessage(payload),
        statusCode: response.status,
        details: payload.detail ?? null,
        raw: payload,
      });
    }

    throw new ApiRequestError({
      message:
        typeof payload === "object" &&
        payload &&
        "message" in payload &&
        typeof payload.message === "string"
          ? payload.message
          : rawText || "Request failed",
      statusCode: response.status,
      raw: payload,
    });
  }

  if (isApiResponse<R>(payload)) {
    if (!payload.success || payload.data === null) {
      throw new ApiRequestError({
        message: formatErrorMessage(payload.error),
        statusCode: payload.error?.statusCode ?? response.status,
        details: payload.error?.details,
        raw: payload,
      });
    }

    return payload.data;
  }

  return payload as R;
};
