import { DoseUnit, FrequencyUnit, Weekday } from "@/types/common";
import { ScheduleEndType } from "./domain";

export type ScheduleFormValues = {
  id: string;
  patientId: string;
  medicationId: string;
  timezone: string;
  startDate: string;
  timeSlotsText: string;
  amount: string;
  doseUnit: DoseUnit | "";
  frequencyUnit: FrequencyUnit | "";
  interval: string;
  weekdays: Weekday[];
  endType: ScheduleEndType | null;
  untilDate: string;
  occurrenceCount: string;
};
