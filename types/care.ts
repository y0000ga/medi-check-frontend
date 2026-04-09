import { PermissionLevel } from "./api/care-invitation";
export { PermissionLevel } from "./api/care-invitation";

export enum RelationShipStatus {
  active = "active",
  invited = "invited",
  revoked = "revoked",
}

export interface IInvite {
  relationshipId: string;
  patientId: string;
  patientName: string;
  inviteeEmail: string | null;
  permissionLevel: PermissionLevel;
  createdAt: string;
  invitedByUserId?: string | null;
}
