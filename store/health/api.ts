import { request } from "@/store/api/client";

export type HealthCheckResponse = Record<string, unknown>;

export const healthCheck = () =>
  request<HealthCheckResponse>("/health");
