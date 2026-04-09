import { PermissionLevel, RelationShipStatus } from "@/types/care";

export const PERMISSION_LABEL: Record<PermissionLevel, string> = {
  [PermissionLevel.read]: "可查看",
  [PermissionLevel.write]: "可編輯",
  [PermissionLevel.admin]: "可管理",
};

export const PERMISSION_OPTIONS = Object.values(PermissionLevel).map(
  (value) => ({ value, label: PERMISSION_LABEL[value] }),
);

export const STATUS_LABEL: Record<RelationShipStatus, string> = {
  [RelationShipStatus.active]: "啟用中",
  [RelationShipStatus.invited]: "邀請中",
  [RelationShipStatus.revoked]: "已移除",
};
