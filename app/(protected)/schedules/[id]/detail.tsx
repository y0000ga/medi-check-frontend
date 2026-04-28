import { AppButton } from "@/components/ui/AppButton";
import { AppStateView } from "@/components/ui/AppStateView";
import InfoRow from "@/components/ui/InfoRow";
import { dosageFormLabelMap } from "@/features/medication/dosageFormOptions";
import {
  useGetScheduleDetailQuery,
  useRemoveScheduleMutation,
} from "@/features/schedule/scheduleApi";
import { getEndTypeLabel } from "@/features/schedule/scheduleOptions";
import {
  FrequencyUnit,
  ScheduleEndType,
  ScheduleEndTypeValue,
} from "@/features/schedule/types";
import { useAppTheme } from "@/shared/theme/theme";
import { formatTimeSlots } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const getFrequencyUnitLabel = (value?: FrequencyUnit | null) => {
  switch (value) {
    case FrequencyUnit.day:
      return "天";
    case FrequencyUnit.week:
      return "週";
    case FrequencyUnit.month:
      return "月";
    case FrequencyUnit.year:
      return "年";
    default:
      return "未設定";
  }
};

const getWeekdayLabel = (weekday: number) => {
  switch (weekday) {
    case 0:
      return "週日";
    case 1:
      return "週一";
    case 2:
      return "週二";
    case 3:
      return "週三";
    case 4:
      return "週四";
    case 5:
      return "週五";
    case 6:
      return "週六";
    default:
      return String(weekday);
  }
};

const formatWeekdays = (weekdays: number[]) => {
  if (!weekdays.length) return "未設定";
  return weekdays.map(getWeekdayLabel).join("、");
};

const getRepeatRuleText = (params: {
  endType: ScheduleEndTypeValue;
  frequencyUnit: FrequencyUnit | null;
  interval: number | null;
  weekdays: number[];
}) => {
  const { endType, frequencyUnit, interval, weekdays } = params;

  if (endType === null) {
    return "僅於開始日期發生一次";
  }

  if (!frequencyUnit || !interval) {
    return "重複規則未完整設定";
  }

  if (frequencyUnit === FrequencyUnit.week) {
    return `每 ${interval} 週，於 ${formatWeekdays(weekdays)} 發生`;
  }

  return `每 ${interval} ${getFrequencyUnitLabel(frequencyUnit)}發生`;
};

const getEndConditionText = (params: {
  endType: ScheduleEndTypeValue;
  untilDate: string | null;
  occurrenceCount: number | null;
}) => {
  const { endType, untilDate, occurrenceCount } = params;

  switch (endType) {
    case null:
      return "一次性排程，無重複結束條件";
    case ScheduleEndType.never:
      return "永不結束";
    case ScheduleEndType.until:
      return untilDate ? `到 ${untilDate} 結束` : "未設定結束日期";
    case ScheduleEndType.counts:
      return occurrenceCount
        ? `共發生 ${occurrenceCount} 次`
        : "未設定發生次數";
    default:
      return "未知結束條件";
  }
};

export default function ScheduleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    data: schedule,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetScheduleDetailQuery(
    {
      scheduleId: id,
    },
    {
      skip: !id,
    },
  );

  const [removeSchedule, { isLoading: isRemoving }] =
    useRemoveScheduleMutation();

  const handleDelete = () => {
    if (!id || isRemoving) return;

    Alert.alert("刪除排程", "確定要刪除此排程嗎？此操作無法復原。", [
      {
        text: "取消",
        style: "cancel",
      },
      {
        text: "刪除",
        style: "destructive",
        onPress: async () => {
          try {
            await removeSchedule({
              scheduleId: id,
            }).unwrap();

            router.replace("/(protected)/(tabs)/schedules");
          } catch {
            Alert.alert("刪除失敗", "請稍後再試。");
          }
        },
      },
    ]);
  };

  if (!id) {
    return (
      <AppStateView
        title="缺少排程 ID"
        description="無法取得要查看的排程資料。"
        actionLabel="返回"
        onActionPress={() => router.back()}
      />
    );
  }

  if (isLoading) {
    return <AppStateView loading description="載入排程資料中..." />;
  }

  if (isError) {
    return (
      <AppStateView
        title="排程資料載入失敗"
        description="請稍後再試，或重新整理資料。"
        actionLabel="重新整理"
        onActionPress={refetch}
      />
    );
  }

  if (!schedule) {
    return (
      <AppStateView
        iconName="calendar-outline"
        title="找不到排程"
        description="此排程可能已被刪除，或你沒有檢視權限。"
        actionLabel="返回"
        onActionPress={() => router.back()}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "排程詳情",
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace("/(protected)/(tabs)/schedules")}
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
              onPress={handleDelete}
              disabled={isRemoving}
              hitSlop={12}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                opacity: isRemoving ? 0.5 : 1,
              }}
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color={theme.colors.error}
              />
            </Pressable>
          ),
        }}
      />

      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.iconBox}>
            <Ionicons
              name="calendar-outline"
              size={36}
              color={theme.colors.primary}
            />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.title}>{schedule.medicationName}</Text>
            <Text style={styles.subText}>
              {schedule.patientName}・
              {dosageFormLabelMap[schedule.medicationDosageForm]}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>照護對象</Text>

          <Pressable
            onPress={() =>
              router.push(`/(protected)/patients/${schedule.patientId}/detail`)
            }
            style={({ pressed }) => [
              styles.linkRow,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={styles.linkContent}>
              <InfoRow label="名稱" value={schedule.patientName} />
            </View>

            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={theme.colors.textMuted}
            />
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>藥品資訊</Text>

          <Pressable
            onPress={() =>
              router.push(
                `/(protected)/medications/${schedule.medicationId}/detail`,
              )
            }
            style={({ pressed }) => [
              styles.linkRow,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={styles.linkContent}>
              <InfoRow label="藥品名稱" value={schedule.medicationName} />
              <InfoRow
                label="劑型"
                value={dosageFormLabelMap[schedule.medicationDosageForm]}
              />
            </View>

            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={theme.colors.textMuted}
            />
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>服藥設定</Text>

          <InfoRow
            label="劑量"
            value={`${schedule.amount} ${schedule.doseUnit}`}
          />
          <InfoRow
            label="服藥時間"
            value={formatTimeSlots(schedule.timeSlots)}
          />
          <InfoRow label="開始日期" value={schedule.startDate} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>排程規則</Text>

          <InfoRow label="排程類型" value={getEndTypeLabel(schedule.endType)} />

          <InfoRow
            label="重複規則"
            value={getRepeatRuleText({
              endType: schedule.endType,
              frequencyUnit: schedule.frequencyUnit,
              interval: schedule.interval,
              weekdays: schedule.weekdays,
            })}
          />

          {schedule.frequencyUnit === FrequencyUnit.week && (
            <InfoRow label="星期" value={formatWeekdays(schedule.weekdays)} />
          )}

          <InfoRow
            label="結束條件"
            value={getEndConditionText({
              endType: schedule.endType,
              untilDate: schedule.untilDate,
              occurrenceCount: schedule.occurrenceCount,
            })}
          />
        </View>

        <View style={styles.actions}>
          <AppButton
            title="編輯排程"
            onPress={() =>
              router.push(`/(protected)/schedules/${schedule.id}/edit`)
            }
            loading={isFetching}
            disabled={isRemoving}
          />
        </View>
      </ScrollView>
    </>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    content: {
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingVertical: theme.layout.screenPaddingVertical,
      gap: theme.spacing.lg,
    },

    headerCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      ...theme.shadows.card,
    },

    iconBox: {
      width: 72,
      height: 72,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
    },

    headerInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    title: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },

    subText: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    card: {
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    cardTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    linkRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },

    linkContent: {
      flex: 1,
      gap: theme.spacing.md,
    },

    rowPressed: {
      opacity: 0.85,
    },

    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },

    infoLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    infoValue: {
      flex: 1,
      ...theme.typography.captionStrong,
      color: theme.colors.text,
      textAlign: "right",
    },

    actions: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
  });
