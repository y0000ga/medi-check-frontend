import {
  COMMON_SYMPTOM_TAGS,
  HISTORY_SOURCE_LABEL,
  HISTORY_STATUS_LABEL,
} from "@/constants/history";
import { HistoryDetail } from "@/store/history";
import { EditableHistoryValues } from "@/types/history";
import { Dispatch, SetStateAction } from "react";
import InfoRow from "./InfoRow";
import { formatDateTime } from "@/utils/history";
import { evaluateLabel } from "@/utils/common";
import { ThemedText } from "../themed-text";
import { detailStyles } from "./styles/detail.style";
import FieldInput from "../ui/field-input";
import { ThemedView } from "../themed-view";
import SymptomTag from "./Tag";

const EditableForm = ({
  form,
  setForm,
}: {
  form: EditableHistoryValues;
  setForm: Dispatch<SetStateAction<EditableHistoryValues>>;
}) => {
  const toggleSymptomTag = (tag: string) => {
    setForm((current) => ({
      ...current,
      symptomTags: current.symptomTags.includes(tag)
        ? current.symptomTags.filter((item) => item !== tag)
        : [...current.symptomTags, tag],
    }));
  };

  return (
    <>
      <FieldInput
        label="狀態"
        value={HISTORY_STATUS_LABEL[form.status]}
        disabled
        onChangeText={() => {}}
      />
      <FieldInput
        label="實際服藥時間"
        value={form.intakenTime}
        onChangeText={(intakenTime) =>
          setForm((current) => ({
            ...current,
            intakenTime,
          }))
        }
        placeholder="例如 2026-04-03T08:15:00.000Z"
      />
      <FieldInput
        label="實際服藥劑量"
        value={form.takenAmount}
        onChangeText={(takenAmount) =>
          setForm((current) => ({
            ...current,
            takenAmount,
          }))
        }
        placeholder="例如 0.5"
      />
      <FieldInput
        label="評分"
        value={form.feeling}
        onChangeText={(feeling) =>
          setForm((current) => ({
            ...current,
            feeling,
          }))
        }
        placeholder="例如 5"
      />
      <FieldInput
        label="原因"
        value={form.reason}
        onChangeText={(reason) =>
          setForm((current) => ({ ...current, reason }))
        }
        placeholder="例如 吃藥後有不舒服或忘記服藥的原因"
        multiline
        numberOfLines={3}
      />

      <ThemedView style={detailStyles.fieldGroup}>
        <ThemedText style={detailStyles.fieldLabel}>
          症狀標籤
        </ThemedText>
        <ThemedText style={detailStyles.helperText}>
          可先點選常用標籤，再用下方欄位補充其他自訂標籤。
        </ThemedText>
        <ThemedView style={detailStyles.tagWrap}>
          {COMMON_SYMPTOM_TAGS.map((tag) => (
            <SymptomTag
              tag={tag}
              key={tag}
              onPress={() => toggleSymptomTag(tag)}
              selected={form.symptomTags.includes(tag)}
            />
          ))}
        </ThemedView>
      </ThemedView>

      <FieldInput
        label="其他症狀標籤"
        value={form.customSymptomTagsText}
        onChangeText={(customSymptomTagsText) =>
          setForm((current) => ({
            ...current,
            customSymptomTagsText,
          }))
        }
        placeholder="以逗號分隔，例如 頭暈, 想睡"
        multiline
        numberOfLines={3}
      />
      <FieldInput
        label="備註"
        value={form.memo}
        onChangeText={(memo) =>
          setForm((current) => ({ ...current, memo }))
        }
        placeholder="補充這次記錄的細節"
        multiline
        numberOfLines={3}
      />
    </>
  );
};

export default EditableForm;

export const ReadableForm = ({
  history,
}: {
  history: HistoryDetail;
}) => {
  const { label: takenAmountLabel } = evaluateLabel({
    amount: Number(history.takenAmount) || 0,
    doseUnit: history.doseUnit,
    medicationDosageForm: history.medicationDosageForm,
  });

  const displaySymptomTags =
    [...(history.symptomTags || [])].filter(Boolean).join("、") || "";

  return (
    <>
      <InfoRow
        label="狀態"
        value={HISTORY_STATUS_LABEL[history.status]}
      />
      <InfoRow
        label="來源"
        value={HISTORY_SOURCE_LABEL[history.source]}
      />
      <InfoRow
        label="實際服藥時間"
        value={formatDateTime(history.intakenTime)}
      />
      <InfoRow
        label="實際服藥劑量"
        value={takenAmountLabel}
      />
      <InfoRow
        label="評分"
        value={history.feeling?.toString() ?? ""}
      />
      <InfoRow
        label="原因"
        value={history.reason || ""}
      />
      <InfoRow
        label="症狀標籤"
        value={displaySymptomTags}
      />
      <InfoRow
        label="備註"
        value={history.memo || ""}
      />
    </>
  );
};
