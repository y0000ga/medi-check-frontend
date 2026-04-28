import { appApi } from "@/shared/api/appApi";
import {
  mapGetCareRelationshipsRequestDto,
  mapGetCareRelationshipsResponseDto,
} from "./mappers";
import {
  GetCareRelationshipsDto,
  GetCareRelationshipsRequest,
  GetCareRelationshipsResponse,
} from "./types";

export const careRelationshipApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getCareRelationships: builder.query<
      GetCareRelationshipsResponse,
      GetCareRelationshipsRequest
    >({
      query: (payload) => ({
        url: "/care-relationships",
        method: "GET",
        params: mapGetCareRelationshipsRequestDto(payload),
      }),
      transformResponse: (response: GetCareRelationshipsDto) => {
        return mapGetCareRelationshipsResponseDto(response);
      },
      providesTags: ["CareRelationship"],
    }),
  }),
});

export const { useGetCareRelationshipsQuery } = careRelationshipApi;
