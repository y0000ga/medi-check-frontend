import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

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
import {
  acceptInvitation,
  createInvitation,
  declineInvitation,
  getInvitationList,
  revokeInvitation,
} from "@/libs/api/care-invitation";
import { createInvtationSchema } from "@/schemas/care-inviation";
import { useUserStore } from "@/stores/user";
import { IPaginationResponse } from "@/types/api/base";
import {
  IInvitation,
  InvationStatus,
  InvitationDirection,
  Role,
} from "@/types/api/care-invitation";
import { ICreateInvitationInput } from "@/types/schemas/care-invitation";
import { createEnumOptions } from "@/utils/common";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";

const SORT_ORDER_LABEL = {
  desc: "最新優先",
  asc: "最舊優先",
} as const;

const INVITATION_DIRECTION_LABEL: Record<
  InvitationDirection,
  string
> = {
  [InvitationDirection.sent]: "我發出的",
  [InvitationDirection.received]: "我收到的",
};

type SortOrder = keyof typeof SORT_ORDER_LABEL;

const InvitationManagementModal = () => {
  const userLoading = useUserStore(
    (state) => state.isLoading.length > 0,
  );
  const [inviteInfo, setInviteInfo] = useState<
    IPaginationResponse<IInvitation>
  >({
    page: 1,
    total_size: 0,
    list: [],
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [directionFilter, setDirectionFilter] =
    useState<InvitationDirection>(InvitationDirection.received);
  const [statusFilter, setStatusFilter] = useState<InvationStatus>(
    InvationStatus.pending,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const invitation = await getInvitationList({
        page,
        page_size: DEFAULT_PAGE_SIZE,
        sort_by: "created_at",
        sort_order: sortOrder,
        direction: directionFilter,
        status: statusFilter,
      });

      setInviteInfo(invitation);
    } finally {
      setLoading(false);
    }
  }, [directionFilter, page, sortOrder, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInvite = async (
    role: Role,
    input: ICreateInvitationInput,
  ) => {
    const body = createInvtationSchema(input);
    await createInvitation(role, body);
    setIsFormExpanded(false);
    setPage(1);
    await loadData();
  };

  const handleAccept = async (invitationId: string) => {
    setLoading(true);
    try {
      await acceptInvitation(invitationId);
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (invitationId: string) => {
    setLoading(true);
    try {
      await declineInvitation(invitationId);
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (invitationId: string) => {
    setLoading(true);
    try {
      await revokeInvitation(invitationId);
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(inviteInfo.total_size / DEFAULT_PAGE_SIZE),
  );
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const directionOptions = useMemo(
    () =>
      createEnumOptions(
        InvitationDirection,
        INVITATION_DIRECTION_LABEL,
      ),
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

  const filterSummary = `${
    INVITATION_DIRECTION_LABEL[directionFilter]
  } / ${INVITATION_STATUS_LABEL[statusFilter]} / ${
    SORT_ORDER_LABEL[sortOrder]
  }`;

  return (
    <>
      <FullScreenLoading visible={userLoading || loading} />
      <ThemedView style={styles.screen}>
        <ModalHeader title="邀請管理" />
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
                  {isFormExpanded ? "收合表單" : "邀請病人或照顧者"}
                </ThemedText>
              </Pressable>

              {isFormExpanded ? (
                <View style={styles.formWrap}>
                  <InviteForm onConfirm={handleInvite} />
                </View>
              ) : null}
            </View>

            <SectionCard title="邀請一覽表">
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
                    <FieldPicker<InvitationDirection>
                      label="邀請方向"
                      value={directionFilter}
                      options={directionOptions}
                      onValueChange={(value) => {
                        setDirectionFilter(value);
                        setPage(1);
                      }}
                    />
                    <FieldPicker<InvationStatus>
                      label="狀態篩選"
                      value={statusFilter}
                      options={statusOptions}
                      onValueChange={(value) => {
                        setStatusFilter(value);
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

              {inviteInfo.list.length ? (
                <View style={styles.listCard}>
                  {inviteInfo.list.map((invite, index) => (
                    <InviteCard
                      key={invite.id}
                      invite={invite}
                      isLast={index === inviteInfo.list.length - 1}
                      direction={directionFilter}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                      onRevoke={handleRevoke}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.emptyCard}>
                  <ThemedText style={styles.emptyText}>
                    這個篩選條件下目前沒有邀請。
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

export default InvitationManagementModal;

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
  listCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
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
