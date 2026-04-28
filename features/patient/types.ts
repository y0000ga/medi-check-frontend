import { ApiPaginationData, TApiPagination } from "@/shared/api/types";

export type CreatePatientResponse = {
  id: string;
};

export type CreatePatientRequest = {
  name: string;
  avatarUrl?: string;
  birthDate: string;
  note: string;
};

export enum PermissionLevel {
  read = "read",
  write = "write",
  admin = "admin",
}

export interface IPatientDetail {
  id: string;
  name: string;
  permissionLevel: PermissionLevel;
  birthDate: string;
  avatarUrl: string;
  note: string;
  linkedUserName: string;
}

type IPatient = Pick<
  IPatientDetail,
  "id" | "name" | "permissionLevel" | "linkedUserName"
>;

export enum PatientsSortBy {
  createdAt = "created_at",
  name = "name",
  birthDate = "birth_date",
}

export type TGetPatientsRequest = TApiPagination<PatientsSortBy> & {
  search?: string;
};

export type TGetPatientsResponse = ApiPaginationData<IPatient>;

export type TGetPatientDetailsResponse = IPatientDetail;
export type IPatientDetailDto = {
  id: string;
  name: string;
  permission_level: PermissionLevel;
  birth_date: string;
  avatar_url: string;
  note: string;
  linked_user_name: string;
};

export type IPatientDto = Pick<
  IPatientDetailDto,
  "id" | "permission_level" | "name" | "linked_user_name"
>;

export type GetPatientsDto = {
  page: number;
  total_size: number;
  list: IPatientDto[];
};

export type EditPatientResponse = {
  id: string;
};

export type EditPatientRequest = {
  id: string;
  name?: string;
  birthDate?: string;
  note?: string;
};
