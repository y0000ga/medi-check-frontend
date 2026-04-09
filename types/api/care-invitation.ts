import { TPaginationParams } from "./base";

export enum Role {
  Patient = "patient",
  CareGiver = "caregiver",
}

export enum PermissionLevel {
  Read = "read",
  Write = "write",
  Admin = "admin",
}

export interface ICreateInvitationBody {
  invitee_email: string;
  permission_level: PermissionLevel;
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
  send = "send",
  received = "received",
}

export interface IInvitation {
  id: string;
  inviter_user_id: string;
  inviter_name: string;
  patient_id: string;
  invitee_email: string;
  invitee_user_id: string;
  invitation_type: InvitationType;
  permission_level: PermissionLevel;
  status: InvationStatus;
  sent_at: string;
  accepted_at: string | null;
  declined_at: string | null;
  revoked_at: string | null;
  expired_at: string;
}

export type TGetInvitationListParams = TPaginationParams & {
  status: InvationStatus;
  direction: InvitationDirection;
};
