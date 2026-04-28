import { StyleSheet } from "react-native";

export const medicationStyles = StyleSheet.create({
  container: { width: "100%", flex: 1 },
  addButton: {
    position: "fixed",
    right: 16,
    bottom: 56,
    elevation: 4,
    borderRadius: 100,
    width: 56,
    aspectRatio: 1,
    backgroundColor: "#3C83F6",
    borderWidth: 4,
    borderColor: "white",
  },
  filterCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
    gap: 12,
  },
  filterToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  filterToggleTextWrap: {
    flex: 1,
    gap: 4,
  },
  filterToggleTitle: {
    color: "#0F172A",
    fontWeight: "700",
  },
  filterToggleSummary: {
    color: "#64748B",
    lineHeight: 18,
  },
  filterToggleArrow: {
    color: "#2563EB",
    fontWeight: "700",
  },
  filterFields: { gap: 12 },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 24,
  },
  paginationButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
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
});
