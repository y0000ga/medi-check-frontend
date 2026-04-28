// features/appConfig/appConfigApi.ts

import { appApi } from "@/shared/api/appApi";
import { ValidationConfig, ValidationConfigDto } from "./types";
import { mapValidationConfigDto } from "./mappers";

export const appConfigApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getValidationConfig: builder.query<ValidationConfig, void>({
      query: () => ({
        url: "/app-config/validation",
        method: "GET",
      }),
      transformResponse: (response: ValidationConfigDto) =>
        mapValidationConfigDto(response),
      providesTags: ["AppConfig"],
      keepUnusedDataFor: 60 * 60,
    }),
  }),
});

export const { useGetValidationConfigQuery } = appConfigApi;
