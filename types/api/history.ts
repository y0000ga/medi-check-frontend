import { DoseUnit, DosageForm } from "@/types/common";
import { HistorySource, HistoryStatus } from "@/types/domain";

import { TPaginationParams } from "./base";

export interface IHistory {
  id: string;
  patient_id: string;
  schedule_id: string | null;
  medication_id: string | null;
  scheduled_at: string;
  intake_at: string | null;
  status: HistoryStatus;
  source: HistorySource;
  amount_snapshot: number;
  dose_unit_snapshot: DoseUnit | null;
  taken_amount: number | null;
  medication_name_snapshot: string;
}

export interface IHistoryDetail extends IHistory {
  memo: string | null;
  feeling: number | null;
  medication_dosage_form_snapshot: DosageForm | null;
}

export interface IEditHistoryBody {
  intake_at?: string | null;
  taken_amount?: number | null;
  memo?: string | null;
  feeling?: number | null;
}

export interface IQuickCheckHistoryBody {
  schedule_id: string;
  medication_id: string;
  scheduled_at: string;
}

export interface IEditHistoryResponse {
  history_id: string;
}

export interface IQuickCheckHistoryResponse {
  id: string;
}

export type TGetHistoriesParams = TPaginationParams & {
  patient_ids?: string[] | null;
  medication_id?: string | null;
  status?: HistoryStatus | null;
  from_date?: string | null;
  to_date?: string | null;
};
