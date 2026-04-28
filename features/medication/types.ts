import { ApiPaginationData, TApiPagination } from "@/shared/api/types";
import { PermissionLevel } from "@/features/patient/types";

export enum DosageForm {
  Tablet = "tablet", // 錠劑
  Capsule = "capsule", // 膠囊
  Softgel = "softgel", // 軟膠囊
  Pill = "pill", // 藥丸，泛稱

  Liquid = "liquid", // 液體
  Syrup = "syrup", // 糖漿
  Suspension = "suspension", // 懸浮液
  Drops = "drops", // 滴劑

  Powder = "powder", // 粉末
  Granule = "granule", // 顆粒
  Sachet = "sachet", // 藥包 / 小包裝粉劑

  Injection = "injection", // 注射劑
  Vial = "vial", // 小瓶針劑
  Ampoule = "ampoule", // 安瓿

  Inhaler = "inhaler", // 吸入劑
  Spray = "spray", // 噴劑
  NebulizerSolution = "nebulizer_solution", // 霧化液

  Cream = "cream", // 乳膏
  Ointment = "ointment", // 軟膏
  Gel = "gel", // 凝膠
  Lotion = "lotion", // 乳液

  Patch = "patch", // 貼片
  Suppository = "suppository", // 栓劑
  EyeDrops = "eye_drops", // 眼藥水
  EarDrops = "ear_drops", // 耳滴劑
  NasalSpray = "nasal_spray", // 鼻噴劑

  Other = "other", // 其他
}

export enum MedicationsSortBy {
  createdAt = "created_at",
  name = "name",
  dosageForm = "dosage_form",
}

export type MedicationOverview = {
  id: string;
  dosageForm: DosageForm;
  patientId: string;
  patientName: string;
  name: string;
};

export type MedicationDetail = MedicationOverview & {
  note: string;
  permissionLevel: PermissionLevel;
};

export type GetMedicationsRequest = TApiPagination<MedicationsSortBy> & {
  patientId: string;
  dosageForm?: DosageForm | null;
  search?: string;
};

export type GetMedicationsResponse = ApiPaginationData<MedicationOverview>;

export type CreateMedicationRequest = {
  patientId: string;
  dosageForm: DosageForm;
  name: string;
  note: string;
};

export type CreateMedicationResponse = {
  id: string;
};

export type GetMedicationDetailRequest = {
  medicationId: string;
};

export type GetMedicationDetailResponse = MedicationDetail;

export type EditMedicationRequest = {
  medicationId: string;
  dosageForm?: DosageForm;
  name?: string;
  note?: string;
};

export type EditMedicationResponse = {
  medicationId: string;
};

export type RemoveMedicationRequest = {
  medicationId: string;
};

export type RemoveMedicationResponse = null;

/**
 * DTO
 */

export type MedicationOverviewDto = {
  id: string;
  dosage_form: DosageForm;
  patient_id: string;
  patient_name: string;
  name: string;
};

export type MedicationDetailDto = MedicationOverviewDto & {
  note: string;
  permission_level: PermissionLevel;
};

export type GetMedicationsDto = {
  page: number;
  total_size: number;
  list: MedicationOverviewDto[];
};

export type CreateMedicationRequestDto = {
  dosage_form: DosageForm;
  name: string;
  note: string;
};

export type CreateMedicationResponseDto = {
  id: string;
};

export type EditMedicationRequestDto = {
  dosage_form?: DosageForm;
  name?: string;
  note?: string;
};

export type EditMedicationResponseDto = {
  medication_id: string;
};

/**
 * GET /medications
 */
export type GetAllMedicationsRequest = TApiPagination<MedicationsSortBy> & {
  patientIds?: string[];
  dosageForm?: DosageForm | null;
  search?: string;
};

export type GetAllMedicationsResponse = ApiPaginationData<MedicationOverview>;

/**
 * GET /patients/{patientId}/medications
 * 可保留給 patient-scoped list 使用
 */
export type GetPatientMedicationsRequest = TApiPagination<MedicationsSortBy> & {
  patientId: string;
  dosageForm?: DosageForm | null;
  search?: string;
};

export type GetPatientMedicationsResponse =
  ApiPaginationData<MedicationOverview>;
