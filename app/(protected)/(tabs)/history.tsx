import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";

import Header from "@/components/ui/header";
import Container from "@/components/ui/container";
import { routes } from "@/constants/route";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { fetchHistories } from "@/libs/api/history";
import { useViewerStore } from "@/stores/viewer";
import { IRES_History } from "@/types/api";
import { evaluateDosageFormIcon } from "@/utils/common";
import { HISTORY_STATUS_LABEL } from "@/constants/history";
import { HistoryStatus } from "@/types/domain";

const Screen = () => {
  const [histories, setHistories] = useState<IRES_History[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const router = useRouter();
  const viewerMode = useViewerStore((state) => state.mode);
  const selfPatient = useViewerStore((state) => state.ownPatient);
  const carePatients = useViewerStore((state) => state.carePatients);
  const selectedPatientId = useViewerStore(
    (state) => state.selectedPatientId,
  );

  const weekDates = useMemo(() => {
    const start = selectedDate.startOf("week");
    return Array.from({ length: 7 }, (_, index) =>
      start.add(index, "day"),
    );
  }, [selectedDate]);

  useEffect(() => {
    let active = true;

    const loadHistories = async () => {
      setLoading(true);
      try {
        const data = await fetchHistories(selectedDate.toISOString());
        if (active) {
          setHistories(data);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadHistories();

    return () => {
      active = false;
    };
  }, [selectedDate]);

  const filteredHistories = useMemo(() => {
    if (viewerMode === "self") {
      return histories.filter(
        (history) => history.patientId === selfPatient?.id,
      );
    }

    if (selectedPatientId) {
      return histories.filter(
        (history) => history.patientId === selectedPatientId,
      );
    }

    const carePatientIds = new Set(
      carePatients.map((item) => item.patientId),
    );
    return histories.filter((history) =>
      carePatientIds.has(history.patientId),
    );
  }, [
    carePatients,
    histories,
    selectedPatientId,
    selfPatient?.id,
    viewerMode,
  ]);

  const takenCount = filteredHistories.filter(
    (item) => item.status === "taken",
  ).length;
  const missedCount = filteredHistories.filter(
    (item) => item.status === "missed",
  ).length;

  const getPatientNameTag = (history: IRES_History) => {
    if (viewerMode !== "caregiver") {
      return null;
    }

    if (selectedPatientId) {
      return (
        carePatients.find(
          (item) => item.patientId === selectedPatientId,
        )?.patientName ?? null
      );
    }

    return (
      history.patientName ||
      (carePatients.find(
        (item) => item.patientId === history.patientId,
      )?.patientName ??
        null)
    );
  };

  return (
    <>
      <FullScreenLoading visible={loading} />
      <ThemedView style={styles.container}>
        <Header>
          <ThemedText type="title">歷史紀錄</ThemedText>
          <ThemedText
            type="subtitle"
            style={styles.subtitle}
          >
            查看每天的服藥紀錄，包含
            {HISTORY_STATUS_LABEL[HistoryStatus.taken]}與
            {HISTORY_STATUS_LABEL[HistoryStatus.missed]}狀態。
          </ThemedText>
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Pressable
                onPress={() =>
                  setSelectedDate((current) =>
                    current.subtract(1, "week"),
                  )
                }
              >
                <IconSymbol
                  size={22}
                  name="chevron-left"
                  color="#64748B"
                />
              </Pressable>
              <ThemedText style={styles.calendarTitle}>
                {selectedDate.format("YYYY 年 M 月")}
              </ThemedText>
              <Pressable
                onPress={() =>
                  setSelectedDate((current) => current.add(1, "week"))
                }
              >
                <IconSymbol
                  size={22}
                  name="chevron-right"
                  color="#64748B"
                />
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.dateRow}>
                {weekDates.map((date) => {
                  const isSelected = date.isSame(selectedDate, "day");
                  const isToday = date.isSame(dayjs(), "day");

                  return (
                    <Pressable
                      key={date.format("YYYY-MM-DD")}
                      style={[
                        styles.dateChip,
                        isSelected && styles.dateChipSelected,
                      ]}
                      onPress={() => setSelectedDate(date)}
                    >
                      <Text
                        style={[
                          styles.dateWeekday,
                          isSelected && styles.dateTextSelected,
                        ]}
                      >
                        {date.format("dd")}
                      </Text>
                      <Text
                        style={[
                          styles.dateNumber,
                          isSelected && styles.dateTextSelected,
                        ]}
                      >
                        {date.format("DD")}
                      </Text>
                      {isToday ? (
                        <View
                          style={[
                            styles.todayDot,
                            isSelected && styles.todayDotSelected,
                          ]}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </Header>
        <Container>
          <View style={styles.summaryRow}>
            <View style={styles.summaryChip}>
              <Text style={styles.summaryChipText}>
                {filteredHistories.length} 筆紀錄
              </Text>
            </View>
            <View style={[styles.summaryChip, styles.takenChip]}>
              <Text
                style={[styles.summaryChipText, styles.takenChipText]}
              >
                {takenCount}{" "}
                {HISTORY_STATUS_LABEL[HistoryStatus.taken]}
              </Text>
            </View>
            <View style={[styles.summaryChip, styles.missedChip]}>
              <Text
                style={[
                  styles.summaryChipText,
                  styles.missedChipText,
                ]}
              >
                {missedCount}{" "}
                {HISTORY_STATUS_LABEL[HistoryStatus.missed]}
              </Text>
            </View>
          </View>
          <View style={styles.list}>
            {filteredHistories.length > 0 ? (
              filteredHistories.map((history) => {
                const icon = evaluateDosageFormIcon({
                  dosageForm: history.medicationDosageForm,
                });
                const statusText =
                  history.status === "taken" ? "已服藥" : "未服藥";
                const statusColor =
                  history.status === "taken" ? "#16A34A" : "#DC2626";
                const patientNameTag = getPatientNameTag(history);

                return (
                  <Pressable
                    key={history.id}
                    style={styles.card}
                    onPress={() => {
                      router.push(
                        routes.protected.modal.historyDetail(
                          history.id,
                        ),
                      );
                    }}
                  >
                    <View style={styles.cardHeader}>
                      <View
                        style={[
                          styles.iconWrap,
                          { backgroundColor: icon.backgroundColor },
                        ]}
                      >
                        <IconSymbol
                          size={22}
                          name={icon.name}
                          color={icon.color}
                        />
                      </View>
                      <View style={styles.content}>
                        <View style={styles.cardTitleRow}>
                          <Text style={styles.title}>
                            {history.medicationName}
                          </Text>
                          <Text
                            style={[
                              styles.statusText,
                              { color: statusColor },
                            ]}
                          >
                            {statusText}
                          </Text>
                        </View>
                        <Text style={styles.meta}>
                          預定時間{" "}
                          {dayjs(history.scheduledTime).format(
                            "HH:mm",
                          )}
                        </Text>
                        <Text style={styles.meta}>
                          {history.status === "taken"
                            ? `紀錄時間 ${history.intakenTime ? dayjs(history.intakenTime).format("HH:mm") : "尚未填寫"}`
                            : "未服藥或已錯過本次提醒"}
                        </Text>
                      </View>
                      <IconSymbol
                        size={24}
                        name="chevron-right"
                        color="#94A3B8"
                      />
                    </View>
                    {patientNameTag ? (
                      <View style={styles.cardFooter}>
                        <View style={styles.patientTag}>
                          <Text style={styles.patientTagText}>
                            {patientNameTag}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </Pressable>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <ThemedText type="subtitle">
                  這一天沒有紀錄
                </ThemedText>
                <ThemedText style={styles.emptyText}>
                  換一天看看，這裡會顯示
                  {HISTORY_STATUS_LABEL[HistoryStatus.taken]}與
                  {HISTORY_STATUS_LABEL[HistoryStatus.missed]}的結果。
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  subtitle: {
    color: "#64748B",
    fontWeight: "400",
  },
  calendarCard: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calendarTitle: {
    color: "#0F172A",
    fontWeight: "700",
  },
  dateRow: {
    flexDirection: "row",
    gap: 10,
    paddingRight: 4,
  },
  dateChip: {
    width: 52,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "white",
    gap: 2,
  },
  dateChipSelected: {
    backgroundColor: "#3C83F6",
  },
  dateWeekday: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  dateNumber: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  dateTextSelected: {
    color: "white",
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3C83F6",
  },
  todayDotSelected: {
    backgroundColor: "white",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 8,
  },
  summaryChip: {
    borderRadius: 999,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  summaryChipText: {
    color: "#3c83F6",
    fontWeight: "600",
  },
  takenChip: {
    backgroundColor: "#DCFCE7",
  },
  takenChipText: {
    color: "#15803D",
  },
  missedChip: {
    backgroundColor: "#FEE2E2",
  },
  missedChipText: {
    color: "#B91C1C",
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  patientTag: {
    backgroundColor: "#F8FAFC",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  patientTagText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "600",
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    color: "#0F172A",
    fontWeight: "600",
    flex: 1,
  },
  statusText: {
    fontWeight: "700",
  },
  meta: {
    color: "#64748B",
  },
  emptyState: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  emptyText: {
    color: "#64748B",
  },
});
