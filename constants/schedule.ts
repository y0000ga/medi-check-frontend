import {
  Action,
  DoseUnit,
  FrequencyUnit,
  Weekday,
} from "@/types/common";
import { ScheduleEndType } from "@/types/domain";
import { ScheduleFormValues } from "@/types/schedule";
import { DOSE_UNIT_LABELS } from "./medication";

export const DEFAULT_SCHEDULE_FORM: ScheduleFormValues = {
  id: "",
  patientId: "",
  medicationId: "",
  timezone:
    Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Taipei",
  startAt: new Date().toISOString(),
  timeSlotsText: "08:00",
  amount: "1",
  doseUnit: "",
  frequencyUnit: "",
  interval: "1",
  weekdays: [],
  endType: "",
  untilDate: "",
  occurrenceCount: "",
};

export const DOSE_UNIT_OPTIONS = Object.values(DoseUnit).map(
  (value) => ({ value, label: DOSE_UNIT_LABELS[value] }),
);

const FREQUENCY_LABEL = {
  [FrequencyUnit.Day]: "每天",
  [FrequencyUnit.Week]: "每週",
  [FrequencyUnit.Month]: "每月",
  [FrequencyUnit.Year]: "每年",
};

export const FREQUENCY_OPTIONS = [
  { value: "" as const, label: "單次提醒" },
  ...[
    FrequencyUnit.Day,
    FrequencyUnit.Week,
    FrequencyUnit.Month,
    FrequencyUnit.Year,
  ].map((value) => ({ value, label: FREQUENCY_LABEL[value] })),
];

export const END_TYPE_LABEL = {
  [ScheduleEndType.count]: "指定次數",
  [ScheduleEndType.until]: "到指定日期",
  [ScheduleEndType.never]: "不設定結束",
};

export const END_TYPE_OPTIONS = Object.values(ScheduleEndType).map(
  (value) => ({ value, label: END_TYPE_LABEL[value] }),
);

export const WEEKDAY_OPTIONS = [
  { value: Weekday.Sun, label: "日" },
  { value: Weekday.Mon, label: "一" },
  { value: Weekday.Tue, label: "二" },
  { value: Weekday.Wed, label: "三" },
  { value: Weekday.Thu, label: "四" },
  { value: Weekday.Fri, label: "五" },
  { value: Weekday.Sat, label: "六" },
];

export const TITLE_BY_ACTION: Record<Action, string> = {
  [Action.Create]: "新增提醒",
  [Action.Edit]: "編輯提醒",
  [Action.Info]: "提醒資訊",
};

export const BUTTON_BY_ACTION: Record<Action, string> = {
  [Action.Create]: "建立提醒",
  [Action.Edit]: "儲存變更",
  [Action.Info]: "刪除此提醒",
};
