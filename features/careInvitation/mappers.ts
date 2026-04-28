import { SortOrder } from "@/shared/api/types";
import {
  CareInvitation,
  CareInvitationActionResponse,
  CareInvitationActionResponseDto,
  CareInvitationDto,
  CreateCareInvitationRequest,
  CreateCareInvitationRequestDto,
  CreateCareInvitationResponse,
  CreateCareInvitationResponseDto,
  GetCareInvitationsDto,
  GetCareInvitationsRequest,
  GetCareInvitationsResponse,
} from "./types";

export const mapCareInvitationDto = (
  dto: CareInvitationDto,
): CareInvitation => {
  return {
    id: dto.id,

    inviterUserId: dto.inviter_user_id,
    inviterName: dto.inviter_name,

    patientId: dto.patient_id,

    inviteeEmail: dto.invitee_email,
    inviteeUserId: dto.invitee_user_id,
    inviteeName: dto.invitee_name,

    invitationType: dto.invitation_type,
    permissionLevel: dto.permission_level,
    status: dto.status,

    sentAt: dto.sent_at,
    acceptedAt: dto.accepted_at,
    declinedAt: dto.declined_at,
    revokedAt: dto.revoked_at,
    expiredAt: dto.expired_at,
  };
};

export const mapGetCareInvitationsRequestDto = (
  request: GetCareInvitationsRequest,
) => {
  return {
    page: request.page,
    page_size: request.pageSize,
    sort_by: request.sortBy,
    sort_order: request.sortOrder ?? SortOrder.desc,

    ...(request.direction ? { direction: request.direction } : {}),
    ...(request.status ? { status: request.status } : {}),
  };
};

export const mapGetCareInvitationsResponseDto = (
  dto: GetCareInvitationsDto,
): GetCareInvitationsResponse => {
  return {
    page: dto.page,
    totalSize: dto.total_size,
    list: dto.list.map(mapCareInvitationDto),
  };
};

export const mapCreateCareInvitationRequestDto = (
  request: CreateCareInvitationRequest,
): CreateCareInvitationRequestDto => {
  return {
    invitee_email: request.inviteeEmail,
    permission_level: request.permissionLevel,
  };
};

export const mapCreateCareInvitationResponseDto = (
  dto: CreateCareInvitationResponseDto,
): CreateCareInvitationResponse => {
  return {
    id: dto.id,
  };
};

export const mapCareInvitationActionResponseDto = (
  dto: CareInvitationActionResponseDto,
): CareInvitationActionResponse => {
  return {
    id: dto.id,
  };
};
