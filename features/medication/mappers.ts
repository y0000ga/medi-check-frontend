import { SortOrder } from "@/shared/api/types";
import {
  CreateMedicationRequest,
  CreateMedicationRequestDto,
  CreateMedicationResponse,
  CreateMedicationResponseDto,
  EditMedicationRequest,
  EditMedicationRequestDto,
  EditMedicationResponse,
  EditMedicationResponseDto,
  GetAllMedicationsRequest,
  GetAllMedicationsResponse,
  GetMedicationsDto,
  GetPatientMedicationsRequest,
  GetPatientMedicationsResponse,
  MedicationDetail,
  MedicationDetailDto,
  MedicationOverview,
  MedicationOverviewDto,
} from "./types";

export const mapMedicationOverviewDto = (
  dto: MedicationOverviewDto,
): MedicationOverview => {
  return {
    id: dto.id,
    dosageForm: dto.dosage_form,
    patientId: dto.patient_id,
    patientName: dto.patient_name,
    name: dto.name,
  };
};

export const mapMedicationDetailDto = (
  dto: MedicationDetailDto,
): MedicationDetail => {
  return {
    ...mapMedicationOverviewDto(dto),
    note: dto.note,
    permissionLevel: dto.permission_level,
  };
};

export const mapGetAllMedicationsRequestDto = (
  request: GetAllMedicationsRequest,
) => {
  return {
    page: request.page,
    page_size: request.pageSize,
    sort_by: request.sortBy,
    sort_order: request.sortOrder ?? SortOrder.desc,
    ...(request.patientIds?.length ? { patient_ids: request.patientIds } : {}),
    ...(request.dosageForm ? { dosage_form: request.dosageForm } : {}),
    ...(request.search ? { search: request.search } : {}),
  };
};

export const mapGetPatientMedicationsRequestDto = (
  request: GetPatientMedicationsRequest,
) => {
  return {
    page: request.page,
    page_size: request.pageSize,
    sort_by: request.sortBy,
    sort_order: request.sortOrder,
    ...(request.dosageForm ? { dosage_form: request.dosageForm } : {}),
    ...(request.search ? { search: request.search } : {}),
  };
};

export const mapGetMedicationsResponseDto = (
  dto: GetMedicationsDto,
): GetAllMedicationsResponse => {
  return {
    page: dto.page,
    totalSize: dto.total_size,
    list: dto.list.map(mapMedicationOverviewDto),
  };
};

export const mapGetPatientMedicationsResponseDto = (
  dto: GetMedicationsDto,
): GetPatientMedicationsResponse => {
  return {
    page: dto.page,
    totalSize: dto.total_size,
    list: dto.list.map(mapMedicationOverviewDto),
  };
};

export const mapCreateMedicationRequestDto = (
  request: CreateMedicationRequest,
): CreateMedicationRequestDto => {
  return {
    dosage_form: request.dosageForm,
    name: request.name,
    note: request.note,
  };
};

export const mapCreateMedicationResponseDto = (
  dto: CreateMedicationResponseDto,
): CreateMedicationResponse => {
  return {
    id: dto.id,
  };
};

export const mapEditMedicationRequestDto = (
  request: EditMedicationRequest,
): EditMedicationRequestDto => {
  return {
    ...(request.dosageForm !== undefined
      ? { dosage_form: request.dosageForm }
      : {}),
    ...(request.name !== undefined ? { name: request.name } : {}),
    ...(request.note !== undefined ? { note: request.note } : {}),
  };
};

export const mapEditMedicationResponseDto = (
  dto: EditMedicationResponseDto,
): EditMedicationResponse => {
  return {
    medicationId: dto.medication_id,
  };
};
