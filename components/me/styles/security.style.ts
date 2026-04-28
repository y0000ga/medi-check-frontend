import { StyleSheet } from "react-native";

export const securityStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  noticeCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  noticeTitle: {
    color: "#92400E",
    fontWeight: "700",
  },
  noticeText: {
    color: "#B45309",
    lineHeight: 22,
  },
  noticeButton: {
    alignSelf: "flex-start",
    backgroundColor: "#F59E0B",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 4,
  },
  noticeButtonText: {
    color: "white",
    fontWeight: "700",
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  fieldRow: { gap: 4 },
  label: {
    color: "#64748B",
    fontWeight: "600",
  },
  value: { color: "#0F172A" },
  verifiedText: { color: "#15803D" },
  unverifiedText: { color: "#D97706" },
  secondaryButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
  },
  secondaryButtonText: {
    color: "#2563EB",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
});
