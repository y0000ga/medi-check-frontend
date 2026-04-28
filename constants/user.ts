import { UserStatus } from "@/types/common";

export const USER_STATUS_LABEL = {
  [UserStatus.active]: "Active",
  [UserStatus.invited]: "Invited",
  [UserStatus.disabled]: "Disabled",
};

export const SETTING_MENU_ITEMS = [
  {
    key: "profile",
    title: "Profile",
    description: "Update name, avatar, and basic details.",
  },
  {
    key: "security",
    title: "Security",
    description: "Manage email verification and password settings.",
  },
  {
    key: "patient-care",
    title: "Patients & Care",
    description: "Add patients without accounts and review care relationships.",
  },
  {
    key: "invitation-management",
    title: "Invitations",
    description: "Invite patients or caregivers and track invitation status.",
  },
] as const;
