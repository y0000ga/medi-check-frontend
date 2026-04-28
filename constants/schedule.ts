import {
  Action,
  DoseUnit,
  FrequencyUnit,
  Weekday,
} from "@/types/common";
import { ScheduleEndType } from "@/types/domain";
import { ScheduleFormValues } from "@/types/schedule";
import { DOSE_UNIT_LABELS } from "./medication";
import dayjs from "dayjs";

export const DEFAULT_SCHEDULE_FORM: ScheduleFormValues = {
  id: "",
  patientId: "",
  medicationId: "",
  timezone:
    Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Taipei",
  startDate: dayjs(new Date().toISOString()).format("YYYY-MM-DD"),
  timeSlotsText: "08:00",
  amount: "1",
  doseUnit: "",
  frequencyUnit: "",
  interval: "1",
  weekdays: [],
  endType: null,
  untilDate: "",
  occurrenceCount: "",
};

export const DOSE_UNIT_OPTIONS = Object.values(DoseUnit).map(
  (value) => ({ value, label: DOSE_UNIT_LABELS[value] }),
);

const FREQUENCY_LABEL = {
  [FrequencyUnit.Day]: "Daily",
  [FrequencyUnit.Week]: "Weekly",
  [FrequencyUnit.Month]: "Monthly",
  [FrequencyUnit.Year]: "Yearly",
};

export const FREQUENCY_OPTIONS = [
  { value: "" as const, label: "One-time" },
  ...[
    FrequencyUnit.Day,
    FrequencyUnit.Week,
    FrequencyUnit.Month,
    FrequencyUnit.Year,
  ].map((value) => ({ value, label: FREQUENCY_LABEL[value] })),
];

export const END_TYPE_LABEL = {
  [ScheduleEndType.count]: "After count",
  [ScheduleEndType.until]: "Until date",
  [ScheduleEndType.never]: "No end date",
};

export const END_TYPE_OPTIONS = Object.values(ScheduleEndType).map(
  (value) => ({ value, label: END_TYPE_LABEL[value] }),
);

export const WEEKDAY_OPTIONS = [
  { value: Weekday.Sun, label: "Sun" },
  { value: Weekday.Mon, label: "Mon" },
  { value: Weekday.Tue, label: "Tue" },
  { value: Weekday.Wed, label: "Wed" },
  { value: Weekday.Thu, label: "Thu" },
  { value: Weekday.Fri, label: "Fri" },
  { value: Weekday.Sat, label: "Sat" },
];

export const TITLE_BY_ACTION: Record<Action, string> = {
  [Action.Create]: "Create reminder",
  [Action.Edit]: "Edit reminder",
  [Action.Info]: "Reminder details",
};

export const BUTTON_BY_ACTION: Record<Action, string> = {
  [Action.Create]: "Create reminder",
  [Action.Edit]: "Save changes",
  [Action.Info]: "Delete reminder",
};

export const CREATE_STEPS = [
  "Select patient",
  "Select medication",
  "Schedule details",
] as const;
