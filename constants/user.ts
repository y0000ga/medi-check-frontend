import { UserStatus } from "@/types/common";

export const USER_STATUS_LABEL = {
  [UserStatus.active]: "啟用中",
  [UserStatus.invited]: "待啟用",
  [UserStatus.disabled]: "已停用",
};

export const SETTING_MENU_ITEMS = [
  {
    key: "viewer",
    title: "檢視身分",
    description: "切換我的服藥或照顧者視角，並選擇目前要查看的病人。",
  },
  {
    key: "profile",
    title: "個人檔案",
    description: "修改顯示名稱與頭像網址，查看目前帳號資訊。",
  },
  {
    key: "security",
    title: "安全與登入",
    description:
      "查看 Email 驗證狀態、最近登入時間，並可前往修改密碼。",
  },
  {
    key: "care-network",
    title: "照顧關係",
    description:
      "查看我可管理的病人、現有照顧者，以及待處理的照顧邀請。",
  },
] as const;
