import { SortOrder } from "@/shared/api/types";
import {
  CareRelationship,
  CareRelationshipDto,
  GetCareRelationshipsDto,
  GetCareRelationshipsRequest,
  GetCareRelationshipsResponse,
} from "./types";

export const mapCareRelationshipDto = (
  dto: CareRelationshipDto,
): CareRelationship => {
  return {
    id: dto.id,

    caregiverUserId: dto.caregiver_user_id,
    caregiverName: dto.caregiver_name,

    createdByUserId: dto.created_by_user_id,

    patientId: dto.patient_id,
    patientName: dto.patient_name,

    permissionLevel: dto.permission_level,
  };
};

export const mapGetCareRelationshipsRequestDto = (
  request: GetCareRelationshipsRequest,
) => {
  return {
    page: request.page,
    page_size: request.pageSize,
    sort_by: request.sortBy,
    sort_order: request.sortOrder ?? SortOrder.desc,

    ...(request.permissionLevel
      ? { permission_level: request.permissionLevel }
      : {}),

    ...(request.direction ? { direction: request.direction } : {}),
  };
};

export const mapGetCareRelationshipsResponseDto = (
  dto: GetCareRelationshipsDto,
): GetCareRelationshipsResponse => {
  return {
    page: dto.page,
    totalSize: dto.total_size,
    list: dto.list.map(mapCareRelationshipDto),
  };
};
