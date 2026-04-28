import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { invitationManagementStyles } from "@/components/me/styles/invitation-management.style";
import InviteCard from "@/components/care-network/InviteCard";
import InviteForm from "@/components/care-network/InviteForm";
import SectionCard from "@/components/care-network/SectionCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Container from "@/components/ui/container";
import FieldPicker from "@/components/ui/field-picker";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import ModalHeader from "@/components/ui/modal-header";
import { INVITATION_STATUS_LABEL } from "@/constants/care-relationship";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { createInvtationSchema } from "@/schemas/care-inviation";
import { IPaginationResponse } from "@/store/api/type";
import {
  useAcceptInvitationMutation,
  useCreateInvitationMutation,
  useDeclineInvitationMutation,
  useGetInvitationListQuery,
  useRevokeInvitationMutation,
} from "@/store/care-invitation/api";
import {
  IInvitation,
  InvationStatus,
  InvitationDirection,
  Role,
} from "@/store/care-invitation/type";
import { ICreateInvitationInput } from "@/types/schemas/care-invitation";
import { createEnumOptions } from "@/utils/common";

const SORT_ORDER_LABEL = { desc: "??啣??", asc: "????" } as const;
const INVITATION_DIRECTION_LABEL: Record<InvitationDirection, string> = {
  [InvitationDirection.sent]: "??箇?",
  [InvitationDirection.received]: "??啁?",
};
type SortOrder = keyof typeof SORT_ORDER_LABEL;

const InvitationManagementModal = () => {
  const [page, setPage] = useState(1);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [directionFilter, setDirectionFilter] =
    useState<InvitationDirection>(InvitationDirection.received);
  const [statusFilter, setStatusFilter] = useState<InvationStatus>(
    InvationStatus.pending,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const invitationQuery = useGetInvitationListQuery({
    page,
    page_size: DEFAULT_PAGE_SIZE,
    sort_by: "created_at",
    sort_order: sortOrder,
    direction: directionFilter,
    status: statusFilter,
  });
  const inviteInfo: IPaginationResponse<IInvitation> =
    invitationQuery.data ?? { page: 1, total_size: 0, list: [] };
  const [createInvitation] = useCreateInvitationMutation();
  const [acceptInvitation] = useAcceptInvitationMutation();
  const [declineInvitation] = useDeclineInvitationMutation();
  const [revokeInvitation] = useRevokeInvitationMutation();
  const loading = invitationQuery.isFetching;

  const handleInvite = async (
    role: Role,
    input: ICreateInvitationInput,
  ) => {
    const body = createInvtationSchema(input);
    await createInvitation({ role, body }).unwrap();
    setIsFormExpanded(false);
    setPage(1);
  };

  const totalPages = Math.max(
    1,
    Math.ceil(inviteInfo.total_size / DEFAULT_PAGE_SIZE),
  );
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const directionOptions = useMemo(
    () => createEnumOptions(InvitationDirection, INVITATION_DIRECTION_LABEL),
    [],
  );
  const statusOptions = useMemo(
    () => createEnumOptions(InvationStatus, INVITATION_STATUS_LABEL),
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

  const filterSummary = `${INVITATION_DIRECTION_LABEL[directionFilter]} / ${INVITATION_STATUS_LABEL[statusFilter]} / ${SORT_ORDER_LABEL[sortOrder]}`;

  return (
    <>
      <FullScreenLoading visible={loading} />
      <ThemedView style={invitationManagementStyles.screen}>
        <ModalHeader title="?隢恣??" />
        <ScrollView>
          <Container>
            <View style={invitationManagementStyles.contentCard}>
              <Pressable
                style={invitationManagementStyles.toggleButton}
                onPress={() => setIsFormExpanded((current) => !current)}
              >
                <ThemedText style={invitationManagementStyles.toggleButtonText}>
                  {isFormExpanded ? "?嗅?銵典" : "?隢?鈭箸??折“??"}
                </ThemedText>
              </Pressable>

              {isFormExpanded ? (
                <View style={invitationManagementStyles.formWrap}>
                  <InviteForm onConfirm={handleInvite} />
                </View>
              ) : null}
            </View>

            <SectionCard title="?隢?閬質”">
              <View style={invitationManagementStyles.filterCard}>
                <Pressable
                  style={invitationManagementStyles.filterToggle}
                  onPress={() => setIsFilterExpanded((current) => !current)}
                >
                  <View style={invitationManagementStyles.filterToggleTextWrap}>
                    <ThemedText style={invitationManagementStyles.filterToggleTitle}>
                      蝭拚璇辣
                    </ThemedText>
                    <ThemedText style={invitationManagementStyles.filterToggleSummary}>
                      {filterSummary}
                    </ThemedText>
                  </View>
                  <ThemedText style={invitationManagementStyles.filterToggleArrow}>
                    {isFilterExpanded ? "?嗅?" : "撅?"}
                  </ThemedText>
                </Pressable>

                {isFilterExpanded ? (
                  <View style={invitationManagementStyles.filterFields}>
                    <FieldPicker<InvitationDirection>
                      label="?隢??"
                      value={directionFilter}
                      options={directionOptions}
                      onValueChange={(value) => {
                        setDirectionFilter(value);
                        setPage(1);
                      }}
                    />
                    <FieldPicker<InvationStatus>
                      label="??祟??"
                      value={statusFilter}
                      options={statusOptions}
                      onValueChange={(value) => {
                        setStatusFilter(value);
                        setPage(1);
                      }}
                    />
                    <FieldPicker<SortOrder>
                      label="???孵?"
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

              {inviteInfo.list.length ? (
                <View style={invitationManagementStyles.listCard}>
                  {inviteInfo.list.map((invite, index) => (
                    <InviteCard
                      key={invite.id}
                      invite={invite}
                      isLast={index === inviteInfo.list.length - 1}
                      direction={directionFilter}
                      onAccept={async (id) => acceptInvitation(id).unwrap()}
                      onDecline={async (id) => declineInvitation(id).unwrap()}
                      onRevoke={async (id) => revokeInvitation(id).unwrap()}
                    />
                  ))}
                </View>
              ) : (
                <View style={invitationManagementStyles.emptyCard}>
                  <ThemedText style={invitationManagementStyles.emptyText}>
                    ?祟?豢?隞嗡??桀?瘝??隢?
                  </ThemedText>
                </View>
              )}

              <View style={invitationManagementStyles.paginationRow}>
                <Pressable
                  style={[
                    invitationManagementStyles.pageButton,
                    !canGoPrev && invitationManagementStyles.pageButtonDisabled,
                  ]}
                  onPress={() => {
                    if (canGoPrev) setPage((current) => current - 1);
                  }}
                  disabled={!canGoPrev}
                >
                  <ThemedText style={invitationManagementStyles.pageButtonText}>
                    銝???
                  </ThemedText>
                </Pressable>

                <ThemedText style={invitationManagementStyles.pageText}>
                  蝚?{page} / {totalPages} ??
                </ThemedText>

                <Pressable
                  style={[
                    invitationManagementStyles.pageButton,
                    !canGoNext && invitationManagementStyles.pageButtonDisabled,
                  ]}
                  onPress={() => {
                    if (canGoNext) setPage((current) => current + 1);
                  }}
                  disabled={!canGoNext}
                >
                  <ThemedText style={invitationManagementStyles.pageButtonText}>
                    銝???
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

export default InvitationManagementModal;
