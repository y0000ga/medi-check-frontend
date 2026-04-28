import dayjs from "dayjs";
import { Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { routes } from "@/constants/route";
import { evaluateDosageFormIcon } from "@/utils/common";
import { HistoryItem } from "@/store/history";
import { ThemedView } from "../themed-view";
import { IconSymbol } from "../ui/icon-symbol";
import { ThemedText } from "../themed-text";

const HistoryCard = ({ history }: { history: HistoryItem }) => {
  const router = useRouter();
  const statusText = history.status === "taken" ? "Taken" : "Missed";
  const statusColor = history.status === "taken" ? "#16A34A" : "#DC2626";
  const icon = evaluateDosageFormIcon({
    dosageForm: history.medicationDosageForm,
  });

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(routes.protected.modal.historyDetail(history.id))}
    >
      <ThemedView style={styles.cardHeader}>
        <ThemedView style={[styles.iconWrap, { backgroundColor: icon.backgroundColor }]}>
          <IconSymbol size={22} name={icon.name} color={icon.color} />
        </ThemedView>
        <ThemedView style={styles.content}>
          <ThemedView style={styles.cardTitleRow}>
            <ThemedText style={styles.title}>{history.medicationName}</ThemedText>
            <ThemedText style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.meta}>
            Scheduled {dayjs(history.scheduledTime).format("HH:mm")}
          </ThemedText>
          <ThemedText style={styles.meta}>
            {history.status === "taken"
              ? `Recorded ${history.intakenTime ? dayjs(history.intakenTime).format("HH:mm") : "Not recorded yet"}`
              : "Not taken or missed"}
          </ThemedText>
        </ThemedView>
        <IconSymbol size={24} name="chevron-right" color="#94A3B8" />
      </ThemedView>

      <ThemedView style={styles.cardFooter}>
        <ThemedView style={styles.patientTag}>
          <ThemedText style={styles.patientTagText}>{history.patientName}</ThemedText>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
};

export default HistoryCard;

const styles = StyleSheet.create({
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
  content: { flex: 1, gap: 2 },
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
  statusText: { fontWeight: "700" },
  meta: { color: "#64748B" },
});
