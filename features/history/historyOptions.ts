import { HistorySource } from "./types";

export const getSourceLabel = (source: HistorySource) => {
  switch (source) {
    case HistorySource.quickCheck:
      return "快速確認";
    case HistorySource.manual:
      return "手動紀錄";
    case HistorySource.system:
      return "系統產生";
    default:
      return "未知來源";
  }
};

export const getFeelingLabel = (feeling: number | null) => {
  if (feeling === null || feeling === undefined) {
    return "未填寫";
  }

  switch (feeling) {
    case 1:
      return "很差";
    case 2:
      return "偏差";
    case 3:
      return "普通";
    case 4:
      return "良好";
    case 5:
      return "很好";
    default:
      return String(feeling);
  }
};

export const feelingOptions: {
  label: string;
  value: string | null;
}[] = [
  { label: "未填寫", value: null },
  { label: "很差", value: "1" },
  { label: "偏差", value: "2" },
  { label: "普通", value: "3" },
  { label: "良好", value: "4" },
  { label: "很好", value: "5" },
];
