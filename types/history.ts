import { HistoryDetail } from "@/store/history";

export type EditableHistoryValues = {
  status: HistoryDetail["status"];
  intakenTime: string;
  takenAmount: string;
  memo: string;
  feeling: string;
  reason: string;
  customSymptomTagsText: string;
  symptomTags: string[];
};
