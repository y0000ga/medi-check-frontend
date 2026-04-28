import {
  ICreateScheduleBody,
  IEditScheduleBody,
} from "@/store/schedule/type";
import { ScheduleRecord } from "@/types/records";

export const toCreateScheduleBody = (
  payload: Omit<ScheduleRecord, "id">,
): ICreateScheduleBody => ({
  timezone: payload.timezone,
  start_date: payload.startDate,
  time_slots: payload.timeSlots,
  amount: payload.amount,
  dose_unit: payload.doseUnit,
  frequency_unit: payload.frequencyUnit,
  interval: payload.interval,
  weekdays: payload.weekdays,
  end_type: payload.endType || null,
  until_date: payload.untilDate,
  occurrence_count: payload.occurrenceCount,
});

export const toEditScheduleBody = (
  payload: Partial<ScheduleRecord>,
): IEditScheduleBody => ({
  ...(payload.timezone !== undefined
    ? { timezone: payload.timezone }
    : {}),
  ...(payload.startDate !== undefined
    ? { start_date: payload.startDate }
    : {}),
  ...(payload.timeSlots !== undefined
    ? { time_slots: payload.timeSlots }
    : {}),
  ...(payload.amount !== undefined ? { amount: payload.amount } : {}),
  ...(payload.doseUnit !== undefined
    ? { dose_unit: payload.doseUnit }
    : {}),
  ...(payload.frequencyUnit !== undefined
    ? { frequency_unit: payload.frequencyUnit }
    : {}),
  ...(payload.interval !== undefined
    ? { interval: payload.interval }
    : {}),
  ...(payload.weekdays !== undefined
    ? { weekdays: payload.weekdays }
    : {}),
  ...(payload.endType !== undefined
    ? { end_type: payload.endType || null }
    : {}),
  ...(payload.untilDate !== undefined
    ? { until_date: payload.untilDate }
    : {}),
  ...(payload.occurrenceCount !== undefined
    ? { occurrence_count: payload.occurrenceCount }
    : {}),
});
