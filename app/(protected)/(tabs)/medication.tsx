import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import Header from "@/components/ui/header";
import Container from "@/components/ui/container";
import FieldPicker from "@/components/ui/field-picker";
import { routes } from "@/constants/route";
import { MEDICATION_DOSAGE_FORM } from "@/constants/medication";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import MedicationCard from "@/components/medication-card";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { useMedicationStore } from "@/stores/medication";
import { useViewerStore } from "@/stores/viewer";
import { DosageForm } from "@/types/common";
import FieldInput from "@/components/ui/field-input";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";

const SORT_OPTIONS = [
  { label: "Newest", value: "created_at:desc" },
  { label: "Oldest", value: "created_at:asc" },
  { label: "Name A-Z", value: "name:asc" },
  { label: "Name Z-A", value: "name:desc" },
] as const;

const Screen = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortValue, setSortValue] =
    useState<(typeof SORT_OPTIONS)[number]["value"]>(
      "created_at:desc",
    );
  const [dosageForm, setDosageForm] = useState<DosageForm | "">("");

  const medications = useMedicationStore(
    (state) => state.medications,
  );
  const loadMedications = useMedicationStore(
    (state) => state.loadMedications,
  );
  const medicationLoading = useMedicationStore(
    (state) => state.isLoading.length > 0,
  );
  const totalSize = useMedicationStore((state) => state.totalSize);
  const viewerMode = useViewerStore((state) => state.mode);
  const carePatients = useViewerStore((state) => state.carePatients);
  const selectedPatientId = useViewerStore(
    (state) => state.selectedPatientId,
  );

  const router = useRouter();
  const totalPages = Math.max(1, Math.ceil(totalSize / DEFAULT_PAGE_SIZE));
  const [sortBy, sortOrder] = sortValue.split(":") as [
    string,
    "desc" | "asc",
  ];

  const filterSummary = [
    search.trim() ? `搜尋：${search.trim()}` : "全部藥品",
    dosageForm ? MEDICATION_DOSAGE_FORM[dosageForm] : "全部劑型",
    SORT_OPTIONS.find((option) => option.value === sortValue)
      ?.label ?? "Newest",
  ].join(" / ");

  const getPatientNameTag = (patientId: string) => {
    if (viewerMode !== "caregiver") {
      return null;
    }

    if (selectedPatientId) {
      return (
        carePatients.find(
          (item) => item.patientId === selectedPatientId,
        )?.patientName ?? null
      );
    }

    return (
      carePatients.find((item) => item.patientId === patientId)
        ?.patientName ?? null
    );
  };

  useEffect(() => {
    const process = async () => {
      await loadMedications({
        search,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy,
        sortOrder,
        dosageForm: dosageForm || null,
      });
    };

    process();
  }, [
    dosageForm,
    loadMedications,
    page,
    search,
    sortBy,
    sortOrder,
    viewerMode,
  ]);

  useEffect(() => {
    setPage(1);
  }, [search, sortValue, dosageForm]);

  return (
    <>
      <FullScreenLoading visible={medicationLoading} />
      <ThemedView style={styles.container}>
        <Header>
          <ThemedText type="title">Medication</ThemedText>
        </Header>
        <Container>
          <View style={styles.filterCard}>
            <Pressable
              style={styles.filterToggle}
              onPress={() =>
                setIsFilterExpanded((current) => !current)
              }
            >
              <View style={styles.filterToggleTextWrap}>
                <ThemedText style={styles.filterToggleTitle}>
                  篩選條件
                </ThemedText>
                <ThemedText style={styles.filterToggleSummary}>
                  {filterSummary}
                </ThemedText>
              </View>
              <ThemedText style={styles.filterToggleArrow}>
                {isFilterExpanded ? "收合" : "展開"}
              </ThemedText>
            </Pressable>

            {isFilterExpanded ? (
              <View style={styles.filterFields}>
                <FieldInput
                  iconName="search"
                  onChangeText={setSearch}
                  value={search}
                  placeholder="搜尋藥品名稱與病人名稱"
                />

                <FieldPicker<DosageForm | "">
                  label="劑型"
                  value={dosageForm}
                  options={[
                    { label: "全部", value: "" as const },
                    ...Object.values(DosageForm).map((value) => ({
                      label: MEDICATION_DOSAGE_FORM[value],
                      value,
                    })),
                  ]}
                  onValueChange={setDosageForm}
                />

                <FieldPicker<(typeof SORT_OPTIONS)[number]["value"]>
                  label="排序"
                  value={sortValue}
                  options={[...SORT_OPTIONS]}
                  onValueChange={setSortValue}
                />
              </View>
            ) : null}
          </View>

          {medications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              patientNameTag={getPatientNameTag(medication.patientId)}
            />
          ))}

          <View style={styles.paginationRow}>
            <Pressable
              style={[
                styles.paginationButton,
                page === 1 && styles.paginationButtonDisabled,
              ]}
              onPress={() => setPage((current) => current - 1)}
              disabled={page === 1}
            >
              <ThemedText style={styles.paginationButtonText}>
                Previous
              </ThemedText>
            </Pressable>
            <ThemedText style={styles.paginationText}>
              Page {page} / {totalPages}
            </ThemedText>
            <Pressable
              style={[
                styles.paginationButton,
                page >= totalPages && styles.paginationButtonDisabled,
              ]}
              onPress={() => setPage((current) => current + 1)}
              disabled={page >= totalPages}
            >
              <ThemedText style={styles.paginationButtonText}>
                Next
              </ThemedText>
            </Pressable>
          </View>
        </Container>
        <Pressable
          style={styles.addButton}
          onPress={() => {
            router.push(routes.protected.modal.createMedication());
          }}
        >
          <IconSymbol
            name="add"
            size={28}
            color="white"
            style={{ margin: "auto" }}
          />
        </Pressable>
      </ThemedView>
    </>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  inputContainer: {
    backgroundColor: "#F1F5F9",
    width: "100%",
    paddingVertical: 10,
    paddingLeft: 40,
    paddingRight: 12,
    position: "relative",
    borderRadius: 8,
  },
  searchIcon: {
    position: "absolute",
    top: 10,
    left: 12,
  },
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
  input: {
    backgroundColor: "#F1F5F9",
    width: "100%",
    borderWidth: 0,
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
  filterFields: {
    gap: 12,
  },
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
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: "#334155",
    fontWeight: "600",
  },
  paginationText: {
    color: "#64748B",
    fontWeight: "600",
  },
});
