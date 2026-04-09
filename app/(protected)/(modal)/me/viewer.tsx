import { Pressable, StyleSheet, View } from "react-native";
import Container from "@/components/ui/container";
import ModalHeader from "@/components/ui/modal-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useViewerStore } from "@/stores/viewer";

const ViewerModal = () => {
  const mode = useViewerStore((state) => state.mode);

  const setMode = useViewerStore((state) => state.setMode);

  return (
    <ThemedView style={styles.screen}>
      <ModalHeader title="檢視身分" />
      <Container>
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>
            選擇視角
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            切換接下來要查看的是自己的服藥資訊，或照顧對象的資料。
          </ThemedText>

          <View style={styles.modeRow}>
            <Pressable
              style={[
                styles.modeButton,
                mode === "self" && styles.modeButtonActive,
              ]}
              onPress={() => setMode("self")}
            >
              <ThemedText
                style={[
                  styles.modeText,
                  mode === "self" && styles.modeTextActive,
                ]}
              >
                我的服藥
              </ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                mode === "caregiver" && styles.modeButtonActive,
              ]}
              onPress={() => setMode("caregiver")}
            >
              <ThemedText
                style={[
                  styles.modeText,
                  mode === "caregiver" && styles.modeTextActive,
                ]}
              >
                照顧者視角
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </Container>
    </ThemedView>
  );
};

export default ViewerModal;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
  sectionTitle: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 16,
  },
  subtitle: {
    color: "#64748B",
    lineHeight: 22,
  },
  modeRow: {
    flexDirection: "row",
    gap: 12,
  },
  modeButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  modeButtonActive: {
    backgroundColor: "#3C83F6",
    borderColor: "#3C83F6",
  },
  modeButtonDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  modeText: {
    color: "#2563EB",
    fontWeight: "700",
  },
  modeTextActive: {
    color: "white",
  },
  modeTextDisabled: {
    color: "#94A3B8",
  },
  summaryCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryTitle: {
    color: "#0F172A",
    fontWeight: "700",
  },
  summaryText: {
    color: "#475569",
    lineHeight: 22,
  },
  patientSection: {
    gap: 10,
  },
  sectionLabel: {
    color: "#64748B",
    fontWeight: "600",
  },
  patientChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
  },
  patientChipActive: {
    backgroundColor: "#DBEAFE",
  },
  patientChipText: {
    color: "#334155",
    fontWeight: "600",
  },
  patientChipTextActive: {
    color: "#1D4ED8",
  },
  doneButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#3C83F6",
  },
  doneButtonText: {
    color: "white",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
});
