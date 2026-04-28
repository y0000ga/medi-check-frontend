import { PermissionLevel } from "../store/care-invitation/type";
export { PermissionLevel } from "../store/care-invitation/type";

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
