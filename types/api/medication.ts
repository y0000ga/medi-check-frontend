import { DosageForm } from "@/types/common";

import { IPaginationResponse, TPaginationParams } from "./base";
import { PermissionLevel } from "./care-invitation";

export interface IMedication {
  id: string;
  dosage_form: DosageForm;
  patient_id: string;
  patient_name: string;
  name: string;
}

export interface IMedicationDetail extends IMedication {
  note: string | null;
  permission_level: PermissionLevel;
}

export interface ICreateMedicationBody {
  dosage_form: DosageForm;
  name: string;
  note?: string | null;
}

export interface IEditMedicationBody {
  dosage_form?: DosageForm | null;
  name?: string | null;
  note?: string | null;
}

export interface ICreateMedicationResponse {
  id: string;
}

export interface IEditMedicationResponse {
  medication_id: string;
}

export type TGetMedicationsParams = TPaginationParams & {
  dosage_form?: DosageForm | null;
  search?: string | null;
};

export type TGetAllMedicationsParams = TPaginationParams & {
  patient_ids?: string[] | null;
  dosage_form?: DosageForm | null;
  search?: string | null;
};

export type MedicationListResult = IPaginationResponse<IMedication>;

