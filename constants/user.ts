import { UserStatus } from "@/types/common";

export const USER_STATUS_LABEL = {
  [UserStatus.active]: "啟用中",
  [UserStatus.invited]: "待加入",
  [UserStatus.disabled]: "已停用",
};

export const SETTING_MENU_ITEMS = [
  {
    key: "viewer",
    title: "觀看模式",
    description: "切換目前查看的對象與照護視角。",
  },
  {
    key: "profile",
    title: "個人資料",
    description: "更新名稱、頭像與其他基本資訊。",
  },
  {
    key: "security",
    title: "帳號安全",
    description: "管理 Email 驗證與密碼等帳號設定。",
  },
  {
    key: "patient-care",
    title: "病人與照護",
    description: "新增無帳號病人，並查看目前的照護關係。",
  },
  {
    key: "invitation-management",
    title: "邀請管理",
    description: "邀請病人或照顧者，並查看目前邀請狀態。",
  },
] as const;
