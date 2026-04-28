import { SortOrder } from "@/shared/api/types";
import {
  CreateScheduleRequest,
  CreateScheduleRequestDto,
  CreateScheduleResponse,
  CreateScheduleResponseDto,
  EditScheduleRequest,
  EditScheduleRequestDto,
  EditScheduleResponse,
  EditScheduleResponseDto,
  FrequencyUnit,
  GetScheduleMatchesDto,
  GetScheduleMatchesRequest,
  GetScheduleMatchesResponse,
  GetSchedulesDto,
  GetSchedulesRequest,
  GetSchedulesResponse,
  Schedule,
  ScheduleDto,
  ScheduleEndType,
  ScheduleFormRequest,
  ScheduleFormRequestDto,
  ScheduleHistory,
  ScheduleHistoryDto,
  ScheduleMatch,
  ScheduleMatchDto,
} from "./types";

export const mapScheduleDto = (dto: ScheduleDto): Schedule => {
  return {
    id: dto.id,

    patientId: dto.patient_id,
    patientName: dto.patient_name,

    medicationId: dto.medication_id,
    medicationName: dto.medication_name,
    medicationDosageForm: dto.medication_dosage_form,

    timezone: dto.timezone,
    startDate: dto.start_date,
    timeSlots: dto.time_slots,

    amount: dto.amount,
    doseUnit: dto.dose_unit,

    frequencyUnit: dto.frequency_unit,
    interval: dto.interval,
    weekdays: dto.weekdays,

    endType: dto.end_type,
    untilDate: dto.until_date,
    occurrenceCount: dto.occurrence_count,
  };
};

export const mapGetSchedulesRequestDto = (request: GetSchedulesRequest) => {
  return {
    page: request.page,
    page_size: request.pageSize,
    sort_by: request.sortBy,
    sort_order: request.sortOrder ?? SortOrder.desc,
    ...(request.patientIds?.length ? { patient_ids: request.patientIds } : {}),
  };
};

export const mapGetSchedulesResponseDto = (
  dto: GetSchedulesDto,
): GetSchedulesResponse => {
  return {
    page: dto.page,
    totalSize: dto.total_size,
    list: dto.list.map(mapScheduleDto),
  };
};

export const mapScheduleHistoryDto = (
  dto: ScheduleHistoryDto,
): ScheduleHistory => {
  return {
    id: dto.id,
    status: dto.status,
    intakeAt: dto.intake_at,
  };
};

export const mapScheduleMatchDto = (dto: ScheduleMatchDto): ScheduleMatch => {
  return {
    scheduleId: dto.schedule_id,

    patientId: dto.patient_id,
    patientName: dto.patient_name,

    medicationId: dto.medication_id,
    medicationName: dto.medication_name,
    medicationDosageForm: dto.medication_dosage_form,

    scheduledAt: dto.scheduled_at,

    amount: dto.amount,
    doseUnit: dto.dose_unit,

    history: dto.history ? mapScheduleHistoryDto(dto.history) : null,
  };
};

export const mapGetScheduleMatchesRequestDto = (
  request: GetScheduleMatchesRequest,
) => {
  return {
    ...(request.patientIds?.length ? { patient_ids: request.patientIds } : {}),
    from_date: request.fromDate,
    to_date: request.toDate,
  };
};

export const mapGetScheduleMatchesResponseDto = (
  dto: GetScheduleMatchesDto,
): GetScheduleMatchesResponse => {
  return {
    fromDate: dto.from_date,
    toDate: dto.to_date,
    list: dto.list.map(mapScheduleMatchDto),
  };
};

/**
 * create/edit body 共用。
 *
 * one-time:
 * - end_type: null
 * - 不送 frequency_unit / interval / weekdays / until_date / occurrence_count
 *
 * recurring:
 * - end_type: never / until / counts
 * - 依規則送 frequency_unit / interval / weekdays / until_date / occurrence_count
 */
export const mapScheduleFormRequestDto = (
  request: ScheduleFormRequest,
): ScheduleFormRequestDto => {
  const base = {
    timezone: request.timezone,
    start_date: request.startDate,
    time_slots: request.timeSlots,

    amount: request.amount,
    dose_unit: request.doseUnit,

    end_type: request.endType,
  };

  /**
   * one-time
   * end_type = null 時，只送 common 欄位
   */
  if (request.endType === null) {
    return base;
  }

  /**
   * recurring common
   * 注意：這裡不要預設送 weekdays
   */
  const recurringBase: ScheduleFormRequestDto = {
    ...base,
    frequency_unit: request.frequencyUnit ?? null,
    interval: request.interval ?? null,
  };

  /**
   * 只有 weekly schedule 才允許送 weekdays
   */
  const recurringWithWeekdays =
    request.frequencyUnit === FrequencyUnit.week
      ? {
          ...recurringBase,
          weekdays: request.weekdays ?? [],
        }
      : recurringBase;

  if (request.endType === ScheduleEndType.never) {
    return recurringWithWeekdays;
  }

  if (request.endType === ScheduleEndType.until) {
    return {
      ...recurringWithWeekdays,
      until_date: request.untilDate ?? null,
    };
  }

  if (request.endType === ScheduleEndType.counts) {
    return {
      ...recurringWithWeekdays,
      occurrence_count: request.occurrenceCount ?? null,
    };
  }

  return recurringWithWeekdays;
};

export const mapCreateScheduleRequestDto = (
  request: CreateScheduleRequest,
): CreateScheduleRequestDto => {
  return mapScheduleFormRequestDto(request);
};

export const mapCreateScheduleResponseDto = (
  dto: CreateScheduleResponseDto,
): CreateScheduleResponse => {
  return {
    id: dto.id,
  };
};

export const mapEditScheduleRequestDto = (
  request: EditScheduleRequest,
): EditScheduleRequestDto => {
  return mapScheduleFormRequestDto(request);
};

export const mapEditScheduleResponseDto = (
  dto: EditScheduleResponseDto,
): EditScheduleResponse => {
  return {
    scheduleId: dto.schedule_id,
  };
};
