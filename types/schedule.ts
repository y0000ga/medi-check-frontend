import { DoseUnit, FrequencyUnit, Weekday } from "@/types/common";
import { IRES_Event } from "./api";
import { ScheduleEndType } from "./domain";

export type IEvent = IRES_Event;

export type ScheduleFormValues = {
  id: string;
  patientId: string;
  medicationId: string;
  timezone: string;
  startAt: string;
  timeSlotsText: string;
  amount: string;
  doseUnit: DoseUnit | "";
  frequencyUnit: FrequencyUnit | "";
  interval: string;
  weekdays: Weekday[];
  endType: ScheduleEndType | "";
  untilDate: string;
  occurrenceCount: string;
};
