import { ApiPaginationData, TApiPagination } from "@/shared/api/types";
import { PermissionLevel } from "@/features/patient/types";

export enum CareInvitationSortBy {
  createdAt = "created_at",
}

export enum CareInvitationDirection {
  sent = "sent",
  received = "received",
}

export enum CareInvitationStatus {
  pending = "pending",
  accepted = "accepted",
  declined = "declined",
  revoked = "revoked",
}

export enum CareInvitationType {
  invitePatient = "invite_patient",
  inviteCaregiver = "invite_caregiver",
}

/**
 * Domain Model
 */

export type CareInvitation = {
  id: string;

  inviterUserId: string;
  inviterName: string;

  patientId: string;

  inviteeEmail: string;
  inviteeUserId: string | null;
  inviteeName: string | null;

  invitationType: CareInvitationType;
  permissionLevel: PermissionLevel;
  status: CareInvitationStatus;

  sentAt: string;
  acceptedAt: string | null;
  declinedAt: string | null;
  revokedAt: string | null;
  expiredAt: string | null;
};

/**
 * Requests / Responses
 */

export type GetCareInvitationsRequest = TApiPagination<CareInvitationSortBy> & {
  direction?: CareInvitationDirection | null;
  status?: CareInvitationStatus | null;
};

export type GetCareInvitationsResponse = ApiPaginationData<CareInvitation>;

export type CreateCareInvitationRequest = {
  inviteeEmail: string;
  permissionLevel: PermissionLevel;
};

export type CreateCareInvitationResponse = {
  id: string;
};

export type CareInvitationActionRequest = {
  invitationId: string;
};

export type CareInvitationActionResponse = {
  id: string;
};

/**
 * DTOs
 */

export type CareInvitationDto = {
  id: string;

  inviter_user_id: string;
  inviter_name: string;

  patient_id: string;

  invitee_email: string;
  invitee_user_id: string | null;
  invitee_name: string | null;

  invitation_type: CareInvitationType;
  permission_level: PermissionLevel;
  status: CareInvitationStatus;

  sent_at: string;
  accepted_at: string | null;
  declined_at: string | null;
  revoked_at: string | null;
  expired_at: string | null;
};

export type GetCareInvitationsDto = {
  page: number;
  total_size: number;
  list: CareInvitationDto[];
};

export type CreateCareInvitationRequestDto = {
  invitee_email: string;
  permission_level: PermissionLevel;
};

export type CreateCareInvitationResponseDto = {
  id: string;
};

export type CareInvitationActionResponseDto = {
  id: string;
};
