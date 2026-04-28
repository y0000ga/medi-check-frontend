import { appApi } from "@/shared/api/appApi";
import {
  mapCreateScheduleRequestDto,
  mapCreateScheduleResponseDto,
  mapEditScheduleRequestDto,
  mapEditScheduleResponseDto,
  mapGetScheduleMatchesRequestDto,
  mapGetScheduleMatchesResponseDto,
  mapGetSchedulesRequestDto,
  mapGetSchedulesResponseDto,
  mapScheduleDto,
} from "./mappers";
import {
  CreateScheduleRequest,
  CreateScheduleResponse,
  CreateScheduleResponseDto,
  EditScheduleRequest,
  EditScheduleResponse,
  EditScheduleResponseDto,
  GetScheduleDetailRequest,
  GetScheduleDetailResponse,
  GetScheduleMatchesDto,
  GetScheduleMatchesRequest,
  GetScheduleMatchesResponse,
  GetSchedulesDto,
  GetSchedulesRequest,
  GetSchedulesResponse,
  RemoveScheduleRequest,
  RemoveScheduleResponse,
  ScheduleDto,
} from "./types";

export const scheduleApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query<GetSchedulesResponse, GetSchedulesRequest>({
      query: (payload) => ({
        url: "/schedules",
        method: "GET",
        params: mapGetSchedulesRequestDto(payload),
      }),
      transformResponse: (response: GetSchedulesDto) => {
        return mapGetSchedulesResponseDto(response);
      },
      providesTags: ["Schedule"],
    }),

    getScheduleMatches: builder.query<
      GetScheduleMatchesResponse,
      GetScheduleMatchesRequest
    >({
      query: (payload) => ({
        url: "/schedule-matches",
        method: "GET",
        params: mapGetScheduleMatchesRequestDto(payload),
      }),
      transformResponse: (response: GetScheduleMatchesDto) => {
        return mapGetScheduleMatchesResponseDto(response);
      },
      providesTags: ["ScheduleMatch"],
    }),

    getScheduleDetail: builder.query<
      GetScheduleDetailResponse,
      GetScheduleDetailRequest
    >({
      query: ({ scheduleId }) => ({
        url: `/schedules/${scheduleId}`,
        method: "GET",
      }),
      transformResponse: (response: ScheduleDto) => {
        return mapScheduleDto(response);
      },
      providesTags: ["Schedule"],
    }),

    createSchedule: builder.mutation<
      CreateScheduleResponse,
      CreateScheduleRequest
    >({
      query: ({ medicationId, ...payload }) => ({
        url: `/medications/${medicationId}/schedules`,
        method: "POST",
        body: mapCreateScheduleRequestDto({
          medicationId,
          ...payload,
        }),
      }),
      transformResponse: (response: CreateScheduleResponseDto) => {
        return mapCreateScheduleResponseDto(response);
      },
      invalidatesTags: ["Schedule", "ScheduleMatch"],
    }),

    editSchedule: builder.mutation<EditScheduleResponse, EditScheduleRequest>({
      query: ({ scheduleId, ...payload }) => ({
        url: `/schedules/${scheduleId}`,
        method: "PATCH",
        body: mapEditScheduleRequestDto({
          scheduleId,
          ...payload,
        }),
      }),
      transformResponse: (response: EditScheduleResponseDto) => {
        return mapEditScheduleResponseDto(response);
      },
      invalidatesTags: ["Schedule", "ScheduleMatch"],
    }),

    removeSchedule: builder.mutation<
      RemoveScheduleResponse,
      RemoveScheduleRequest
    >({
      query: ({ scheduleId }) => ({
        url: `/schedules/${scheduleId}`,
        method: "DELETE",
      }),
      transformResponse: (response: RemoveScheduleResponse) => {
        return response;
      },
      invalidatesTags: ["Schedule", "ScheduleMatch"],
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useGetScheduleMatchesQuery,
  useGetScheduleDetailQuery,
  useCreateScheduleMutation,
  useEditScheduleMutation,
  useRemoveScheduleMutation,
} = scheduleApi;
