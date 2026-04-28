import { SortOrder } from "@/shared/api/types";
import {
  EditHistoryRequest,
  EditHistoryRequestDto,
  EditHistoryResponse,
  EditHistoryResponseDto,
  GetHistoriesDto,
  GetHistoriesRequest,
  GetHistoriesResponse,
  GetHistoryDetailResponse,
  HistoryDetailDto,
  HistoryMedicationSnapshot,
  HistoryMedicationSnapshotDto,
  HistoryOverview,
  HistoryOverviewDto,
  HistoryPatientSnapshot,
  HistoryPatientSnapshotDto,
  HistoryScheduleSnapshot,
  HistoryScheduleSnapshotDto,
  QuickCheckHistoryRequest,
  QuickCheckHistoryRequestDto,
  QuickCheckHistoryResponse,
  QuickCheckHistoryResponseDto,
} from "./types";

export const mapHistoryPatientSnapshotDto = (
  dto: HistoryPatientSnapshotDto,
): HistoryPatientSnapshot => {
  return {
    id: dto.id,
    name: dto.name,
  };
};

export const mapHistoryMedicationSnapshotDto = (
  dto: HistoryMedicationSnapshotDto,
): HistoryMedicationSnapshot => {
  return {
    id: dto.id,
    name: dto.name,
    dosageForm: dto.dosage_form,
  };
};

export const mapHistoryScheduleSnapshotDto = (
  dto: HistoryScheduleSnapshotDto,
): HistoryScheduleSnapshot => {
  return {
    id: dto.id,
    scheduledAt: dto.scheduled_at,
    amount: dto.amount,
    doseUnit: dto.dose_unit,
  };
};

export const mapHistoryOverviewDto = (
  dto: HistoryOverviewDto,
): HistoryOverview => {
  return {
    id: dto.id,

    intakeAt: dto.intake_at,
    status: dto.status,
    takenAmount: dto.taken_amount,

    source: dto.source,

    patientSnapshot: mapHistoryPatientSnapshotDto(dto.patient_snapshot),
    medicationSnapshot: mapHistoryMedicationSnapshotDto(
      dto.medication_snapshot,
    ),
    scheduleSnapshot: mapHistoryScheduleSnapshotDto(dto.schedule_snapshot),
  };
};

export const mapHistoryDetailDto = (
  dto: HistoryDetailDto,
): GetHistoryDetailResponse => {
  return {
    ...mapHistoryOverviewDto(dto),
    note: dto.note,
    feeling: dto.feeling,
  };
};

export const mapGetHistoriesRequestDto = (request: GetHistoriesRequest) => {
  return {
    page: request.page,
    page_size: request.pageSize,
    sort_by: request.sortBy,
    sort_order: request.sortOrder ?? SortOrder.desc,

    ...(request.patientIds?.length ? { patient_ids: request.patientIds } : {}),

    ...(request.medicationId ? { medication_id: request.medicationId } : {}),

    ...(request.status ? { status: request.status } : {}),

    ...(request.fromDate ? { from_date: request.fromDate } : {}),

    ...(request.toDate ? { to_date: request.toDate } : {}),
  };
};

export const mapGetHistoriesResponseDto = (
  dto: GetHistoriesDto,
): GetHistoriesResponse => {
  return {
    page: dto.page,
    totalSize: dto.total_size,
    intakenSize: dto.intaken_size,
    missedSize: dto.missed_size,
    list: dto.list.map(mapHistoryOverviewDto),
  };
};

export const mapEditHistoryRequestDto = (
  request: EditHistoryRequest,
): EditHistoryRequestDto => {
  return {
    intake_at: request.intakeAt,
    taken_amount: request.takenAmount,
    ...(request.note !== undefined ? { note: request.note } : {}),
    ...(request.feeling !== undefined ? { feeling: request.feeling } : {}),
  };
};

export const mapEditHistoryResponseDto = (
  dto: EditHistoryResponseDto,
): EditHistoryResponse => {
  return {
    historyId: dto.history_id,
  };
};

export const mapQuickCheckHistoryRequestDto = (
  request: QuickCheckHistoryRequest,
): QuickCheckHistoryRequestDto => {
  return {
    schedule_id: request.scheduleId,
    medication_id: request.medicationId,
    scheduled_at: request.scheduledAt,
  };
};

export const mapQuickCheckHistoryResponseDto = (
  dto: QuickCheckHistoryResponseDto,
): QuickCheckHistoryResponse => {
  return {
    id: dto.id,
    status: dto.status,
    intakeAt: dto.intake_at,
    source: dto.source,
  };
};
