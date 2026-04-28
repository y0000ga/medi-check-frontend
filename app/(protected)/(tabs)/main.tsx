import ScheduleMatchCard from "@/components/schedule/ScheduleMatchCard";
import { AppStateView } from "@/components/ui/AppStateView";
import { useQuickCheckHistoryMutation } from "@/features/history/historyApi";

import { useGetScheduleMatchesQuery } from "@/features/schedule/scheduleApi";
import { ScheduleMatch } from "@/features/schedule/types";
import { useAppTheme } from "@/shared/theme/theme";
import { createStyles } from "@/styles/event";
import { formatDateToYYYYMMDD } from "@/utils/common";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

export default function HomeScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const today = useMemo(() => formatDateToYYYYMMDD(new Date()), []);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetScheduleMatchesQuery({
      fromDate: today,
      toDate: today,
    });

  const sortedMatches = useMemo(() => {
    return [...(data?.list ?? [])].sort((a, b) =>
      a.scheduledAt.localeCompare(b.scheduledAt),
    );
  }, [data]);

  const [quickCheckHistory, { isLoading: isQuickChecking }] =
    useQuickCheckHistoryMutation();

  const handleQuickCheck = async (match: ScheduleMatch) => {
    try {
      await quickCheckHistory({
        scheduleId: match.scheduleId,
        medicationId: match.medicationId,
        scheduledAt: match.scheduledAt,
      }).unwrap();
    } catch {
      console.warn("Quick check failed");
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.description}>{today}</Text>

      {isLoading ? (
        <AppStateView loading description="載入今日服藥事件中..." />
      ) : isError ? (
        <AppStateView
          title="今日服藥事件載入失敗"
          description="請稍後再試，或重新整理。"
          actionLabel="重新整理"
          onActionPress={refetch}
        />
      ) : sortedMatches.length === 0 ? (
        <AppStateView
          iconName="calendar-outline"
          title="今日沒有服藥事件"
          description="目前沒有需要執行的服藥排程。"
          actionLabel="新增排程"
          onActionPress={() => router.push("/(protected)/schedules/new")}
        />
      ) : (
        <FlatList
          data={sortedMatches}
          keyExtractor={(item) => `${item.scheduleId}-${item.scheduledAt}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor={theme.colors.primary}
            />
          }
          renderItem={({ item }) => (
            <ScheduleMatchCard
              match={item}
              isQuickChecking={isQuickChecking}
              onPress={() =>
                router.push(`/(protected)/schedules/${item.scheduleId}/detail`)
              }
              onQuickCheck={() => handleQuickCheck(item)}
            />
          )}
        />
      )}
    </View>
  );
}
