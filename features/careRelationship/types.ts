import { ApiPaginationData, TApiPagination } from "@/shared/api/types";
import { PermissionLevel } from "@/features/patient/types";

export enum CareRelationshipSortBy {
  createdAt = "created_at",
}

export enum CareRelationshipDirection {
  patient = "patient",
  caregiver = "caregiver",
}

/**
 * Domain Model
 */

export type CareRelationship = {
  id: string;

  caregiverUserId: string;
  caregiverName: string;

  createdByUserId: string;

  patientId: string;
  patientName: string;

  permissionLevel: PermissionLevel;
};

/**
 * Requests / Responses
 */

export type GetCareRelationshipsRequest =
  TApiPagination<CareRelationshipSortBy> & {
    permissionLevel?: PermissionLevel | null;
    direction?: CareRelationshipDirection | null;
  };

export type GetCareRelationshipsResponse = ApiPaginationData<CareRelationship>;

/**
 * DTOs
 */

export type CareRelationshipDto = {
  id: string;

  caregiver_user_id: string;
  caregiver_name: string;

  created_by_user_id: string;

  patient_id: string;
  patient_name: string;

  permission_level: PermissionLevel;
};

export type GetCareRelationshipsDto = {
  page: number;
  total_size: number;
  list: CareRelationshipDto[];
};
