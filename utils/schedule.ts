import dayjs from "dayjs";

import { IScheduleDetail } from "@/store/schedule/type";
import { FrequencyUnit } from "@/types/common";
import { ScheduleEndType } from "@/types/domain";
import { ScheduleRecord } from "@/types/records";
import { ScheduleFormValues } from "@/types/schedule";

export const parseTimeSlots = (value?: string) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const isWithinEndCondition = (
  schedule: ScheduleRecord,
  targetDate: dayjs.Dayjs,
) => {
  if (
    !schedule.endType ||
    schedule.endType === ScheduleEndType.never
  ) {
    return true;
  }

  if (schedule.endType === ScheduleEndType.until) {
    return schedule.untilDate
      ? !targetDate.isAfter(dayjs(schedule.untilDate), "day")
      : true;
  }

  return true;
};

export const scheduleOccursOnDate = (
  schedule: ScheduleRecord,
  targetDate: dayjs.Dayjs,
) => {
  const startDate = dayjs(schedule.startDate);
  const targetDay = targetDate.startOf("day");
  const startDay = startDate.startOf("day");

  if (targetDay.isBefore(startDay)) {
    return false;
  }

  if (!isWithinEndCondition(schedule, targetDay)) {
    return false;
  }

  if (!schedule.frequencyUnit) {
    return targetDay.isSame(startDay, "day");
  }

  const interval = schedule.interval ?? 1;

  switch (schedule.frequencyUnit) {
    case FrequencyUnit.Day: {
      const diffDays = targetDay.diff(startDay, "day");
      return diffDays % interval === 0;
    }
    case FrequencyUnit.Week: {
      const weekdays =
        schedule.weekdays && schedule.weekdays.length > 0
          ? schedule.weekdays
          : [startDate.day()];
      const diffDays = targetDay.diff(startDay, "day");
      const weekOffset = Math.floor(diffDays / 7);

      return (
        weekdays.includes(targetDay.day()) &&
        weekOffset % interval === 0
      );
    }
    case FrequencyUnit.Month: {
      const diffMonths = targetDay
        .startOf("month")
        .diff(startDay.startOf("month"), "month");
      return (
        targetDay.date() === startDate.date() &&
        diffMonths % interval === 0
      );
    }
    case FrequencyUnit.Year: {
      const diffYears = targetDay
        .startOf("year")
        .diff(startDay.startOf("year"), "year");
      return (
        targetDay.date() === startDate.date() &&
        targetDay.month() === startDate.month() &&
        diffYears % interval === 0
      );
    }
    default:
      return false;
  }
};

const countOccurrencesUntil = (
  schedule: ScheduleRecord,
  targetDate: dayjs.Dayjs,
) => {
  let count = 0;
  let cursor = dayjs(schedule.startDate).startOf("day");

  while (
    cursor.isBefore(targetDate, "day") ||
    cursor.isSame(targetDate, "day")
  ) {
    if (scheduleOccursOnDate(schedule, cursor)) {
      count += 1;
    }

    cursor = cursor.add(1, "day");
  }

  return count;
};

export const scheduleMatchesCountLimit = (
  schedule: ScheduleRecord,
  targetDate: dayjs.Dayjs,
) => {
  if (
    schedule.endType !== ScheduleEndType.count ||
    !schedule.occurrenceCount
  ) {
    return true;
  }

  return (
    countOccurrencesUntil(schedule, targetDate) <=
    schedule.occurrenceCount
  );
};

export const scheduleMatchesDate = (
  schedule: ScheduleRecord,
  targetDate: dayjs.Dayjs,
) =>
  scheduleOccursOnDate(schedule, targetDate) &&
  scheduleMatchesCountLimit(schedule, targetDate);

export const toScheduleFormValues = (
  schedule: IScheduleDetail,
): ScheduleFormValues => ({
  id: schedule.id,
  patientId: schedule.patient_id,
  medicationId: schedule.medication_id,
  timezone: schedule.timezone,
  startDate: schedule.start_date,
  timeSlotsText: schedule.time_slots?.join(", "),
  amount: schedule.amount.toString(),
  doseUnit: schedule.dose_unit ?? "",
  frequencyUnit: schedule.frequency_unit ?? "",
  interval: schedule.interval?.toString() ?? "1",
  weekdays: schedule.weekdays ?? [],
  endType: schedule.end_type || null,
  untilDate: schedule.until_date ?? "",
  occurrenceCount: schedule.occurrence_count?.toString() ?? "",
});

export const toSchedulePayload = (
  values: ScheduleFormValues,
): Omit<ScheduleRecord, "id"> => {
  const hasFrequency = values.frequencyUnit !== "";
  const endType =
    hasFrequency && values.endType ? values.endType : null;

  return {
    patientId: values.patientId,
    medicationId: values.medicationId,
    timezone: values.timezone,
    startDate: values.startDate,
    timeSlots: parseTimeSlots(values.timeSlotsText) || [""],
    amount: Number(values.amount) || 1,
    doseUnit: values.doseUnit || null,
    frequencyUnit: hasFrequency
      ? (values.frequencyUnit as FrequencyUnit)
      : null,
    interval: hasFrequency ? Number(values.interval) || 1 : null,
    weekdays:
      hasFrequency && values.frequencyUnit === FrequencyUnit.Week
        ? values.weekdays
        : null,
    endType,
    untilDate:
      endType === ScheduleEndType.until
        ? values.untilDate || null
        : null,
    occurrenceCount:
      endType === ScheduleEndType.count
        ? Number(values.occurrenceCount) || null
        : null,
  };
};
