import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { medicationStyles } from "@/components/medication/styles/medication.style";
import MedicationCard from "@/components/medication-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Container from "@/components/ui/container";
import FieldInput from "@/components/ui/field-input";
import FieldPicker from "@/components/ui/field-picker";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { MEDICATION_DOSAGE_FORM } from "@/constants/medication";
import { routes } from "@/constants/route";
import {
  selectMedicationListQuery,
  setMedicationDosageForm,
  setMedicationPage,
  setMedicationSearch,
  setMedicationSort,
  useGetMedicationsQuery,
} from "@/store/medication";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { DosageForm } from "@/types/common";

const SORT_OPTIONS = [
  { label: "Newest", value: "created_at:desc" },
  { label: "Oldest", value: "created_at:asc" },
  { label: "Name A-Z", value: "name:asc" },
  { label: "Name Z-A", value: "name:desc" },
] as const;

const Screen = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const { dosageForm, page, pageSize, search, sortBy, sortOrder } =
    useAppSelector(selectMedicationListQuery);
  const router = useRouter();
  const sortValue = `${sortBy}:${sortOrder}` as (typeof SORT_OPTIONS)[number]["value"];
  const { data, isFetching } = useGetMedicationsQuery({
    page,
    page_size: pageSize,
    sort_by: sortBy,
    sort_order: sortOrder,
    dosage_form: dosageForm,
    search: search.trim() || null,
  });

  const medications = data?.list ?? [];
  const totalSize = data?.total_size ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalSize / DEFAULT_PAGE_SIZE));

  const filterSummary = [
    search.trim() || "All keywords",
    dosageForm ? MEDICATION_DOSAGE_FORM[dosageForm] : "All dosage forms",
    SORT_OPTIONS.find((option) => option.value === sortValue)?.label ?? "Newest",
  ].join(" / ");

  return (
    <>
      <FullScreenLoading visible={isFetching} />
      <ThemedView style={medicationStyles.container}>
        <Header>
          <ThemedText type="title">Medication</ThemedText>
        </Header>
        <Container>
          <View style={medicationStyles.filterCard}>
            <Pressable
              style={medicationStyles.filterToggle}
              onPress={() => setIsFilterExpanded((current) => !current)}
            >
              <View style={medicationStyles.filterToggleTextWrap}>
                <ThemedText style={medicationStyles.filterToggleTitle}>Filters</ThemedText>
                <ThemedText style={medicationStyles.filterToggleSummary}>{filterSummary}</ThemedText>
              </View>
              <ThemedText style={medicationStyles.filterToggleArrow}>
                {isFilterExpanded ? "Hide" : "Show"}
              </ThemedText>
            </Pressable>

            {isFilterExpanded ? (
              <View style={medicationStyles.filterFields}>
                <FieldInput
                  iconName="search"
                  onChangeText={(value) => dispatch(setMedicationSearch(value))}
                  value={search}
                  placeholder="Search medications"
                />
                <FieldPicker<DosageForm | "">
                  label="Dosage form"
                  value={dosageForm ?? ""}
                  options={[
                    { label: "All dosage forms", value: "" as const },
                    ...Object.values(DosageForm).map((value) => ({
                      label: MEDICATION_DOSAGE_FORM[value],
                      value,
                    })),
                  ]}
                  onValueChange={(value) => dispatch(setMedicationDosageForm(value || null))}
                />
                <FieldPicker<(typeof SORT_OPTIONS)[number]["value"]>
                  label="Sort by"
                  value={sortValue}
                  options={[...SORT_OPTIONS]}
                  onValueChange={(value) => {
                    const [nextSortBy, nextSortOrder] = value.split(":") as [string, "desc" | "asc"];
                    dispatch(setMedicationSort({ sortBy: nextSortBy, sortOrder: nextSortOrder }));
                  }}
                />
              </View>
            ) : null}
          </View>

          {medications.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} patientNameTag={medication.patientName} />
          ))}

          <View style={medicationStyles.paginationRow}>
            <Pressable
              style={[medicationStyles.paginationButton, page === 1 && medicationStyles.paginationButtonDisabled]}
              onPress={() => dispatch(setMedicationPage(page - 1))}
              disabled={page === 1}
            >
              <ThemedText style={medicationStyles.paginationButtonText}>Previous</ThemedText>
            </Pressable>
            <ThemedText style={medicationStyles.paginationText}>
              Page {page} / {totalPages}
            </ThemedText>
            <Pressable
              style={[medicationStyles.paginationButton, page >= totalPages && medicationStyles.paginationButtonDisabled]}
              onPress={() => dispatch(setMedicationPage(page + 1))}
              disabled={page >= totalPages}
            >
              <ThemedText style={medicationStyles.paginationButtonText}>Next</ThemedText>
            </Pressable>
          </View>
        </Container>
        <Pressable style={medicationStyles.addButton} onPress={() => router.push(routes.protected.modal.createMedication())}>
          <IconSymbol name="add" size={28} color="white" style={{ margin: "auto" }} />
        </Pressable>
      </ThemedView>
    </>
  );
};

export default Screen;
