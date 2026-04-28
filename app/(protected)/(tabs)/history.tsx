import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

import HistoryCard from "@/components/history/history-card";
import { historyStyles } from "@/components/history/styles/history.style";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Container from "@/components/ui/container";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { HISTORY_STATUS_LABEL } from "@/constants/history";
import { useGetHistoriesQuery } from "@/store/history";
import { HistoryStatus } from "@/types/domain";

const Screen = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [page, setPage] = useState(1);
  const { data: historyResult, isFetching: loading, refetch } =
    useGetHistoriesQuery({
      date: selectedDate.toISOString(),
      page,
      pageSize: DEFAULT_PAGE_SIZE,
    });

  const weekDates = useMemo(() => {
    const start = selectedDate.startOf("week");
    return Array.from({ length: 7 }, (_, index) => start.add(index, "day"));
  }, [selectedDate]);

  const totalPages = Math.max(
    1,
    Math.ceil((historyResult?.totalSize ?? 0) / DEFAULT_PAGE_SIZE),
  );
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

  useEffect(() => { setPage(1); }, [selectedDate]);

  return (
    <>
      <FullScreenLoading visible={loading} />
      <ThemedView style={historyStyles.container}>
        <Header>
          <ThemedText type="title">History</ThemedText>
          <ThemedText type="subtitle" style={historyStyles.subtitle}>
            Review taken and missed medication records by day.
          </ThemedText>
          <View style={historyStyles.calendarCard}>
            <View style={historyStyles.calendarHeader}>
              <Pressable onPress={() => setSelectedDate((current) => current.subtract(1, "week"))}>
                <IconSymbol size={22} name="chevron-left" color="#64748B" />
              </Pressable>
              <ThemedText style={historyStyles.calendarTitle}>
                {selectedDate.format("YYYY MMM")}
              </ThemedText>
              <Pressable onPress={() => setSelectedDate((current) => current.add(1, "week"))}>
                <IconSymbol size={22} name="chevron-right" color="#64748B" />
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={historyStyles.dateRow}>
                {weekDates.map((date) => {
                  const isSelected = date.isSame(selectedDate, "day");
                  const isToday = date.isSame(dayjs(), "day");
                  return (
                    <Pressable
                      key={date.format("YYYY-MM-DD")}
                      style={[historyStyles.dateChip, isSelected && historyStyles.dateChipSelected]}
                      onPress={() => setSelectedDate(date)}
                    >
                      <Text style={[historyStyles.dateWeekday, isSelected && historyStyles.dateTextSelected]}>
                        {date.format("dd")}
                      </Text>
                      <Text style={[historyStyles.dateNumber, isSelected && historyStyles.dateTextSelected]}>
                        {date.format("DD")}
                      </Text>
                      {isToday ? <View style={[historyStyles.todayDot, isSelected && historyStyles.todayDotSelected]} /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </Header>
        <Container>
          <View style={historyStyles.summaryRow}>
            <View style={historyStyles.summaryChip}>
              <Text style={historyStyles.summaryChipText}>
                {historyResult?.totalSize ?? 0} 蝑???
              </Text>
            </View>
            <View style={[historyStyles.summaryChip, historyStyles.takenChip]}>
              <Text style={[historyStyles.summaryChipText, historyStyles.takenChipText]}>
                {historyResult?.intakenSize ?? 0} {HISTORY_STATUS_LABEL[HistoryStatus.taken]}
              </Text>
            </View>
            <View style={[historyStyles.summaryChip, historyStyles.missedChip]}>
              <Text style={[historyStyles.summaryChipText, historyStyles.missedChipText]}>
                {historyResult?.missedSize ?? 0} {HISTORY_STATUS_LABEL[HistoryStatus.missed]}
              </Text>
            </View>
          </View>
          <View style={historyStyles.list}>
            {(historyResult?.list.length ?? 0) > 0 ? (
              <>
                {historyResult?.list.map((history) => (
                  <HistoryCard key={history.id} history={history} />
                ))}
                <View style={historyStyles.paginationRow}>
                  <Pressable
                    style={[historyStyles.paginationButton, !canGoPrev && historyStyles.paginationButtonDisabled]}
                    onPress={() => { if (canGoPrev) setPage((current) => current - 1); }}
                    disabled={!canGoPrev}
                  >
                    <ThemedText style={historyStyles.paginationButtonText}>Previous</ThemedText>
                  </Pressable>
                  <ThemedText style={historyStyles.paginationText}>Page {page} / {totalPages}</ThemedText>
                  <Pressable
                    style={[historyStyles.paginationButton, !canGoNext && historyStyles.paginationButtonDisabled]}
                    onPress={() => { if (canGoNext) setPage((current) => current + 1); }}
                    disabled={!canGoNext}
                  >
                    <ThemedText style={historyStyles.paginationButtonText}>Next</ThemedText>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={historyStyles.emptyState}>
                <ThemedText type="subtitle">No history records yet</ThemedText>
                <ThemedText style={historyStyles.emptyText}>
                  Check another date or come back after more doses are tracked.
                </ThemedText>
              </View>
            )}
          </View>
        </Container>
      </ThemedView>
    </>
  );
};

export default Screen;
