import { StyleSheet } from "react-native";

export const signInStyles = StyleSheet.create({
  screen: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  brandRow: {
    width: "100%",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  brandIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTextWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: "#0F172A",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    justifyContent: "center",
    gap: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  errorText: {
    color: "#DC2626",
    lineHeight: 20,
  },
  inlineAction: {
    alignSelf: "flex-end",
    marginTop: -4,
  },
  inlineActionText: {
    color: "#3C83F6",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#3C83F6",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: {
    color: "white",
    fontWeight: "700",
  },
  bottomAction: {
    alignSelf: "center",
    marginTop: 4,
  },
  bottomActionText: {
    color: "#3C83F6",
    fontWeight: "600",
  },
});

export const funcStyles = StyleSheet.create({
  disabled: {
    opacity: 0.4,
    pointerEvents: "none",
  },
});
