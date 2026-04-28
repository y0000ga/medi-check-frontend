import {
  FrequencyUnit,
  Schedule,
  ScheduleEndType,
  ScheduleEndTypeValue,
} from "./types";

export const getFrequencyUnitLabel = (value?: FrequencyUnit | null) => {
  switch (value) {
    case FrequencyUnit.day:
      return "天";
    case FrequencyUnit.week:
      return "週";
    case FrequencyUnit.month:
      return "月";
    case FrequencyUnit.year:
      return "年";
    default:
      return "未設定";
  }
};

export const getEndTypeLabel = (value: ScheduleEndTypeValue) => {
  switch (value) {
    case null:
      return "一次性";
    case ScheduleEndType.never:
      return "永不結束";
    case ScheduleEndType.until:
      return "到指定日期";
    case ScheduleEndType.counts:
      return "指定次數";
    default:
      return "未知";
  }
};

export const getWeekdayLabel = (weekday: number) => {
  switch (weekday) {
    case 0:
      return "週日";
    case 1:
      return "週一";
    case 2:
      return "週二";
    case 3:
      return "週三";
    case 4:
      return "週四";
    case 5:
      return "週五";
    case 6:
      return "週六";
    default:
      return String(weekday);
  }
};

export const formatWeekdays = (weekdays: number[]) => {
  if (!weekdays.length) return "未設定";
  return weekdays.map(getWeekdayLabel).join("、");
};

export const getScheduleRuleText = (schedule: Schedule) => {
  if (schedule.endType === null) {
    return "一次性排程";
  }

  if (!schedule.frequencyUnit || !schedule.interval) {
    return "重複規則未完整設定";
  }

  if (schedule.frequencyUnit === FrequencyUnit.week) {
    return `每 ${schedule.interval} 週｜${formatWeekdays(schedule.weekdays)}`;
  }

  return `每 ${schedule.interval} ${getFrequencyUnitLabel(
    schedule.frequencyUnit,
  )}`;
};

export const getEndConditionText = (schedule: Schedule) => {
  switch (schedule.endType) {
    case null:
      return "只發生一次";
    case ScheduleEndType.never:
      return "永不結束";
    case ScheduleEndType.until:
      return schedule.untilDate ? `到 ${schedule.untilDate}` : "未設定結束日期";
    case ScheduleEndType.counts:
      return schedule.occurrenceCount
        ? `共 ${schedule.occurrenceCount} 次`
        : "未設定次數";
    default:
      return "未知";
  }
};
