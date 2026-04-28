import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import AddPatientForm from "@/components/care-network/AddPatientForm";
import RelationShipCard from "@/components/care-network/RelationShipCard";
import SectionCard from "@/components/care-network/SectionCard";
import { patientCareStyles } from "@/components/me/styles/patient-care.style";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Container from "@/components/ui/container";
import FieldPicker from "@/components/ui/field-picker";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import ModalHeader from "@/components/ui/modal-header";
import { PERMISSION_LABEL, ROLE_LABEL } from "@/constants/care";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { createPatientSchema } from "@/schemas/patient";
import { IPaginationResponse } from "@/store/api/type";
import { useGetCareRelationshipsQuery } from "@/store/care-relationship/api";
import { ICareRelationship } from "@/store/care-relationship/type";
import { PermissionLevel, Role } from "@/store/care-invitation/type";
import { useCreatePatientMutation } from "@/store/patient/api";
import { useCurrentUser } from "@/store/user";
import { useAppSelector } from "@/store/hooks";
import { ICreatePatientInput } from "@/types/schemas/patient";
import { createEnumOptions } from "@/utils/common";

const SORT_ORDER_LABEL = { desc: "??啣??", asc: "????" } as const;
type SortOrder = keyof typeof SORT_ORDER_LABEL;

const PatientCareModal = () => {
  const currentUser = useCurrentUser();
  const [page, setPage] = useState(1);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [permissionFilter, setPermissionFilter] = useState<PermissionLevel>(PermissionLevel.Write);
  const [directionFilter, setDirectionFilter] = useState<Role>(Role.Patient);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const relationshipQuery = useGetCareRelationshipsQuery({
    page,
    page_size: DEFAULT_PAGE_SIZE,
    sort_by: "created_at",
    sort_order: sortOrder,
    permission_level: permissionFilter,
    direction: directionFilter,
  });
  const relationsInfo: IPaginationResponse<ICareRelationship> =
    relationshipQuery.data ?? { page: 1, total_size: 0, list: [] };
  const [createPatient] = useCreatePatientMutation();
  const loading = relationshipQuery.isFetching;

  const handleCreatePatient = async (input: ICreatePatientInput) => {
    const body = createPatientSchema(input);
    await createPatient({
      birth_date: body.birth_date,
      avatar_url: null,
      name: body.name,
    }).unwrap();
    setIsFormExpanded(false);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(relationsInfo.total_size / DEFAULT_PAGE_SIZE));
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const roleOptions = useMemo(() => createEnumOptions(Role, ROLE_LABEL), []);
  const permissionOptions = useMemo(() => createEnumOptions(PermissionLevel, PERMISSION_LABEL), []);
  const sortOptions = useMemo(() => Object.entries(SORT_ORDER_LABEL).map(([value, label]) => ({ value: value as SortOrder, label })), []);
  const filterSummary = `${ROLE_LABEL[directionFilter]} / ${PERMISSION_LABEL[permissionFilter]} / ${SORT_ORDER_LABEL[sortOrder]}`;

  return (
    <>
      <FullScreenLoading visible={loading} />
      <ThemedView style={patientCareStyles.screen}>
        <ModalHeader title="?犖?霅?" />
        <ScrollView>
          <Container>
            <View style={patientCareStyles.contentCard}>
              <Pressable style={patientCareStyles.toggleButton} onPress={() => setIsFormExpanded((current) => !current)}>
                <ThemedText style={patientCareStyles.toggleButtonText}>
                  {isFormExpanded ? "?嗅??啣?銵典" : "?啣??∪董??鈭?"}
                </ThemedText>
              </Pressable>

              {isFormExpanded ? (
                <View style={patientCareStyles.formWrap}>
                  <AddPatientForm onConfirm={handleCreatePatient} />
                </View>
              ) : null}
            </View>

            <SectionCard title="?扯風???”">
              <View style={patientCareStyles.filterCard}>
                <Pressable style={patientCareStyles.filterToggle} onPress={() => setIsFilterExpanded((current) => !current)}>
                  <View style={patientCareStyles.filterToggleTextWrap}>
                    <ThemedText style={patientCareStyles.filterToggleTitle}>蝭拚璇辣</ThemedText>
                    <ThemedText style={patientCareStyles.filterToggleSummary}>{filterSummary}</ThemedText>
                  </View>
                  <ThemedText style={patientCareStyles.filterToggleArrow}>{isFilterExpanded ? "?嗅?" : "撅?"}</ThemedText>
                </Pressable>

                {isFilterExpanded ? (
                  <View style={patientCareStyles.filterFields}>
                    <FieldPicker<Role>
                      label="閫閬?"
                      value={directionFilter}
                      options={roleOptions}
                      onValueChange={(value) => { setDirectionFilter(value); setPage(1); }}
                    />
                    <FieldPicker<PermissionLevel>
                      label="甈?蝭拚"
                      value={permissionFilter}
                      options={permissionOptions}
                      onValueChange={(value) => { setPermissionFilter(value); setPage(1); }}
                    />
                    <FieldPicker<SortOrder>
                      label="???孵?"
                      value={sortOrder}
                      options={sortOptions}
                      onValueChange={(value) => { setSortOrder(value); setPage(1); }}
                    />
                  </View>
                ) : null}
              </View>

              {relationsInfo.list.length ? (
                <View style={patientCareStyles.relationshipList}>
                  {relationsInfo.list.map((relationship) => (
                    <RelationShipCard
                      key={relationship.id}
                      userRole={currentUser?.patientId === relationship.patient_id ? Role.Patient : Role.CareGiver}
                      relationship={relationship}
                    />
                  ))}
                </View>
              ) : (
                <View style={patientCareStyles.emptyCard}>
                  <ThemedText style={patientCareStyles.emptyText}>
                    ?祟?豢?隞嗡??桀?瘝??扯風????
                  </ThemedText>
                </View>
              )}

              <View style={patientCareStyles.paginationRow}>
                <Pressable
                  style={[patientCareStyles.pageButton, !canGoPrev && patientCareStyles.pageButtonDisabled]}
                  onPress={() => { if (canGoPrev) setPage((current) => current - 1); }}
                  disabled={!canGoPrev}
                >
                  <ThemedText style={patientCareStyles.pageButtonText}>銝???</ThemedText>
                </Pressable>

                <ThemedText style={patientCareStyles.pageText}>
                  蝚?{page} / {totalPages} ??
                </ThemedText>

                <Pressable
                  style={[patientCareStyles.pageButton, !canGoNext && patientCareStyles.pageButtonDisabled]}
                  onPress={() => { if (canGoNext) setPage((current) => current + 1); }}
                  disabled={!canGoNext}
                >
                  <ThemedText style={patientCareStyles.pageButtonText}>銝???</ThemedText>
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
