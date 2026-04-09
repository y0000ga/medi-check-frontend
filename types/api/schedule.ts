import {
  DoseUnit,
  FrequencyUnit,
  Weekday,
} from "@/types/common";
import { ScheduleEndType } from "@/types/domain";

import { TPaginationParams } from "./base";

export type ApiScheduleEndType =
  | "never"
  | "until"
  | "counts";

export interface IScheduleDetail {
  id: string;
  patient_id: string;
  medication_id: string;
  timezone: string;
  started_at: string;
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
  started_at: string;
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
  started_at?: string | null;
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
  list: IScheduleDetail[];
}

export type TGetSchedulesParams = TPaginationParams & {
  patient_ids?: string[] | null;
};

export type TGetScheduleMatchesParams = {
  patient_ids?: string[] | null;
  from_date: string;
  to_date: string;
};
