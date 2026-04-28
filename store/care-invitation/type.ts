import { TPaginationParams } from "../api/type";

// 代表由後端定義的事項，非因前端顯示而定義

export enum Role {
  Patient = "patient",
  CareGiver = "caregiver",
}

export enum PermissionLevel {
  Read = "read",
  Write = "write",
  Admin = "admin",
}

export enum InvitationType {
  InvitePatient = "invite_patient",
  InviteCaregive = "invite_caregiver",
}

export enum InvationStatus {
  pending = "pending",
  accpeted = "accepted",
  declined = "declined",
  revoked = "revoked",
}

export enum InvitationDirection {
  sent = "sent",
  received = "received",
}

export interface ICreateInvitationBody {
  invitee_email: string;
  permission_level: PermissionLevel;
}

export interface ICreateInvitationResponse {
  id: string;
}

export interface IInvitation {
  id: string;
  inviter_user_id: string;
  inviter_name: string;
  patient_id: string | null;
  invitee_email: string;
  invitee_user_id: string | null;
  invitee_name: string;
  invitation_type: InvitationType;
  permission_level: PermissionLevel;
  status: InvationStatus;
  sent_at: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  revoked_at: string | null;
  expired_at: string | null;
}

export type TGetInvitationListParams = TPaginationParams & {
  status?: InvationStatus | null;
  direction?: InvitationDirection | null;
};

export interface IInvitationActionResponse {
  id: string;
}
