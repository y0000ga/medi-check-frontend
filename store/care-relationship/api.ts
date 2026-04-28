import { apiBaseQuery } from "@/store/api/base-query";
import { request } from "@/store/api/client";
import { IPaginationResponse } from "@/store/api/type";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ICareRelationship, TGetCareRelationshipParams } from "./type";

export const careRelationshipApi = createApi({
  reducerPath: "careRelationshipApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["CareRelationship"],
  endpoints: (builder) => ({
    getCareRelationships: builder.query<
      IPaginationResponse<ICareRelationship>,
      TGetCareRelationshipParams
    >({
      query: (params) => ({
        path: "/care-relationships",
        params,
      }),
      providesTags: ["CareRelationship"],
    }),
  }),
});

export const { useGetCareRelationshipsQuery } = careRelationshipApi;

export const getCareRelationships = (
  params: TGetCareRelationshipParams,
) =>
  request<
    IPaginationResponse<ICareRelationship>,
    undefined,
    TGetCareRelationshipParams
  >("/care-relationships", { params });
