
import { EditableHistoryValues } from "@/types/history";
import { HistorySource, HistoryStatus } from "@/types/domain";

const HISTORY_STATUS_LABEL = {
    [HistoryStatus.taken]: "已服用",
    [HistoryStatus.missed]: "已錯過",
    [HistoryStatus.pending]: "待處理",
} as const;

export const STATUS_OPTIONS = Object.values(HistoryStatus).map((value) => ({
    value,
    label: HISTORY_STATUS_LABEL[value],
}));

const HISTORY_SOURCE_LABEL: Record<HistorySource, string> = {
    [HistorySource.quickCheck]: "快速打卡",
    [HistorySource.manual]: "手動補記",
    [HistorySource.system]: "系統判定",
};

export const SOURCE_OPTIONS = (Object.keys(HISTORY_SOURCE_LABEL) as HistorySource[]).map((value) => ({
    value,
    label: HISTORY_SOURCE_LABEL[value],
}));

export const COMMON_SYMPTOM_TAGS = [
    "頭痛",
    "發燒",
    "咳嗽",
    "胃不舒服",
    "想睡",
    "食慾不振",
    "頭暈",
    "喉嚨痛",
    "疲倦",
    "腹瀉",
];

export const EMPTY_HISTORY_FORM: EditableHistoryValues = {
  status: HistoryStatus.pending,
  intakenTime: "",
  rate: "",
  takenAmount: "",
  memo: "",
  feeling: "",
  reason: "",
  source: HistorySource.quickCheck,
  customSymptomTagsText: "",
  symptomTags: [],
};