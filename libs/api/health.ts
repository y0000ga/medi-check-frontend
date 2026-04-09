import { request } from "./client";

export type HealthCheckResponse = Record<string, unknown>;

export const healthCheck = () =>
  request<HealthCheckResponse>("/health");
