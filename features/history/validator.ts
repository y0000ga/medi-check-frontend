import {
  formatDateToYYYYMMDD,
  formatScheduledTime,
  parseDate,
} from "@/utils/common";
import { HistoryDetail, HistoryEditErrors, HistoryEditForm } from "./types";

const normalizeTimeInput = (value: string) => {
  const trimmed = value.trim();

  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(trimmed)) {
    return `${trimmed}:00`;
  }

  if (/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(trimmed)) {
    return trimmed;
  }

  return null;
};

export const validateForm = (form: HistoryEditForm): HistoryEditErrors => {
  const errors: HistoryEditErrors = {};

  if (!form.intakeDate) {
    errors.intakeDate = "請選擇實際服藥日期";
  }

  if (!form.intakeTime.trim()) {
    errors.intakeTime = "請輸入實際服藥時間";
  } else if (!normalizeTimeInput(form.intakeTime)) {
    errors.intakeTime = "時間格式需為 HH:mm，例如 08:30";
  }

  const amount = Number(form.takenAmount);

  if (!form.takenAmount.trim()) {
    errors.takenAmount = "請輸入實際服用劑量";
  } else if (!Number.isFinite(amount)) {
    errors.takenAmount = "劑量格式不正確";
  } else if (amount < 0) {
    errors.takenAmount = "劑量不可小於 0";
  }

  if (form.note.length > 500) {
    errors.note = "備註不可超過 500 字";
  }

  if (form.feeling !== null && (form.feeling < 1 || form.feeling > 5)) {
    errors.feeling = "身體感受需介於 1 到 5";
  }

  return errors;
};

export const mapHistoryToForm = (history: HistoryDetail): HistoryEditForm => {
  const intakeDate = parseDate(history.intakeAt);

  return {
    intakeDate,
    intakeTime: intakeDate ? formatScheduledTime(intakeDate) : "",
    takenAmount: String(history.takenAmount ?? ""),
    note: history.note ?? "",
    feeling: history.feeling,
  };
};

export const combineDateAndTimeToIso = (date: Date, time: string) => {
  const normalizedTime = normalizeTimeInput(time);

  if (!normalizedTime) {
    return null;
  }

  const datePart = formatDateToYYYYMMDD(date);
  const localDateTime = new Date(`${datePart}T${normalizedTime}`);

  if (Number.isNaN(localDateTime.getTime())) {
    return null;
  }

  return localDateTime.toISOString();
};
