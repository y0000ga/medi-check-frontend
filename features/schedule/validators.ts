import { FrequencyUnit, ScheduleEndType, ScheduleFormRequest } from "./types";

export type ScheduleFormErrors = Partial<
  Record<
    | "timezone"
    | "startDate"
    | "timeSlots"
    | "amount"
    | "frequencyUnit"
    | "interval"
    | "weekdays"
    | "endType"
    | "untilDate"
    | "occurrenceCount"
    | "form",
    string
  >
>;

const isValidDateString = (value: string) => {
  if (!value) return false;

  const date = new Date(`${value}T00:00:00`);

  return !Number.isNaN(date.getTime());
};

/**
 * 對齊 Python time.fromisoformat 的常見輸入：
 * - HH:mm
 * - HH:mm:ss
 * - HH:mm:ss.SSS
 *
 * 如果你前端統一送 HH:mm:ss，這裡可再收窄。
 */
const isValidIsoTime = (value: string) => {
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d(\.\d{1,6})?)?$/.test(value);
};

const isAfterDate = (targetDate: string, baseDate: string) => {
  const target = new Date(`${targetDate}T00:00:00`);
  const base = new Date(`${baseDate}T00:00:00`);

  return target.getTime() > base.getTime();
};

const hasValue = (value: unknown) => {
  return value !== undefined && value !== null;
};

export const validateScheduleForm = (
  form: ScheduleFormRequest,
): ScheduleFormErrors => {
  const errors: ScheduleFormErrors = {};

  /**
   * Common required
   */

  if (!form.startDate) {
    errors.startDate = "請選擇開始日期";
  } else if (!isValidDateString(form.startDate)) {
    errors.startDate = "開始日期格式不正確";
  }

  if (!form.timeSlots || form.timeSlots.length === 0) {
    errors.timeSlots = "請至少設定一個服藥時間";
  } else {
    const hasInvalidTimeSlot = form.timeSlots.some(
      (timeSlot) => !isValidIsoTime(timeSlot),
    );

    if (hasInvalidTimeSlot) {
      errors.timeSlots = "服藥時間格式不正確";
    }
  }

  if (!Number.isFinite(form.amount)) {
    errors.amount = "請輸入劑量";
  } else if (form.amount <= 0) {
    errors.amount = "劑量必須大於 0";
  }

  /**
   * one-time schedule
   */
  if (form.endType === null) {
    if (hasValue(form.frequencyUnit)) {
      errors.frequencyUnit = "一次性排程不可設定頻率單位";
    }

    if (hasValue(form.interval)) {
      errors.interval = "一次性排程不可設定間隔";
    }

    if (form.weekdays && form.weekdays.length > 0) {
      errors.weekdays = "一次性排程不可設定星期";
    }

    if (hasValue(form.untilDate)) {
      errors.untilDate = "一次性排程不可設定結束日期";
    }

    if (hasValue(form.occurrenceCount)) {
      errors.occurrenceCount = "一次性排程不可設定次數";
    }

    return errors;
  }

  /**
   * recurring schedule
   */
  if (
    form.endType !== ScheduleEndType.never &&
    form.endType !== ScheduleEndType.until &&
    form.endType !== ScheduleEndType.counts
  ) {
    errors.endType = "請選擇正確的結束類型";
    return errors;
  }

  if (!form.frequencyUnit) {
    errors.frequencyUnit = "請選擇頻率單位";
  }

  if (!Number.isFinite(form.interval ?? NaN)) {
    errors.interval = "請輸入間隔";
  } else if ((form.interval ?? 0) <= 0) {
    errors.interval = "間隔必須大於 0";
  }

  if (form.frequencyUnit === FrequencyUnit.week) {
    if (!form.weekdays || form.weekdays.length === 0) {
      errors.weekdays = "每週排程必須選擇星期";
    } else {
      const hasInvalidWeekday = form.weekdays.some(
        (weekday) => weekday < 0 || weekday > 6,
      );

      if (hasInvalidWeekday) {
        errors.weekdays = "星期只能是 0 到 6";
      }
    }
  } else if (form.weekdays && form.weekdays.length > 0) {
    errors.weekdays = "只有每週排程可以設定星期";
  }

  /**
   * end_type rules
   */
  if (form.endType === ScheduleEndType.never) {
    if (hasValue(form.untilDate)) {
      errors.untilDate = "永不結束不可設定結束日期";
    }

    if (hasValue(form.occurrenceCount)) {
      errors.occurrenceCount = "永不結束不可設定次數";
    }
  }

  if (form.endType === ScheduleEndType.until) {
    if (!form.untilDate) {
      errors.untilDate = "請選擇結束日期";
    } else if (!isValidDateString(form.untilDate)) {
      errors.untilDate = "結束日期格式不正確";
    } else if (form.startDate && !isAfterDate(form.untilDate, form.startDate)) {
      errors.untilDate = "結束日期必須晚於開始日期";
    }

    if (hasValue(form.occurrenceCount)) {
      errors.occurrenceCount = "指定結束日期時不可設定次數";
    }
  }

  if (form.endType === ScheduleEndType.counts) {
    if (!Number.isFinite(form.occurrenceCount ?? NaN)) {
      errors.occurrenceCount = "請輸入發生次數";
    } else if ((form.occurrenceCount ?? 0) <= 1) {
      errors.occurrenceCount = "發生次數必須大於 1";
    }

    if (hasValue(form.untilDate)) {
      errors.untilDate = "指定次數時不可設定結束日期";
    }
  }

  return errors;
};

export const isScheduleFormValid = (form: ScheduleFormRequest) => {
  return Object.keys(validateScheduleForm(form)).length === 0;
};
