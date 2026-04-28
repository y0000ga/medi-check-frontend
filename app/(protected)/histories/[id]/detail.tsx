import { AppStateView } from "@/components/ui/AppStateView";
import {
  dosageFormLabelMap,
  doseUnitLabelMap,
} from "@/features/medication/dosageFormOptions";
import { useGetHistoryDetailQuery } from "@/features/history/historyApi";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { formatDateTime } from "@/utils/common";
import { getStatusLabel } from "@/features/history/constants";
import {
  getFeelingLabel,
  getSourceLabel,
} from "@/features/history/historyOptions";
import { createDetailStyles } from "@/styles/history";
import HistoryHeaderCard from "@/components/history/HistoryHeaderCard";
import InfoRow from "@/components/ui/InfoRow";

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const theme = useAppTheme();
  const styles = useMemo(() => createDetailStyles(theme), [theme]);

  const {
    data: history,
    isLoading,
    isFetching,
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

  if (!id) {
    return (
      <AppStateView
        title="缺少紀錄 ID"
        description="無法取得要查看的服藥紀錄。"
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
        description="此紀錄可能已被刪除，或你沒有檢視權限。"
        actionLabel="返回列表"
        onActionPress={() => router.replace("/(protected)/(tabs)/histories")}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "服藥紀錄詳情",
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace("/(protected)/(tabs)/histories")}
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
          headerRight: () => (
            <Pressable
              onPress={() =>
                router.push(`/(protected)/histories/${history.id}/edit`)
              }
              disabled={isFetching}
              hitSlop={12}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                opacity: isFetching ? 0.5 : 1,
              }}
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={theme.colors.primary}
              />
            </Pressable>
          ),
        }}
      />

      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <HistoryHeaderCard history={history} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>服藥狀態</Text>

          <InfoRow label="狀態" value={getStatusLabel(history.status)} />
          <InfoRow label="紀錄來源" value={getSourceLabel(history.source)} />
          <InfoRow
            label="實際服藥時間"
            value={formatDateTime(history.intakeAt)}
          />
          <InfoRow
            label="實際服用劑量"
            value={`${history.takenAmount} ${history.scheduleSnapshot.doseUnit}`}
          />
        </View>

        <View style={styles.card}>
          <Pressable
            onPress={() => {
              router.push(
                `/(protected)/patients/${history.patientSnapshot.id}/detail`,
              );
            }}
          >
            <Text style={styles.cardTitle}>照護對象快照</Text>
            <InfoRow label="名稱" value={history.patientSnapshot.name} />
          </Pressable>
        </View>

        <View style={styles.card}>
          <Pressable
            onPress={() => {
              router.push(
                `/(protected)/medications/${history.medicationSnapshot.id}/detail`,
              );
            }}
          >
            <Text style={styles.cardTitle}>藥品快照</Text>
            <InfoRow label="藥品名稱" value={history.medicationSnapshot.name} />
            <InfoRow
              label="劑型"
              value={dosageFormLabelMap[history.medicationSnapshot.dosageForm]}
            />
          </Pressable>
        </View>

        <View style={styles.card}>
          <Pressable
            onPress={() => {
              router.push(
                `/(protected)/schedules/${history.scheduleSnapshot.id}/detail`,
              );
            }}
          >
            <Text style={styles.cardTitle}>排程快照</Text>
            <InfoRow
              label="預定服藥時間"
              value={formatDateTime(history.scheduleSnapshot.scheduledAt)}
            />
            <InfoRow
              label="預定劑量"
              value={`${history.scheduleSnapshot.amount} ${doseUnitLabelMap[history.scheduleSnapshot.doseUnit]}`}
            />
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>補充紀錄</Text>

          <InfoRow label="身體感受" value={getFeelingLabel(history.feeling)} />

          <View style={styles.noteBlock}>
            <Text style={styles.noteLabel}>備註</Text>
            {history.note ? (
              <Text style={styles.noteText}>{history.note}</Text>
            ) : (
              <Text style={styles.emptyText}>尚未填寫備註</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
