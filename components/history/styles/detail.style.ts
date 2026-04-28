import { StyleSheet } from "react-native";

export const detailStyles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  headerAction: {
    color: "#64748B",
    fontWeight: "600",
  },
  heroCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    gap: 4,
  },
  heroMeta: {
    color: "#64748B",
  },
  helperText: {
    color: "#64748B",
    fontSize: 13,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: "#334155",
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emptyState: {
    gap: 8,
    paddingVertical: 24,
  },
  emptyText: {
    color: "#64748B",
  },
  saveButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#3C83F6",
  },
  saveButtonText: {
    color: "white",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
});