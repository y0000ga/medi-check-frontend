import { AppButton } from "@/components/ui/AppButton";
import { AppStateView } from "@/components/ui/AppStateView";
import { AppDateField } from "@/components/form/AppDateField";
import { AppTextField } from "@/components/form/AppTextField";
import { AppSelectField } from "@/components/form/AppSelectField";
import { dosageFormLabelMap } from "@/features/medication/dosageFormOptions";
import {
  useEditHistoryMutation,
  useGetHistoryDetailQuery,
} from "@/features/history/historyApi";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { formatDateTime } from "@/utils/common";
import InfoRow from "@/components/ui/InfoRow";
import { feelingOptions } from "@/features/history/historyOptions";
import {
  combineDateAndTimeToIso,
  mapHistoryToForm,
  validateForm,
} from "@/features/history/validator";
import { HistoryEditErrors, HistoryEditForm } from "@/features/history/types";
import { createEditStyles } from "@/styles/history";

export default function EditHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const theme = useAppTheme();
  const styles = useMemo(() => createEditStyles(theme), [theme]);

  const {
    data: history,
    isLoading,
    isError,
    refetch,
  } = useGetHistoryDetailQuery(
    {
      historyId: id,
    },
    {
      skip: !id,
    },
  );

  const [editHistory, { isLoading: isSubmitting }] = useEditHistoryMutation();

  const [form, setForm] = useState<HistoryEditForm>({
    intakeDate: null,
    intakeTime: "",
    takenAmount: "",
    note: "",
    feeling: null,
  });

  const [errors, setErrors] = useState<HistoryEditErrors>({});

  useEffect(() => {
    if (!history) return;

    setForm(mapHistoryToForm(history));
    setErrors({});
  }, [history]);

  const handleUpdateForm = <K extends keyof HistoryEditForm>(
    field: K,
    value: HistoryEditForm[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      form: undefined,
    }));
  };

  const handleSubmit = async () => {
    if (!id) return;

    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!form.intakeDate) {
      setErrors({
        form: "缺少實際服藥日期",
      });
      return;
    }

    const intakeAt = combineDateAndTimeToIso(form.intakeDate, form.intakeTime);

    if (!intakeAt) {
      setErrors({
        intakeTime: "時間格式不正確",
      });
      return;
    }

    try {
      const result = await editHistory({
        historyId: id,
        intakeAt,
        takenAmount: Number(form.takenAmount),
        note: form.note.trim() || null,
        feeling: form.feeling,
      }).unwrap();

      router.replace(`/(protected)/histories/${result.historyId}/detail`);
    } catch {
      setErrors({
        form: "更新服藥紀錄失敗，請稍後再試",
      });
    }
  };

  if (!id) {
    return (
      <AppStateView
        title="缺少紀錄 ID"
        description="無法取得要編輯的服藥紀錄。"
        actionLabel="返回"
        onActionPress={() => router.replace("/(protected)/(tabs)/histories")}
      />
    );
  }

  if (isLoading) {
    return <AppStateView loading description="載入服藥紀錄中..." />;
  }

  if (isError) {
    return (
      <AppStateView
        title="服藥紀錄載入失敗"
        description="請稍後再試，或重新整理資料。"
        actionLabel="重新整理"
        onActionPress={refetch}
      />
    );
  }

  if (!history) {
    return (
      <AppStateView
        iconName="document-text-outline"
        title="找不到服藥紀錄"
        description="此紀錄可能已被刪除，或你沒有編輯權限。"
        actionLabel="返回列表"
        onActionPress={() => router.replace("/(protected)/(tabs)/histories")}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "編輯服藥紀錄",
          headerLeft: () => (
            <Pressable
              onPress={() =>
                router.replace(`/(protected)/histories/${history.id}/detail`)
              }
              hitSlop={12}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color={theme.colors.text}
              />
            </Pressable>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerCard}>
            <View style={styles.iconBox}>
              <Ionicons
                name="create-outline"
                size={34}
                color={theme.colors.primary}
              />
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>
                {history.medicationSnapshot.name}
              </Text>
              <Text style={styles.headerMeta}>
                {history.patientSnapshot.name}・
                {dosageFormLabelMap[history.medicationSnapshot.dosageForm]}
              </Text>
              <Text style={styles.headerMeta}>
                預定時間：{formatDateTime(history.scheduleSnapshot.scheduledAt)}
              </Text>
            </View>
          </View>

          {errors.form && (
            <View style={styles.formErrorBox}>
              <Text style={styles.formErrorText}>{errors.form}</Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>實際服藥資訊</Text>

            <AppDateField
              label="實際服藥日期"
              value={form.intakeDate}
              onChange={(date) => handleUpdateForm("intakeDate", date)}
              placeholder="請選擇實際服藥日期"
              error={errors.intakeDate}
              required
            />

            <AppTextField
              label="實際服藥時間"
              value={form.intakeTime}
              onChangeText={(value) => handleUpdateForm("intakeTime", value)}
              placeholder="例如：08:30"
              error={errors.intakeTime}
              keyboardType="numbers-and-punctuation"
              required
            />

            <AppTextField
              label="實際服用劑量"
              value={form.takenAmount}
              onChangeText={(value) => handleUpdateForm("takenAmount", value)}
              placeholder={`預定劑量：${history.scheduleSnapshot.amount} ${history.scheduleSnapshot.doseUnit}`}
              error={errors.takenAmount}
              keyboardType="decimal-pad"
              required
            />

            <View style={styles.referenceBox}>
              <Text style={styles.referenceText}>
                預定劑量：{history.scheduleSnapshot.amount}{" "}
                {history.scheduleSnapshot.doseUnit}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>補充紀錄</Text>

            <AppSelectField
              label="身體感受"
              value={form.feeling === null ? null : String(form.feeling)}
              onChange={(value) => {
                handleUpdateForm(
                  "feeling",
                  value === null ? null : Number(value),
                );
              }}
              options={feelingOptions}
              modalTitle="選擇身體感受"
              error={errors.feeling}
            />

            <AppTextField
              label="備註"
              value={form.note}
              onChangeText={(value) => handleUpdateForm("note", value)}
              placeholder="例如：飯後服用、身體不適、延後服用原因"
              error={errors.note}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>不可修改的快照資訊</Text>

            <InfoRow label="照護對象" value={history.patientSnapshot.name} />
            <InfoRow label="藥品" value={history.medicationSnapshot.name} />
            <InfoRow
              label="劑型"
              value={dosageFormLabelMap[history.medicationSnapshot.dosageForm]}
            />
            <InfoRow
              label="預定時間"
              value={formatDateTime(history.scheduleSnapshot.scheduledAt)}
            />
          </View>

          <View style={styles.actions}>
            <AppButton
              title="儲存修改"
              onPress={handleSubmit}
              loading={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
