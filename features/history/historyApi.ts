import { appApi } from "@/shared/api/appApi";
import {
  mapEditHistoryRequestDto,
  mapEditHistoryResponseDto,
  mapGetHistoriesRequestDto,
  mapGetHistoriesResponseDto,
  mapHistoryDetailDto,
  mapQuickCheckHistoryRequestDto,
  mapQuickCheckHistoryResponseDto,
} from "./mappers";
import {
  EditHistoryRequest,
  EditHistoryResponse,
  EditHistoryResponseDto,
  GetHistoriesDto,
  GetHistoriesRequest,
  GetHistoriesResponse,
  GetHistoryDetailRequest,
  GetHistoryDetailResponse,
  HistoryDetailDto,
  QuickCheckHistoryRequest,
  QuickCheckHistoryResponse,
  QuickCheckHistoryResponseDto,
} from "./types";

export const historyApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getHistories: builder.query<GetHistoriesResponse, GetHistoriesRequest>({
      query: (payload) => ({
        url: "/histories",
        method: "GET",
        params: mapGetHistoriesRequestDto(payload),
      }),
      transformResponse: (response: GetHistoriesDto) => {
        return mapGetHistoriesResponseDto(response);
      },
      providesTags: ["History"],
    }),

    getHistoryDetail: builder.query<
      GetHistoryDetailResponse,
      GetHistoryDetailRequest
    >({
      query: ({ historyId }) => ({
        url: `/histories/${historyId}`,
        method: "GET",
      }),
      transformResponse: (response: HistoryDetailDto) => {
        return mapHistoryDetailDto(response);
      },
      providesTags: ["History"],
    }),

    editHistory: builder.mutation<EditHistoryResponse, EditHistoryRequest>({
      query: ({ historyId, ...payload }) => ({
        url: `/histories/${historyId}`,
        method: "PATCH",
        body: mapEditHistoryRequestDto({
          historyId,
          ...payload,
        }),
      }),
      transformResponse: (response: EditHistoryResponseDto) => {
        return mapEditHistoryResponseDto(response);
      },
      invalidatesTags: ["History", "ScheduleMatch"],
    }),

    quickCheckHistory: builder.mutation<
      QuickCheckHistoryResponse,
      QuickCheckHistoryRequest
    >({
      query: (payload) => ({
        url: "/histories/quick-check",
        method: "POST",
        body: mapQuickCheckHistoryRequestDto(payload),
      }),
      transformResponse: (response: QuickCheckHistoryResponseDto) => {
        return mapQuickCheckHistoryResponseDto(response);
      },
      invalidatesTags: ["History", "ScheduleMatch"],
    }),
  }),
});

export const {
  useGetHistoriesQuery,
  useGetHistoryDetailQuery,
  useEditHistoryMutation,
  useQuickCheckHistoryMutation,
} = historyApi;
