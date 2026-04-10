import {
  DosageForm,
  DoseUnit,
  FrequencyUnit,
  Weekday,
} from "@/types/common";

import { TPaginationParams } from "./base";
import { HistoryStatus } from "../domain";

export type ApiScheduleEndType = "never" | "until" | "counts";

export interface IScheduleEvent {
  schedule_id: string;
  patient_id: string;
  patient_name: string;
  medication_id: string;
  medication_name: string;
  medication_dosage_form: DosageForm;
  scheduled_at: string;
  amount: number;
  dose_unit: DoseUnit;
  history: null | {
    id: string;
    status: HistoryStatus;
    intake_at: string | null;
  };
}

export interface IScheduleDetail {
  id: string;
  patient_id: string;
  medication_id: string;
  timezone: string;
  start_date: string;
  time_slots: string[] | null;
  amount: number;
  dose_unit: DoseUnit | null;
  frequency_unit: FrequencyUnit | null;
  interval: number | null;
  weekdays: Weekday[] | null;
  end_type: ApiScheduleEndType | null;
  until_date: string | null;
  occurrence_count: number | null;
}

export interface ICreateScheduleBody {
  timezone: string;
  start_date: string;
  time_slots?: string[] | null;
  amount: number;
  dose_unit?: DoseUnit | null;
  frequency_unit?: FrequencyUnit | null;
  interval?: number | null;
  weekdays?: Weekday[] | null;
  end_type?: ApiScheduleEndType | null;
  until_date?: string | null;
  occurrence_count?: number | null;
}

export interface IEditScheduleBody {
  timezone?: string | null;
  start_date?: string | null;
  time_slots?: string[] | null;
  amount?: number | null;
  dose_unit?: DoseUnit | null;
  frequency_unit?: FrequencyUnit | null;
  interval?: number | null;
  weekdays?: Weekday[] | null;
  end_type?: ApiScheduleEndType | null;
  until_date?: string | null;
  occurrence_count?: number | null;
}

export interface ICreateScheduleResponse {
  id: string;
}

export interface IEditScheduleResponse {
  schedule_id: string;
}

export interface IScheduleMatchesResponse {
  from_date: string;
  to_date: string;
  list: IScheduleEvent[];
}

export type TGetSchedulesParams = TPaginationParams & {
  patient_ids?: string[] | null;
};

export type TGetScheduleMatchesParams = {
  patient_ids?: string[] | null;
  from_date: string;
  to_date: string;
};
