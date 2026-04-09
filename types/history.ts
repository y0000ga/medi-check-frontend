import { IRES_History } from "./api";
import { HistorySource } from "./domain";

export type EditableHistoryValues = {
  status: IRES_History["status"];
  intakenTime: string;
  rate: string;
  takenAmount: string;
  memo: string;
  feeling: string;
  reason: string;
  source: HistorySource;
  customSymptomTagsText: string;
  symptomTags: string[];
};
