import { ApiPaginationData, TApiPagination } from "@/shared/api/types";
import { DosageForm } from "@/features/medication/types";

export enum ScheduleSortBy {
  createdAt = "created_at",
}

export enum DoseUnit {
  // Mass
  Mcg = "mcg", // 微克
  Mg = "mg", // 毫克
  G = "g", // 公克

  // Volume
  Ml = "ml", // 毫升
  L = "l", // 公升
  Drop = "drop", // 滴

  // Count / solid dosage
  Tablet = "tablet", // 錠
  Capsule = "capsule", // 顆膠囊
  Pill = "pill", // 顆
  Packet = "packet", // 包
  Sachet = "sachet", // 小包
  Piece = "piece", // 個 / 片 / 泛用計數

  // Application
  Spray = "spray", // 噴
  Puff = "puff", // 吸 / puff
  Patch = "patch", // 片貼片
  Application = "application", // 次塗抹
  Suppository = "suppository", // 顆栓劑

  // Liquid household / medicine cup
  Tsp = "tsp", // 茶匙
  Tbsp = "tbsp", // 湯匙
  Cup = "cup", // 杯，較少用但可保留

  // Medical / concentration-related
  Unit = "unit", // 單位，例如 insulin unit
  Iu = "iu", // International Unit
  Meq = "meq", // 毫當量
  Percent = "percent", // 百分比濃度，外用藥可能用到

  Other = "other",
}

export enum FrequencyUnit {
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}

export enum ScheduleEndType {
  never = "never",
  until = "until",
  counts = "counts",
}

export enum IntakeHistoryStatus {
  pending = "pending",
  taken = "taken",
  skipped = "skipped",
  missed = "missed",
}

export type ScheduleEndTypeValue = ScheduleEndType | null;

/**
 * Domain Models
 */

export type Schedule = {
  id: string;

  patientId: string;
  patientName: string;

  medicationId: string;
  medicationName: string;
  medicationDosageForm: DosageForm;

  timezone: string;
  startDate: string; // YYYY-MM-DD
  timeSlots: string[]; // HH:mm:ss or Python time.fromisoformat compatible

  amount: number;
  doseUnit: DoseUnit;

  frequencyUnit: FrequencyUnit | null;
  interval: number | null;
  weekdays: number[];

  endType: ScheduleEndTypeValue;
  untilDate: string | null;
  occurrenceCount: number | null;
};

export type ScheduleHistory = {
  id: string;
  status: IntakeHistoryStatus;
  intakeAt: string;
};

export type ScheduleMatch = {
  scheduleId: string;

  patientId: string;
  patientName: string;

  medicationId: string;
  medicationName: string;
  medicationDosageForm: DosageForm;

  scheduledAt: string;

  amount: number;
  doseUnit: DoseUnit;

  history: ScheduleHistory | null;
};

/**
 * Shared schedule body
 *
 * one-time:
 * - endType = null
 * - frequencyUnit / interval / weekdays / untilDate / occurrenceCount 不可存在
 *
 * recurring:
 * - endType = never / until / counts
 * - frequencyUnit 必填
 * - interval 必填且 > 0
 */
export type ScheduleFormRequest = {
  timezone: string;
  startDate: string;
  timeSlots: string[];

  amount: number;
  doseUnit: DoseUnit;

  endType: ScheduleEndTypeValue;

  frequencyUnit?: FrequencyUnit | null;
  interval?: number | null;
  weekdays?: number[];

  untilDate?: string | null;
  occurrenceCount?: number | null;
};

/**
 * Requests / Responses
 */

export type GetSchedulesRequest = TApiPagination<ScheduleSortBy> & {
  patientIds?: string[];
};

export type GetSchedulesResponse = ApiPaginationData<Schedule>;

export type GetScheduleDetailRequest = {
  scheduleId: string;
};

export type GetScheduleDetailResponse = Schedule;

export type GetScheduleMatchesRequest = {
  patientIds?: string[];
  fromDate: string;
  toDate: string;
};

export type GetScheduleMatchesResponse = {
  fromDate: string;
  toDate: string;
  list: ScheduleMatch[];
};

export type CreateScheduleRequest = ScheduleFormRequest & {
  medicationId: string;
};

export type CreateScheduleResponse = {
  id: string;
};

export type EditScheduleRequest = ScheduleFormRequest & {
  scheduleId: string;
};

export type EditScheduleResponse = {
  scheduleId: string;
};

export type RemoveScheduleRequest = {
  scheduleId: string;
};

export type RemoveScheduleResponse = null;

/**
 * DTOs
 */

export type ScheduleDto = {
  id: string;

  patient_id: string;
  patient_name: string;

  medication_id: string;
  medication_name: string;
  medication_dosage_form: DosageForm;

  timezone: string;
  start_date: string;
  time_slots: string[];

  amount: number;
  dose_unit: DoseUnit;

  frequency_unit: FrequencyUnit | null;
  interval: number | null;
  weekdays: number[];

  end_type: ScheduleEndTypeValue;
  until_date: string | null;
  occurrence_count: number | null;
};

export type GetSchedulesDto = {
  page: number;
  total_size: number;
  list: ScheduleDto[];
};

export type ScheduleHistoryDto = {
  id: string;
  status: IntakeHistoryStatus;
  intake_at: string;
};

export type ScheduleMatchDto = {
  schedule_id: string;

  patient_id: string;
  patient_name: string;

  medication_id: string;
  medication_name: string;
  medication_dosage_form: DosageForm;

  scheduled_at: string;

  amount: number;
  dose_unit: DoseUnit;

  history: ScheduleHistoryDto | null;
};

export type GetScheduleMatchesDto = {
  from_date: string;
  to_date: string;
  list: ScheduleMatchDto[];
};

export type ScheduleFormRequestDto = {
  timezone: string;
  start_date: string;
  time_slots: string[];

  amount: number;
  dose_unit: DoseUnit;

  end_type: ScheduleEndTypeValue;

  frequency_unit?: FrequencyUnit | null;
  interval?: number | null;
  weekdays?: number[];

  until_date?: string | null;
  occurrence_count?: number | null;
};

export type CreateScheduleRequestDto = ScheduleFormRequestDto;

export type CreateScheduleResponseDto = {
  id: string;
};

export type EditScheduleRequestDto = ScheduleFormRequestDto;

export type EditScheduleResponseDto = {
  schedule_id: string;
};
