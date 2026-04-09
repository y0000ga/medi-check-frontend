import { TPaginationParams } from "./base";
import { PermissionLevel } from "./care-invitation";

export interface ICreatePatientBody {
  name: string;
  avatar_url: string | null;
  birth_date: string | null;
}

export interface IPatient {
  id: string;
  linked_user_id: string | null;
  birth_date: string | null;
  name: string;
  avatar_url: string | null;
  permission_level: PermissionLevel;
}

export interface IDetailPatient extends IPatient {}

export interface IPatientOption {
  id: string;
  name: string;
  avatar_url: string | null;
  permission_level: PermissionLevel;
}

export interface ICreatePatientResponse {
  id: string;
}

export type TGetPatientsParams = TPaginationParams & {
  name?: string | null;
};

export type TGetPatientOptionsParams = {
  name?: string | null;
};
