import { PermissionLevel } from "../patient/types";
import { CareRelationship, CareRelationshipDirection } from "./types";

export const getPermissionLabel = (permissionLevel?: PermissionLevel) => {
  switch (permissionLevel) {
    case PermissionLevel.admin:
      return "管理者";
    case PermissionLevel.write:
      return "可編輯";
    case PermissionLevel.read:
      return "僅檢視";
    default:
      return "未知權限";
  }
};

export const permissionOptions = [
  {
    label: "僅檢視",
    value: PermissionLevel.read,
  },
  {
    label: "可編輯",
    value: PermissionLevel.write,
  },
  {
    label: "管理者",
    value: PermissionLevel.admin,
  },
];

export const directionOptions: Array<{
  label: string;
  value: CareRelationshipDirection;
}> = [
  {
    label: "我照護的人",
    value: CareRelationshipDirection.patient,
  },
  {
    label: "照護我的人",
    value: CareRelationshipDirection.caregiver,
  },
];

export const totalpermissionOptions: Array<{
  label: string;
  value: PermissionLevel | null;
}> = [
  { label: "全部權限", value: null },
  { label: "僅檢視", value: PermissionLevel.read },
  { label: "可編輯", value: PermissionLevel.write },
  { label: "管理者", value: PermissionLevel.admin },
];

export const getDirectionDescription = (
  direction: CareRelationshipDirection,
) => {
  switch (direction) {
    case CareRelationshipDirection.patient:
      return "查看你目前正在照護的對象。";
    case CareRelationshipDirection.caregiver:
      return "查看目前可以照護你的人。";
    default:
      return "";
  }
};

export const getRelationshipTitle = (
  relationship: CareRelationship,
  direction: CareRelationshipDirection,
) => {
  if (direction === CareRelationshipDirection.patient) {
    return relationship.patientName;
  }

  return relationship.caregiverName;
};

export const getRelationshipSubtitle = (
  relationship: CareRelationship,
  direction: CareRelationshipDirection,
) => {
  if (direction === CareRelationshipDirection.patient) {
    return `你正在照護 ${relationship.patientName}`;
  }

  return `${relationship.caregiverName} 正在照護你`;
};

export const getRelationshipIcon = (direction: CareRelationshipDirection) => {
  if (direction === CareRelationshipDirection.patient) {
    return "person-outline";
  }

  return "people-outline";
};
