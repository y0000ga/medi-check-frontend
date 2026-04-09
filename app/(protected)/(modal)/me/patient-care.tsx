import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import AddPatientForm from "@/components/care-network/AddPatientForm";
import RelationShipCard from "@/components/care-network/RelationShipCard";
import SectionCard from "@/components/care-network/SectionCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { PERMISSION_LABEL, ROLE_LABEL } from "@/constants/care";
import Container from "@/components/ui/container";
import FieldPicker from "@/components/ui/field-picker";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import ModalHeader from "@/components/ui/modal-header";
import { getCareRelationships } from "@/libs/api/care-relationship";
import { createCarePatient } from "@/libs/api/patient";
import { createPatientSchema } from "@/schemas/patient";
import { useUserStore } from "@/stores/user";
import { PermissionLevel, Role } from "@/types/api/care-invitation";
import { IPaginationResponse } from "@/types/api/base";
import { ICareRelationship } from "@/types/api/care-relationship";
import { ICreatePatientInput } from "@/types/schemas/patient";
import { createEnumOptions } from "@/utils/common";

const PAGE_SIZE = 10;

const SORT_ORDER_LABEL = {
  desc: "最新優先",
  asc: "最舊優先",
} as const;

type SortOrder = keyof typeof SORT_ORDER_LABEL;

const PatientCareModal = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const userLoading = useUserStore(
    (state) => state.isLoading.length > 0,
  );
  const [relationsInfo, setRelationshipsInfo] = useState<
    IPaginationResponse<ICareRelationship>
  >({
    page: 1,
    total_size: 0,
    list: [],
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [permissionFilter, setPermissionFilter] =
    useState<PermissionLevel>(PermissionLevel.Write);
  const [directionFilter, setDirectionFilter] = useState<Role>(
    Role.Patient,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const relationship = await getCareRelationships({
        page,
        page_size: PAGE_SIZE,
        sort_by: "created_at",
        sort_order: sortOrder,
        permission_level: permissionFilter,
        direction: directionFilter,
      });

      setRelationshipsInfo(relationship);
    } finally {
      setLoading(false);
    }
  }, [directionFilter, page, permissionFilter, sortOrder]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreatePatient = async (input: ICreatePatientInput) => {
    const body = createPatientSchema(input);
    await createCarePatient(body);
    setIsFormExpanded(false);
    setPage(1);
    await loadData();
  };

  const totalPages = Math.max(
    1,
    Math.ceil(relationsInfo.total_size / PAGE_SIZE),
  );
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const roleOptions = useMemo(
    () => createEnumOptions(Role, ROLE_LABEL),
    [],
  );
  const permissionOptions = useMemo(
    () => createEnumOptions(PermissionLevel, PERMISSION_LABEL),
    [],
  );
  const sortOptions = useMemo(
    () =>
      Object.entries(SORT_ORDER_LABEL).map(([value, label]) => ({
        value: value as SortOrder,
        label,
      })),
    [],
  );

  const filterSummary = `${ROLE_LABEL[directionFilter]} / ${
    PERMISSION_LABEL[permissionFilter]
  } / ${SORT_ORDER_LABEL[sortOrder]}`;

  return (
    <>
      <FullScreenLoading visible={userLoading || loading} />
      <ThemedView style={styles.screen}>
        <ModalHeader title="病人與照護" />
        <ScrollView>
          <Container>
            <View style={styles.contentCard}>
              <Pressable
                style={styles.toggleButton}
                onPress={() =>
                  setIsFormExpanded((current) => !current)
                }
              >
                <ThemedText style={styles.toggleButtonText}>
                  {isFormExpanded ? "收合新增表單" : "新增無帳號病人"}
                </ThemedText>
              </Pressable>

              {isFormExpanded ? (
                <View style={styles.formWrap}>
                  <AddPatientForm onConfirm={handleCreatePatient} />
                </View>
              ) : null}
            </View>

            <SectionCard title="照護關係列表">

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
                    <FieldPicker<Role>
                      label="角色視角"
                      value={directionFilter}
                      options={roleOptions}
                      onValueChange={(value) => {
                        setDirectionFilter(value);
                        setPage(1);
                      }}
                    />
                    <FieldPicker<PermissionLevel>
                      label="權限篩選"
                      value={permissionFilter}
                      options={permissionOptions}
                      onValueChange={(value) => {
                        setPermissionFilter(value);
                        setPage(1);
                      }}
                    />
                    <FieldPicker<SortOrder>
                      label="排序方式"
                      value={sortOrder}
                      options={sortOptions}
                      onValueChange={(value) => {
                        setSortOrder(value);
                        setPage(1);
                      }}
                    />
                  </View>
                ) : null}
              </View>

              {relationsInfo.list.length ? (
                <View style={styles.relationshipList}>
                  {relationsInfo.list.map((relationship) => (
                    <RelationShipCard
                      key={relationship.id}
                      userRole={
                        currentUser?.patient_id ===
                        relationship.patient_id
                          ? Role.Patient
                          : Role.CareGiver
                      }
                      relationship={relationship}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.emptyCard}>
                  <ThemedText style={styles.emptyText}>
                    這個篩選條件下目前沒有照護關係。
                  </ThemedText>
                </View>
              )}

              <View style={styles.paginationRow}>
                <Pressable
                  style={[
                    styles.pageButton,
                    !canGoPrev && styles.pageButtonDisabled,
                  ]}
                  onPress={() => {
                    if (canGoPrev) {
                      setPage((current) => current - 1);
                    }
                  }}
                  disabled={!canGoPrev}
                >
                  <ThemedText style={styles.pageButtonText}>
                    上一頁
                  </ThemedText>
                </Pressable>

                <ThemedText style={styles.pageText}>
                  第 {page} / {totalPages} 頁
                </ThemedText>

                <Pressable
                  style={[
                    styles.pageButton,
                    !canGoNext && styles.pageButtonDisabled,
                  ]}
                  onPress={() => {
                    if (canGoNext) {
                      setPage((current) => current + 1);
                    }
                  }}
                  disabled={!canGoNext}
                >
                  <ThemedText style={styles.pageButtonText}>
                    下一頁
                  </ThemedText>
                </Pressable>
              </View>
            </SectionCard>
          </Container>
        </ScrollView>
      </ThemedView>
    </>
  );
};

export default PatientCareModal;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  contentCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 18,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  toggleButton: {
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
    paddingVertical: 14,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#0F172A",
    fontWeight: "700",
  },
  helperText: {
    color: "#64748B",
    lineHeight: 20,
  },
  formWrap: {
    gap: 12,
  },
  sectionMeta: {
    marginBottom: 12,
    gap: 4,
  },
  sectionMetaText: {
    color: "#64748B",
    fontWeight: "600",
  },
  sectionHint: {
    color: "#94A3B8",
    fontSize: 13,
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
  relationshipList: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  emptyText: {
    color: "#64748B",
    lineHeight: 20,
  },
  paginationRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  pageButton: {
    minWidth: 88,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  pageButtonDisabled: {
    opacity: 0.45,
  },
  pageButtonText: {
    color: "#0F172A",
    fontWeight: "700",
  },
  pageText: {
    color: "#475569",
    fontWeight: "600",
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
