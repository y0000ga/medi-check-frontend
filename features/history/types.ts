import { ApiPaginationData, TApiPagination } from "@/shared/api/types";
import { DosageForm } from "@/features/medication/types";
import { DoseUnit, IntakeHistoryStatus } from "@/features/schedule/types";

export enum HistorySortBy {
  createdAt = "created_at",
  intakeAt = "intake_at",
}

export enum HistorySource {
  quickCheck = "quickCheck",
  manual = "manual",
  system = "system",
}

/**
 * Snapshots
 */

export type HistoryPatientSnapshot = {
  id: string;
  name: string;
};

export type HistoryMedicationSnapshot = {
  id: string;
  name: string;
  dosageForm: DosageForm;
};

export type HistoryScheduleSnapshot = {
  id: string;
  scheduledAt: string;
  amount: number;
  doseUnit: DoseUnit;
};

/**
 * Domain Models
 */

export type HistoryOverview = {
  id: string;

  intakeAt: string;
  status: IntakeHistoryStatus;
  takenAmount: number;

  source: HistorySource;

  patientSnapshot: HistoryPatientSnapshot;
  medicationSnapshot: HistoryMedicationSnapshot;
  scheduleSnapshot: HistoryScheduleSnapshot;
};

export type HistoryDetail = HistoryOverview & {
  note: string | null;
  feeling: number | null;
};

/**
 * Requests / Responses
 */

export type GetHistoriesRequest = TApiPagination<HistorySortBy> & {
  patientIds?: string[];
  medicationId?: string | null;
  status?: IntakeHistoryStatus | null;
  fromDate?: string | null;
  toDate?: string | null;
};

export type GetHistoriesResponse = ApiPaginationData<HistoryOverview> & {
  intakenSize: number;
  missedSize: number;
};

export type GetHistoryDetailRequest = {
  historyId: string;
};

export type GetHistoryDetailResponse = HistoryDetail;

export type EditHistoryRequest = {
  historyId: string;

  intakeAt: string;
  takenAmount: number;
  note?: string | null;
  feeling?: number | null;
};

export type EditHistoryResponse = {
  historyId: string;
};

export type QuickCheckHistoryRequest = {
  scheduleId: string;
  medicationId: string;
  scheduledAt: string;
};

export type QuickCheckHistoryResponse = {
  id: string;
  status: IntakeHistoryStatus;
  intakeAt: string;
  source: HistorySource;
};

/**
 * DTOs
 */

export type HistoryPatientSnapshotDto = {
  id: string;
  name: string;
};

export type HistoryMedicationSnapshotDto = {
  id: string;
  name: string;
  dosage_form: DosageForm;
};

export type HistoryScheduleSnapshotDto = {
  id: string;
  scheduled_at: string;
  amount: number;
  dose_unit: DoseUnit;
};

export type HistoryOverviewDto = {
  id: string;

  intake_at: string;
  status: IntakeHistoryStatus;
  taken_amount: number;

  source: HistorySource;

  patient_snapshot: HistoryPatientSnapshotDto;
  medication_snapshot: HistoryMedicationSnapshotDto;
  schedule_snapshot: HistoryScheduleSnapshotDto;
};

export type HistoryDetailDto = HistoryOverviewDto & {
  note: string | null;
  feeling: number | null;
};

export type GetHistoriesDto = {
  page: number;
  total_size: number;
  intaken_size: number;
  missed_size: number;
  list: HistoryOverviewDto[];
};

export type EditHistoryRequestDto = {
  intake_at: string;
  taken_amount: number;
  note?: string | null;
  feeling?: number | null;
};

export type EditHistoryResponseDto = {
  history_id: string;
};

export type QuickCheckHistoryRequestDto = {
  schedule_id: string;
  medication_id: string;
  scheduled_at: string;
};

export type QuickCheckHistoryResponseDto = {
  id: string;
  status: IntakeHistoryStatus;
  intake_at: string;
  source: HistorySource;
};

/** Editable Form */

export type HistoryEditForm = {
  intakeDate: Date | null;
  intakeTime: string;
  takenAmount: string;
  note: string;
  feeling: number | null;
};

export type HistoryEditErrors = Partial<
  Record<
    "intakeDate" | "intakeTime" | "takenAmount" | "note" | "feeling" | "form",
    string
  >
>;
