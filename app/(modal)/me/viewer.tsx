import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import ModalHeader from "@/components/ui/modal-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useViewerStore } from "@/stores/viewer";

export default function ViewerModal() {
  const mode = useViewerStore((state) => state.mode);
  const ownPatient = useViewerStore((state) => state.ownPatient);
  const carePatients = useViewerStore((state) => state.carePatients);
  const selectedPatientId = useViewerStore((state) => state.selectedPatientId);
  const setMode = useViewerStore((state) => state.setMode);
  const selectPatient = useViewerStore((state) => state.selectPatient);
  const canUseCaregiverView = useViewerStore((state) => state.canUseCaregiverView());

  return (
    <ThemedView style={styles.screen}>
      <ModalHeader title="檢視身分" />
      <Container>
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>選擇視角</ThemedText>
          <ThemedText style={styles.subtitle}>
            切換接下來要查看的是自己的服藥資訊，或照顧對象的資料。
          </ThemedText>

          <View style={styles.modeRow}>
            <Pressable
              style={[styles.modeButton, mode === "self" && styles.modeButtonActive]}
              onPress={() => setMode("self")}
            >
              <ThemedText style={[styles.modeText, mode === "self" && styles.modeTextActive]}>
                我的服藥
              </ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                mode === "caregiver" && styles.modeButtonActive,
                !canUseCaregiverView && styles.modeButtonDisabled,
              ]}
              onPress={() => canUseCaregiverView && setMode("caregiver")}
              disabled={!canUseCaregiverView}
            >
              <ThemedText
                style={[
                  styles.modeText,
                  mode === "caregiver" && styles.modeTextActive,
                  !canUseCaregiverView && styles.modeTextDisabled,
                ]}
              >
                照顧者視角
              </ThemedText>
            </Pressable>
          </View>

          {mode === "self" ? (
            <View style={styles.summaryCard}>
              <ThemedText style={styles.summaryTitle}>目前設定</ThemedText>
              <ThemedText style={styles.summaryText}>
                {ownPatient
                  ? "你現在會以自己的個人服藥視角查看首頁與歷史紀錄。"
                  : "目前帳號尚未綁定自己的病人檔案，之後仍可先以個人帳號身份操作。"}
              </ThemedText>
            </View>
          ) : (
            <View style={styles.patientSection}>
              <ThemedText style={styles.sectionLabel}>照顧對象</ThemedText>

              <Pressable
                style={[styles.patientChip, selectedPatientId === null && styles.patientChipActive]}
                onPress={() => selectPatient(null)}
              >
                <ThemedText
                  style={[
                    styles.patientChipText,
                    selectedPatientId === null && styles.patientChipTextActive,
                  ]}
                >
                  全部病人
                </ThemedText>
              </Pressable>

              {carePatients.map((patient) => (
                <Pressable
                  key={patient.patientId}
                  style={[
                    styles.patientChip,
                    selectedPatientId === patient.patientId && styles.patientChipActive,
                  ]}
                  onPress={() => selectPatient(patient.patientId)}
                >
                  <ThemedText
                    style={[
                      styles.patientChipText,
                      selectedPatientId === patient.patientId && styles.patientChipTextActive,
                    ]}
                  >
                    {patient.patientName}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <Header>
          <Pressable style={styles.doneButton} onPress={() => router.back()}>
            <ThemedText style={styles.doneButtonText}>完成</ThemedText>
          </Pressable>
        </Header>
      </Container>
    </ThemedView>
  );
}

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
