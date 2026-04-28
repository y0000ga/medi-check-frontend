import { StyleSheet } from "react-native";

export const scheduleStyles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  primaryButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#3C83F6",
  },
  primaryButtonText: {
    color: "white",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
  deleteButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
  },
  deleteButtonText: {
    color: "white",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
  weekdaySection: {
    gap: 8,
  },
  sectionLabel: {
    color: "#334155",
  },
  weekdayRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  weekdayChip: {
    minWidth: 38,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  weekdayChipSelected: {
    backgroundColor: "#DBEAFE",
  },
  weekdayChipText: {
    color: "#475569",
    fontWeight: "600",
  },
  weekdayChipTextSelected: {
    color: "#2563EB",
  },
  summaryCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  summaryTitle: {
    color: "#0F172A",
    fontWeight: "700",
  },
  summaryText: {
    color: "#475569",
  },
  errorText: {
    color: "#DC2626",
    lineHeight: 20,
  },
  stepHeader: {
    gap: 4,
  },
  stepDescription: {
    color: "#64748B",
    lineHeight: 20,
  },
  selectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  selectionCardSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  selectionCardContent: {
    flex: 1,
    gap: 4,
  },
  selectionTitle: {
    color: "#0F172A",
    fontWeight: "700",
  },
  selectionMeta: {
    color: "#64748B",
  },
  filterSection: {
    gap: 8,
  },
  filterLabel: {
    color: "#475569",
    fontWeight: "600",
  },
  filterInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0F172A",
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  secondaryButtonText: {
    color: "#334155",
    fontWeight: "600",
  },
  paginationText: {
    color: "#64748B",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyState: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F8FAFC",
    gap: 6,
  },
  emptyStateTitle: {
    color: "#0F172A",
    fontWeight: "700",
  },
  emptyStateText: {
    color: "#64748B",
    lineHeight: 20,
  },
  selectedSummary: {
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    padding: 16,
    gap: 4,
  },
  summaryLabel: {
    color: "#64748B",
  },
  summaryValue: {
    color: "#0F172A",
    fontWeight: "700",
  },
  wizardFooter: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },
  secondaryFooterButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  secondaryFooterButtonText: {
    color: "#334155",
    textAlign: "center",
    fontWeight: "700",
  },
  footerSpacer: {
    flex: 1,
  },
});
