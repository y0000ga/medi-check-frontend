import { PermissionLevel, Role } from "@/store/care-invitation/type";
import { RelationShipStatus } from "@/types/care";

export const PERMISSION_LABEL: Record<PermissionLevel, string> = {
  [PermissionLevel.Read]: "View",
  [PermissionLevel.Write]: "Edit",
  [PermissionLevel.Admin]: "Admin",
};

export const PERMISSION_OPTIONS = Object.values(PermissionLevel).map(
  (value) => ({ value, label: PERMISSION_LABEL[value] }),
);

export const STATUS_LABEL: Record<RelationShipStatus, string> = {
  [RelationShipStatus.active]: "Active",
  [RelationShipStatus.invited]: "Invited",
  [RelationShipStatus.revoked]: "Revoked",
};

export const ROLE_LABEL: Record<Role, string> = {
  [Role.CareGiver]: "Caregiver",
  [Role.Patient]: "Patient",
};
