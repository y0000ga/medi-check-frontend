import { StyleSheet } from "react-native";

export const historyStyles = StyleSheet.create({
  container: { width: "100%", flex: 1 },
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
  dateChipSelected: { backgroundColor: "#3C83F6" },
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
  dateTextSelected: { color: "white" },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3C83F6",
  },
  todayDotSelected: { backgroundColor: "white" },
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
  takenChip: { backgroundColor: "#DCFCE7" },
  takenChipText: { color: "#15803D" },
  missedChip: { backgroundColor: "#FEE2E2" },
  missedChipText: { color: "#B91C1C" },
  list: { gap: 16 },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
  },
  paginationButton: {
    minWidth: 88,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  paginationButtonDisabled: { opacity: 0.5 },
  paginationButtonText: {
    color: "#334155",
    fontWeight: "600",
  },
  paginationText: {
    color: "#64748B",
    fontWeight: "600",
  },
  emptyState: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  emptyText: { color: "#64748B" },
});
