import { createApi } from "@reduxjs/toolkit/query/react";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";

import { apiBaseQuery } from "@/store/api/base-query";
import { ApiRequestError, request } from "@/store/api/client";

import {
  mapHistoryDetailFromApi,
  mapHistoryItemFromApi,
} from "./mappers";
import { EditHistoryBodyApi, GetHistoriesParamsApi, HistoryDetail, HistoryDetailApi, HistoryListResponseApi, HistoryListResult, QuickCheckHistoryBodyApi, QuickCheckHistoryResponseApi } from "./types";

dayjs.extend(tz);

export const historyApi = createApi({
  reducerPath: "historyApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["History"],
  endpoints: (builder) => ({
    getHistories: builder.query<
      HistoryListResult,
      { date: string; page: number; pageSize: number }
    >({
      query: ({ date, page, pageSize }) => {
        const params: GetHistoriesParamsApi = {
          page,
          page_size: pageSize,
          sort_by: "scheduled_at",
          sort_order: "desc",
          from_date: dayjs(date).tz("Asia/Taipei").format("YYYY-MM-DD"),
          to_date: dayjs(date).tz("Asia/Taipei").format("YYYY-MM-DD"),
        };

        return {
          path: "/histories",
          params,
        };
      },
      transformResponse: (response: HistoryListResponseApi) => ({
        list: response.list.map(mapHistoryItemFromApi),
        totalSize: response.total_size,
        page: response.page,
        intakenSize: response.intaken_size,
        missedSize: response.missed_size,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.list.map((item) => ({
                type: "History" as const,
                id: item.id,
              })),
              { type: "History" as const, id: "LIST" },
            ]
          : [{ type: "History" as const, id: "LIST" }],
    }),
    getHistoryDetail: builder.query<HistoryDetail, string>({
      query: (id) => ({
        path: `/histories/${id}`,
      }),
      transformResponse: (response: HistoryDetailApi) =>
        mapHistoryDetailFromApi(response),
      providesTags: (_result, _error, id) => [
        { type: "History", id },
      ],
    }),
    updateHistory: builder.mutation<
      HistoryDetail,
      { id: string; body: EditHistoryBodyApi }
    >({
      queryFn: async ({ id, body }) => {
        try {
          await request(`/histories/${id}`, {
            method: "PATCH",
            body,
          });
          const detail = await request<HistoryDetailApi>(
            `/histories/${id}`,
          );
          return { data: mapHistoryDetailFromApi(detail) };
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
              data:
                error instanceof Error ? error.message : "Request failed",
            },
          };
        }
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: "History", id: arg.id },
        { type: "History", id: "LIST" },
      ],
    }),
    quickCheckHistory: builder.mutation<
      QuickCheckHistoryResponseApi,
      QuickCheckHistoryBodyApi
    >({
      query: (body) => ({
        path: "/histories/quick-check",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "History", id: "LIST" }],
    }),
  }),
});

export const {
  useGetHistoriesQuery,
  useGetHistoryDetailQuery,
  useQuickCheckHistoryMutation,
  useUpdateHistoryMutation,
} = historyApi;

export const quickCheckHistory = (
  body: QuickCheckHistoryBodyApi,
) =>
  request<QuickCheckHistoryResponseApi, QuickCheckHistoryBodyApi>(
    "/histories/quick-check",
    {
      method: "POST",
      body,
    },
  );
