import {
  IPaginationResponse,
  TPaginationParams,
} from "@/store/api/type";
import { PermissionLevel } from "@/store/care-invitation/type";
import { DosageForm } from "@/types/common";

export interface Medication {
  id: string;
  patientId: string;
  patientName: string;
  name: string;
  dosageForm: DosageForm;
}

export interface MedicationDetail extends Medication {
  note: string | null;
  permissionLevel: PermissionLevel;
}

export interface MedicationFormValues {
  id: string;
  patientId: string;
  patientName: string;
  name: string;
  dosageForm: DosageForm;
  note: string;
}

export interface MedicationListQueryState {
  search: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: "desc" | "asc";
  dosageForm: DosageForm | null;
}

export interface SaveMedicationPayload {
  patientId: string;
  name: string;
  dosageForm: DosageForm;
  note: string | null;
}

export interface MedicationListItemApi {
  id: string;
  dosage_form: DosageForm;
  patient_id: string;
  patient_name: string;
  name: string;
}

export interface MedicationDetailApi extends MedicationListItemApi {
  note: string | null;
  permission_level: PermissionLevel;
}

export interface CreateMedicationBodyApi {
  dosage_form: DosageForm;
  name: string;
  note?: string | null;
}

export interface UpdateMedicationBodyApi {
  dosage_form?: DosageForm | null;
  name?: string | null;
  note?: string | null;
}

export interface CreateMedicationResponseApi {
  id: string;
}

export interface UpdateMedicationResponseApi {
  medication_id: string;
}

export type GetMedicationsParamsApi = TPaginationParams & {
  dosage_form?: DosageForm | null;
  search?: string | null;
};

export type GetAllMedicationsParamsApi = TPaginationParams & {
  patient_ids?: string[] | null;
  dosage_form?: DosageForm | null;
  search?: string | null;
};

export type MedicationListResponseApi =
  IPaginationResponse<MedicationListItemApi>;
