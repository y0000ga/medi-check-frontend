import { Pressable, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { Redirect, useLocalSearchParams } from "expo-router";

import Container from "@/components/ui/container";
import { routes } from "@/constants/route";
import FieldInput from "@/components/ui/field-input";
import FieldPicker from "@/components/ui/field-picker";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import ModalHeader from "@/components/ui/modal-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  fetchHistoryDetail,
  updateHistory,
} from "@/libs/api/history";
import {
  HistorySource,
  HistoryStatus,
  IRES_History,
} from "@/types/mock";
import { evaluateDosageFormIcon } from "@/utils/common";
import { DOSE_UNIT_LABELS } from "@/constants/medication";
import {
  COMMON_SYMPTOM_TAGS,
  EMPTY_HISTORY_FORM,
  SOURCE_OPTIONS,
  STATUS_OPTIONS,
} from "@/constants/history";
import { EditableHistoryValues } from "@/types/history";
import {
  formatDateTime,
  getRecommendedSource,
  splitCustomTags,
  toFormValues,
} from "@/utils/history";
import SectionCard from "@/components/history/SectionCard";
import InfoRow from "@/components/history/InfoRow";
import SymptomTag from "@/components/history/Tag";

const HistoryDetailModal = () => {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = typeof params.id === "string" ? params.id : "";

  const [history, setHistory] = useState<IRES_History | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditableHistoryValues>(
    EMPTY_HISTORY_FORM,
  );

  useEffect(() => {
    if (!id) {
      return;
    }

    let active = true;

    const loadDetail = async () => {
      setLoading(true);
      try {
        const detail = await fetchHistoryDetail(id);
        if (!active) {
          return;
        }

        setHistory(detail ?? null);
        if (detail) {
          setForm(toFormValues(detail));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      active = false;
    };
  }, [id]);

  if (!id) {
    return <Redirect href={routes.protected.history} />;
  }

  const icon = evaluateDosageFormIcon({
    dosageForm: history?.medicationDosageForm ?? null,
  });
  const amountLabel = history
    ? `${history.amount} ${history.doseUnit ? DOSE_UNIT_LABELS[history.doseUnit] : ""}`.trim()
    : "";

  const displaySymptomTags = history
    ? [...history.symptomTags].filter(Boolean)
    : [];

  const toggleSymptomTag = (tag: string) => {
    setForm((current) => ({
      ...current,
      symptomTags: current.symptomTags.includes(tag)
        ? current.symptomTags.filter((item) => item !== tag)
        : [...current.symptomTags, tag],
    }));
  };

  const handleStatusChange = (status: IRES_History["status"]) => {
    setForm((current) => ({
      ...current,
      status,
      source: getRecommendedSource(status),
    }));
  };

  const handleSave = async () => {
    if (!history) {
      return;
    }

    const symptomTags = [
      ...form.symptomTags,
      ...splitCustomTags(form.customSymptomTagsText),
    ]
      .filter(Boolean)
      .filter((tag, index, list) => list.indexOf(tag) === index);

    setSaving(true);
    try {
      const updated = await updateHistory(history.id, {
        status: form.status,
        intakenTime: form.intakenTime || null,
        rate: form.rate === "" ? null : Number(form.rate),
        takenAmount:
          form.takenAmount === "" ? null : Number(form.takenAmount),
        memo: form.memo.trim() || null,
        feeling: form.feeling.trim() || null,
        reason: form.reason.trim() || null,
        source: form.source,
        symptomTags,
      });

      setHistory(updated);
      setForm(toFormValues(updated));
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!history) {
      return;
    }

    setForm(toFormValues(history));
    setIsEditing(false);
  };

  return (
    <>
      <FullScreenLoading visible={loading || saving} />
      <ThemedView style={styles.container}>
        <ModalHeader
          title="歷史紀錄"
          leftIcon={
            history ? (
              isEditing ? (
                <Pressable onPress={handleCancel}>
                  <ThemedText style={styles.headerAction}>
                    取消
                  </ThemedText>
                </Pressable>
              ) : (
                <Pressable onPress={() => setIsEditing(true)}>
                  <IconSymbol
                    color="#3C83F6"
                    size={28}
                    name="edit"
                  />
                </Pressable>
              )
            ) : undefined
          }
        />
        <Container>
          {history ? (
            <>
              <View style={styles.heroCard}>
                <View
                  style={[
                    styles.heroIcon,
                    { backgroundColor: icon.backgroundColor },
                  ]}
                >
                  <IconSymbol
                    size={26}
                    name={icon.name}
                    color={icon.color}
                  />
                </View>
                <View style={styles.heroContent}>
                  <ThemedText type="subtitle">
                    {history.medicationName}
                  </ThemedText>
                  <ThemedText style={styles.heroMeta}>
                    {HistoryStatus[history.status]}
                  </ThemedText>
                </View>
              </View>

              <SectionCard title="固定快照">
                <InfoRow
                  label="藥物名稱"
                  value={history.medicationName}
                />
                <InfoRow
                  label="排程劑量"
                  value={amountLabel || "未提供"}
                />
                <InfoRow
                  label="預定時間"
                  value={formatDateTime(history.scheduledTime)}
                />
                <InfoRow
                  label="藥物 ID"
                  value={history.medicationId}
                />
                <InfoRow
                  label="提醒規則 ID"
                  value={history.scheduleId}
                />
                <InfoRow
                  label="藥物名稱"
                  value={history.medicationName}
                />
                <InfoRow
                  label="藥物名稱"
                  value={history.medicationName}
                />
                <InfoRow
                  label="藥物名稱"
                  value={history.medicationName}
                />
                <InfoRow
                  label="藥物名稱"
                  value={history.medicationName}
                />
              </SectionCard>

              <SectionCard title="可編輯紀錄">
                {isEditing ? (
                  <>
                    <FieldPicker<HistoryStatus>
                      label="紀錄狀態"
                      value={form.status}
                      onValueChange={(status) =>
                        handleStatusChange(status)
                      }
                      options={STATUS_OPTIONS}
                    />
                    <FieldPicker<HistorySource>
                      label="紀錄來源"
                      value={form.source}
                      onValueChange={(source) =>
                        setForm((current) => ({ ...current, source }))
                      }
                      options={SOURCE_OPTIONS}
                    />
                    <ThemedText style={styles.helperText}>
                      已依狀態推薦來源，你也可以手動調整。
                    </ThemedText>
                    <FieldInput
                      label="服用時間"
                      value={form.intakenTime}
                      onChangeText={(intakenTime) =>
                        setForm((current) => ({
                          ...current,
                          intakenTime,
                        }))
                      }
                      placeholder="例如：2026-04-03T08:15:00.000Z"
                    />
                    <FieldInput
                      label="實際服用量"
                      value={form.takenAmount}
                      onChangeText={(takenAmount) =>
                        setForm((current) => ({
                          ...current,
                          takenAmount,
                        }))
                      }
                      placeholder="例如：1 或 0.5"
                    />
                    <FieldInput
                      label="評分"
                      value={form.rate}
                      onChangeText={(rate) =>
                        setForm((current) => ({ ...current, rate }))
                      }
                      placeholder="例如：5"
                    />
                    <FieldInput
                      label="原因"
                      value={form.reason}
                      onChangeText={(reason) =>
                        setForm((current) => ({ ...current, reason }))
                      }
                      placeholder="例如：忘記帶藥、症狀變嚴重才補吃"
                      multiline
                      numberOfLines={3}
                    />

                    <View style={styles.fieldGroup}>
                      <ThemedText style={styles.fieldLabel}>
                        症狀標籤
                      </ThemedText>
                      <ThemedText style={styles.helperText}>
                        點選常用標籤，或在下方補充自訂標籤。
                      </ThemedText>
                      <View style={styles.tagWrap}>
                        {COMMON_SYMPTOM_TAGS.map((tag) => (
                          <SymptomTag
                            tag={tag}
                            key={tag}
                            onPress={() => toggleSymptomTag(tag)}
                            selected={form.symptomTags.includes(tag)}
                          />
                        ))}
                      </View>
                    </View>

                    <FieldInput
                      label="自訂症狀標籤"
                      value={form.customSymptomTagsText}
                      onChangeText={(customSymptomTagsText) =>
                        setForm((current) => ({
                          ...current,
                          customSymptomTagsText,
                        }))
                      }
                      placeholder="用逗號分隔，例如：胸悶, 流鼻水"
                      multiline
                      numberOfLines={3}
                    />
                    <FieldInput
                      label="備註"
                      value={form.memo}
                      onChangeText={(memo) =>
                        setForm((current) => ({ ...current, memo }))
                      }
                      placeholder="記錄這次服藥的補充資訊"
                      multiline
                      numberOfLines={3}
                    />
                    <FieldInput
                      label="服藥後感受"
                      value={form.feeling}
                      onChangeText={(feeling) =>
                        setForm((current) => ({
                          ...current,
                          feeling,
                        }))
                      }
                      placeholder="例如：頭痛有緩解、稍微想睡"
                      multiline
                      numberOfLines={3}
                    />
                  </>
                ) : (
                  <>
                    <InfoRow
                      label="紀錄狀態"
                      value={HistoryStatus[history.status]}
                    />
                    <InfoRow
                      label="紀錄來源"
                      value={HistorySource[history.source]}
                    />
                    <InfoRow
                      label="服用時間"
                      value={formatDateTime(history.intakenTime)}
                    />
                    <InfoRow
                      label="實際服用量"
                      value={
                        history.takenAmount != null
                          ? `${history.takenAmount} ${history.doseUnit ? DOSE_UNIT_LABELS[history.doseUnit] : ""}`.trim()
                          : "未填寫"
                      }
                    />
                    <InfoRow
                      label="評分"
                      value={history.rate?.toString() ?? "未填寫"}
                    />
                    <InfoRow
                      label="原因"
                      value={history.reason || "未填寫"}
                    />
                    <InfoRow
                      label="症狀標籤"
                      value={
                        displaySymptomTags.length > 0
                          ? displaySymptomTags.join("、")
                          : "未填寫"
                      }
                    />
                    <InfoRow
                      label="備註"
                      value={history.memo || "未填寫"}
                    />
                    <InfoRow
                      label="服藥後感受"
                      value={history.feeling || "未填寫"}
                    />
                  </>
                )}
              </SectionCard>
            </>
          ) : (
            <View style={styles.emptyState}>
              <ThemedText type="subtitle">
                找不到這筆歷史紀錄
              </ThemedText>
              <ThemedText style={styles.emptyText}>
                這筆資料可能已被移除，或目前的 mock
                資料中沒有對應內容。
              </ThemedText>
            </View>
          )}
        </Container>
        {history && isEditing ? (
          <Header>
            <Pressable
              style={styles.saveButton}
              onPress={handleSave}
            >
              <ThemedText style={styles.saveButtonText}>
                儲存紀錄
              </ThemedText>
            </Pressable>
          </Header>
        ) : null}
      </ThemedView>
    </>
  );
};

export default HistoryDetailModal;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  headerAction: {
    color: "#64748B",
    fontWeight: "600",
  },
  heroCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    gap: 4,
  },
  heroMeta: {
    color: "#64748B",
  },

  helperText: {
    color: "#64748B",
    fontSize: 13,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: "#334155",
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emptyState: {
    gap: 8,
    paddingVertical: 24,
  },
  emptyText: {
    color: "#64748B",
  },
  saveButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#3C83F6",
  },
  saveButtonText: {
    color: "white",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
});
