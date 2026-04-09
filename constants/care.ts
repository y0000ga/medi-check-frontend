import { PermissionLevel, Role } from "@/types/api/care-invitation";
import { RelationShipStatus } from "@/types/care";

export const PERMISSION_LABEL: Record<PermissionLevel, string> = {
  [PermissionLevel.Read]: "可查看",
  [PermissionLevel.Write]: "可編輯",
  [PermissionLevel.Admin]: "可管理",
};

export const PERMISSION_OPTIONS = Object.values(PermissionLevel).map(
  (value) => ({ value, label: PERMISSION_LABEL[value] }),
);

export const STATUS_LABEL: Record<RelationShipStatus, string> = {
  [RelationShipStatus.active]: "啟用中",
  [RelationShipStatus.invited]: "邀請中",
  [RelationShipStatus.revoked]: "已移除",
};

export const ROLE_LABEL: Record<Role, string> = {
  [Role.CareGiver]: "照顧者",
  [Role.Patient]: "病人",
};
