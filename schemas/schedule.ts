import { ApiScheduleEndType, ICreateScheduleBody, IEditScheduleBody } from "@/types/api/schedule";
import { IDB_Schedule } from "@/types/db";
import { ScheduleEndType } from "@/types/domain";

export const toApiEndType = (
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

export const toCreateScheduleBody = (
  payload: Omit<IDB_Schedule, "id">,
): ICreateScheduleBody => ({
  timezone: payload.timezone,
  start_date: payload.startDate,
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

export const toEditScheduleBody = (
  payload: Partial<IDB_Schedule>,
): IEditScheduleBody => ({
  timezone: payload.timezone,
  start_date: payload.startDate,
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