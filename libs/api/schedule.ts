import dayjs from "dayjs";

import { IPaginationResponse } from "@/types/api/base";
import {
  ApiScheduleEndType,
  ICreateScheduleBody,
  ICreateScheduleResponse,
  IEditScheduleBody,
  IEditScheduleResponse,
  IScheduleDetail,
  IScheduleMatchesResponse,
  TGetScheduleMatchesParams,
  TGetSchedulesParams,
} from "@/types/api/schedule";
import { IDB_Schedule } from "@/types/db";

import { request } from "./client";
import {
  toCreateScheduleBody,
  toEditScheduleBody,
} from "@/schemas/schedule";

export const getScheduleList = (params: TGetSchedulesParams) =>
  request<
    IPaginationResponse<IScheduleDetail>,
    undefined,
    TGetSchedulesParams
  >("/schedules", { params });

export const getScheduleMatches = (
  params: TGetScheduleMatchesParams,
) =>
  request<
    IScheduleMatchesResponse,
    undefined,
    TGetScheduleMatchesParams
  >("/schedule-matches", { params });

export const getScheduleDetail = (scheduleId: string) =>
  request<IScheduleDetail>(`/schedules/${scheduleId}`);

export const createMedicationSchedule = (
  medicationId: string,
  body: ICreateScheduleBody,
) =>
  request<ICreateScheduleResponse, ICreateScheduleBody>(
    `/medications/${medicationId}/schedules`,
    {
      method: "POST",
      body,
    },
  );

export const editSchedule = (
  scheduleId: string,
  body: IEditScheduleBody,
) =>
  request<IEditScheduleResponse, IEditScheduleBody>(
    `/schedules/${scheduleId}`,
    {
      method: "PATCH",
      body,
    },
  );

export const removeSchedule = (scheduleId: string) =>
  request<null>(`/schedules/${scheduleId}`, {
    method: "DELETE",
  });

export const fetchScheduleEvents = async ({
  date,
}: {
  date: string;
}) => {
  const targetDate = dayjs(date).format("YYYY-MM-DD");
  const response = await getScheduleMatches({
    from_date: targetDate,
    to_date: targetDate,
  });
  return response.list;
};

export const fetchScheduleDetail = async (id: string) => {
  const detail = await getScheduleDetail(id);
  return detail;
};

export const createSchedule = async (
  payload: Omit<IDB_Schedule, "id">,
) => {
  const created = await createMedicationSchedule(
    payload.medicationId,
    toCreateScheduleBody(payload),
  );

  return fetchScheduleDetail(created.id);
};

export const updateSchedule = async (
  id: string,
  payload: Partial<IDB_Schedule>,
) => {
  await editSchedule(id, toEditScheduleBody(payload));
  return fetchScheduleDetail(id);
};

export const deleteSchedule = async (id: string) => {
  await removeSchedule(id);
};
