import { COMMON_SYMPTOM_TAGS } from "@/constants/history";
import { HistoryDetail } from "@/store/history";
import { EditableHistoryValues } from "@/types/history";
import dayjs from "dayjs";

export const formatDateTime = (value: string | null | undefined) =>
  value ? dayjs(value).format("YYYY/MM/DD HH:mm") : "尚未記錄";

export const splitCustomTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export const toFormValues = (
  history: HistoryDetail,
): EditableHistoryValues => {
  const commonTags = history.symptomTags?.filter((tag) =>
    COMMON_SYMPTOM_TAGS.includes(tag),
  );
  const customTags = history.symptomTags?.filter(
    (tag) => !COMMON_SYMPTOM_TAGS.includes(tag),
  );

  return {
    status: history.status,
    intakenTime: history.intakenTime ?? "",
    takenAmount:
      history.takenAmount != null ? String(history.takenAmount) : "",
    memo: history.memo ?? "",
    feeling: history.feeling != null ? String(history.feeling) : "",
    reason: history.reason ?? "",
    customSymptomTagsText: customTags?.join(", ") || "",
    symptomTags: commonTags || [],
  };
};
