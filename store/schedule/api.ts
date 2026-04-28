import { apiBaseQuery } from "@/store/api/base-query";
import { IPaginationResponse } from "@/store/api/type";
import {
  ICreateScheduleBody,
  ICreateScheduleResponse,
  IEditScheduleBody,
  IEditScheduleResponse,
  IScheduleDetail,
  IScheduleMatchesResponse,
  TGetScheduleMatchesParams,
  TGetSchedulesParams,
} from "@/store/schedule/type";
import { createApi } from "@reduxjs/toolkit/query/react";

export const scheduleApi = createApi({
  reducerPath: "scheduleApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["Schedule"],
  endpoints: (builder) => ({
    getScheduleList: builder.query<
      IPaginationResponse<IScheduleDetail>,
      TGetSchedulesParams
    >({
      query: (params) => ({
        path: "/schedules",
        params,
      }),
      providesTags: ["Schedule"],
    }),
    getScheduleMatches: builder.query<
      IScheduleMatchesResponse,
      TGetScheduleMatchesParams
    >({
      query: (params) => ({
        path: "/schedule-matches",
        params,
      }),
      providesTags: ["Schedule"],
    }),
    getScheduleDetail: builder.query<IScheduleDetail, string>({
      query: (scheduleId) => ({
        path: `/schedules/${scheduleId}`,
      }),
      providesTags: (_result, _error, id) => [
        { type: "Schedule", id },
      ],
    }),
    createMedicationSchedule: builder.mutation<
      ICreateScheduleResponse,
      { medicationId: string; body: ICreateScheduleBody }
    >({
      query: ({ medicationId, body }) => ({
        path: `/medications/${medicationId}/schedules`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Schedule"],
    }),
    editSchedule: builder.mutation<
      IEditScheduleResponse,
      { scheduleId: string; body: IEditScheduleBody }
    >({
      query: ({ scheduleId, body }) => ({
        path: `/schedules/${scheduleId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Schedule", id: arg.scheduleId },
        "Schedule",
      ],
    }),
    removeSchedule: builder.mutation<null, string>({
      query: (scheduleId) => ({
        path: `/schedules/${scheduleId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Schedule", id },
        "Schedule",
      ],
    }),
  }),
});

export const {
  useCreateMedicationScheduleMutation,
  useEditScheduleMutation,
  useGetScheduleDetailQuery,
  useGetScheduleListQuery,
  useGetScheduleMatchesQuery,
  useRemoveScheduleMutation,
} = scheduleApi;
