import { EditableHistoryValues } from "@/types/history";
import { HistoryStatus } from "@/types/domain";
import { HistorySource } from "@/types/records";

export const HISTORY_STATUS_LABEL = {
  [HistoryStatus.taken]: "Taken",
  [HistoryStatus.missed]: "Missed",
  [HistoryStatus.pending]: "Pending",
} as const;

export const HISTORY_SOURCE_LABEL = {
  [HistorySource.manual]: "Manual update",
  [HistorySource.quickCheck]: "Quick check",
  [HistorySource.sytstem]: "System",
}

export const STATUS_OPTIONS = Object.values(HistoryStatus).map(
  (value) => ({
    value,
    label: HISTORY_STATUS_LABEL[value],
  }),
);

export const COMMON_SYMPTOM_TAGS = [
  "Headache",
  "Fever",
  "Cough",
  "Stomach discomfort",
  "Sleepy",
  "Loss of appetite",
  "Dizzy",
  "Sore throat",
  "Fatigue",
  "Diarrhea",
];

export const EMPTY_HISTORY_FORM: EditableHistoryValues = {
  status: HistoryStatus.pending,
  intakenTime: "",
  takenAmount: "",
  memo: "",
  feeling: "",
  reason: "",
  customSymptomTagsText: "",
  symptomTags: [],
};
