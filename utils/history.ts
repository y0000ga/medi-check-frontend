import { COMMON_SYMPTOM_TAGS } from "@/constants/history";
import { EditableHistoryValues } from "@/types/history";
import { IRES_History } from "@/types/api";
import { HistorySource, HistoryStatus } from "@/types/domain";
import dayjs from "dayjs";

export const formatDateTime = (value: string | null | undefined) =>
  value ? dayjs(value).format("YYYY/MM/DD HH:mm") : "尚未記錄";

export const getRecommendedSource = (status: IRES_History["status"]): HistorySource => {
  switch (status) {
    case HistoryStatus.missed:
      return HistorySource.system;
    case HistoryStatus.taken:
      return HistorySource.quickCheck;
    case HistoryStatus.pending:
    default:
      return HistorySource.manual;
  }
};

export const splitCustomTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export const toFormValues = (history: IRES_History): EditableHistoryValues => {
  const commonTags = history.symptomTags.filter((tag) => COMMON_SYMPTOM_TAGS.includes(tag));
  const customTags = history.symptomTags.filter((tag) => !COMMON_SYMPTOM_TAGS.includes(tag));

  return {
    status: history.status,
    intakenTime: history.intakenTime ?? "",
    rate: history.rate != null ? String(history.rate) : "",
    takenAmount: history.takenAmount != null ? String(history.takenAmount) : "",
    memo: history.memo ?? "",
    feeling: history.feeling ?? "",
    reason: history.reason ?? "",
    source: history.source,
    customSymptomTagsText: customTags.join(", "),
    symptomTags: commonTags,
  };
};
