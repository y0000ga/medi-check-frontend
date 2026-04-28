import {
  IPaginationResponse,
  TPaginationParams,
} from "@/store/api/type";
import { DosageForm, DoseUnit } from "@/types/common";
import { HistoryStatus } from "@/types/domain";
import { HistoryRecord, HistorySource, MedicationRecord, PatientRecord, ScheduleRecord } from "@/types/records";

export interface HistoryItem {
  id: string;
  patientId: string;
  patientName: string;
  medicationId: string | null;
  medicationName: string;
  medicationDosageForm: DosageForm;
  scheduleId: string | null;
  scheduledTime: string;
  amount: number;
  doseUnit: DoseUnit | null;
  intakenTime: string | null;
  status: HistoryStatus;
  takenAmount: number | null;
  source: HistorySource
}

export interface HistoryDetail extends HistoryItem {
  memo: string | null;
  feeling: number | null;
  rate?: number | null;
  reason?: string | null;
  symptomTags?: string[];
  source: HistorySource
}

export interface HistoryListResult {
  list: HistoryItem[];
  totalSize: number;
  page: number;
  intakenSize: number;
  missedSize: number;
}

export interface HistoryItemApi {
  id: string;
  patient_snapshot: {
    id: string;
    name: string;
  };
  medication_snapshot: {
    id: string | null;
    name: string;
    dosage_form: DosageForm;
  };
  schedule_snapshot: {
    id: string | null;
    amount: number;
    scheduled_at: string;
    dose_unit: DoseUnit | null;
  };
  intake_at: string | null;
  status: HistoryStatus;
  taken_amount: number | null;
  source: HistorySource
}

export interface HistoryDetailApi extends HistoryItemApi {
  memo: string | null;
  feeling: number | null;
}

export interface EditHistoryBodyApi {
  intake_at?: string | null;
  taken_amount?: number | null;
  memo?: string | null;
  feeling?: number | null;
}

export interface QuickCheckHistoryBodyApi {
  schedule_id: string;
  medication_id: string;
  scheduled_at: string;
}

export interface EditHistoryResponseApi {
  history_id: string;
}

export interface QuickCheckHistoryResponseApi {
  id: string;
  status: HistoryStatus;
  intake_at: string;
}

export type GetHistoriesParamsApi = TPaginationParams & {
  patient_ids?: string[] | null;
  medication_id?: string | null;
  status?: HistoryStatus | null;
  from_date?: string | null;
  to_date?: string | null;
};

export type HistoryListResponseApi =
  IPaginationResponse<HistoryItemApi> & {
    intaken_size: number;
    missed_size: number;
  };

export interface EventItem {
  id: string;
  scheduleId: ScheduleRecord["id"];
  patientId: PatientRecord["id"];
  patientName: PatientRecord["name"];
  scheduledTime: HistoryRecord["scheduledTime"];
  amount: ScheduleRecord["amount"];
  doseUnit: ScheduleRecord["doseUnit"];
  medicationId: MedicationRecord["id"];
  medicationName: MedicationRecord["name"];
  medicationDosageForm: MedicationRecord["dosageForm"];
}
