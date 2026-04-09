import dayjs from "dayjs";

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
import { IPaginationResponse } from "@/types/api/base";
import { IDB_Schedule } from "@/types/db";
import { ScheduleEndType } from "@/types/domain";

import { getAccessiblePatientIds } from "./access";
import { request } from "./client";

const DEFAULT_PAGE_SIZE = 200;

const toDomainEndType = (
  endType: ApiScheduleEndType | null,
): ScheduleEndType | null => {
  if (endType === null) {
    return null;
  }

  if (endType === "counts") {
    return ScheduleEndType.count;
  }

  if (endType === "until") {
    return ScheduleEndType.until;
  }

  return ScheduleEndType.never;
};

const toApiEndType = (
  endType: ScheduleEndType | null,
): ApiScheduleEndType | null => {
  if (endType === null) {
    return null;
  }

  if (endType === ScheduleEndType.count) {
    return "counts";
  }

  if (endType === ScheduleEndType.until) {
    return "until";
  }

  return "never";
};

const toScheduleResponse = (
  schedule: IScheduleDetail,
): IDB_Schedule => ({
  id: schedule.id,
  patientId: schedule.patient_id,
  medicationId: schedule.medication_id,
  timezone: schedule.timezone,
  startAt: schedule.started_at,
  timeSlots: schedule.time_slots ?? [],
  amount: schedule.amount,
  doseUnit: schedule.dose_unit,
  frequencyUnit: schedule.frequency_unit,
  interval: schedule.interval,
  weekdays: schedule.weekdays,
  endType: toDomainEndType(schedule.end_type),
  untilDate: schedule.until_date,
  occurrenceCount: schedule.occurrence_count,
});

const toCreateScheduleBody = (
  payload: Omit<IDB_Schedule, "id">,
): ICreateScheduleBody => ({
  timezone: payload.timezone,
  started_at: payload.startAt,
  time_slots: payload.timeSlots,
  amount: payload.amount,
  dose_unit: payload.doseUnit,
  frequency_unit: payload.frequencyUnit,
  interval: payload.interval,
  weekdays: payload.weekdays,
  end_type: toApiEndType(payload.endType),
  until_date: payload.untilDate,
  occurrence_count: payload.occurrenceCount,
});

const toEditScheduleBody = (
  payload: Partial<IDB_Schedule>,
): IEditScheduleBody => ({
  timezone: payload.timezone,
  started_at: payload.startAt,
  time_slots: payload.timeSlots,
  amount: payload.amount,
  dose_unit: payload.doseUnit,
  frequency_unit: payload.frequencyUnit,
  interval: payload.interval,
  weekdays: payload.weekdays,
  end_type: toApiEndType(payload.endType ?? null),
  until_date: payload.untilDate,
  occurrence_count: payload.occurrenceCount,
});

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

export const fetchSchedules = async ({
  patientId,
  date,
}: {
  patientId?: string;
  date?: string;
} = {}) => {
  const patientIds = patientId
    ? [patientId]
    : await getAccessiblePatientIds();

  if (!patientIds.length) {
    return [];
  }

  if (date) {
    const targetDate = dayjs(date).format("YYYY-MM-DD");
    const response = await getScheduleMatches({
      patient_ids: patientIds,
      from_date: targetDate,
      to_date: targetDate,
    });

    return response.list.map(toScheduleResponse);
  }

  const response = await getScheduleList({
    patient_ids: patientIds,
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    sort_by: "created_at",
    sort_order: "desc",
  });

  return response.list.map(toScheduleResponse);
};

export const fetchScheduleDetail = async (id: string) => {
  const detail = await getScheduleDetail(id);
  return toScheduleResponse(detail);
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
