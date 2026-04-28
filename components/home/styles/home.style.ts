import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  container: { width: "100%", flex: 1 },
  subtitle: {
    color: "#64748B",
    fontWeight: "400",
  },
  chip: {
    borderRadius: 50,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipText: {
    color: "#3c83F6",
    fontWeight: "600",
  },
  overview: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  eventContainer: { flexDirection: "column", gap: 16 },
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
});
