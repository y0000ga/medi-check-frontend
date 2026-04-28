import { AppButton } from "@/components/ui/AppButton";
import { AppPagination } from "@/components/ui/AppPagination";
import { AppSelectField } from "@/components/form/AppSelectField";
import { AppStateView } from "@/components/ui/AppStateView";
import {
  useAcceptCareInvitationMutation,
  useDeclineCareInvitationMutation,
  useGetCareInvitationsQuery,
  useRevokeCareInvitationMutation,
} from "@/features/careInvitation/careInvitationApi";
import {
  CareInvitation,
  CareInvitationDirection,
  CareInvitationSortBy,
  CareInvitationStatus,
  CareInvitationType,
} from "@/features/careInvitation/types";
import { SortOrder } from "@/shared/api/types";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { formatDateTime } from "@/utils/common";
import { getPermissionLabel } from "@/features/careRelationship/careRelationshipOptions";

const PAGE_SIZE = 20;

const directionOptions: {
  label: string;
  value: CareInvitationDirection;
}[] = [
  { label: "我寄出的邀請", value: CareInvitationDirection.sent },
  { label: "我收到的邀請", value: CareInvitationDirection.received },
];

const statusOptions: {
  label: string;
  value: CareInvitationStatus | null;
}[] = [
  { label: "全部狀態", value: null },
  { label: "等待回覆", value: CareInvitationStatus.pending },
  { label: "已接受", value: CareInvitationStatus.accepted },
  { label: "已拒絕", value: CareInvitationStatus.declined },
  { label: "已撤回", value: CareInvitationStatus.revoked },
];

const getDirectionTitle = (direction: CareInvitationDirection) => {
  switch (direction) {
    case CareInvitationDirection.sent:
      return "我寄出的邀請";
    case CareInvitationDirection.received:
      return "我收到的邀請";
    default:
      return "照護邀請";
  }
};

const getStatusLabel = (status: CareInvitationStatus) => {
  switch (status) {
    case CareInvitationStatus.pending:
      return "等待回覆";
    case CareInvitationStatus.accepted:
      return "已接受";
    case CareInvitationStatus.declined:
      return "已拒絕";
    case CareInvitationStatus.revoked:
      return "已撤回";
    default:
      return "未知";
  }
};

const getStatusIcon = (status: CareInvitationStatus) => {
  switch (status) {
    case CareInvitationStatus.accepted:
      return "checkmark-circle-outline";
    case CareInvitationStatus.declined:
      return "close-circle-outline";
    case CareInvitationStatus.revoked:
      return "remove-circle-outline";
    case CareInvitationStatus.pending:
    default:
      return "time-outline";
  }
};

const getInvitationTypeLabel = (
  type: CareInvitationType,
  direction: CareInvitationDirection,
) => {
  if (direction === CareInvitationDirection.sent) {
    switch (type) {
      case CareInvitationType.invitePatient:
        return "邀請對方成為被照護者";
      case CareInvitationType.inviteCaregiver:
        return "邀請對方成為照護者";
      default:
        return "未知邀請類型";
    }
  }

  switch (type) {
    case CareInvitationType.invitePatient:
      return "邀請你成為被照護者";
    case CareInvitationType.inviteCaregiver:
      return "邀請你成為照護者";
    default:
      return "未知邀請類型";
  }
};

export default function CareInvitationsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [direction, setDirection] = useState<CareInvitationDirection>(
    CareInvitationDirection.received,
  );
  const [status, setStatus] = useState<CareInvitationStatus | null>(null);
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      sortBy: CareInvitationSortBy.createdAt,
      sortOrder: SortOrder.desc,
      direction,
      status,
    }),
    [page, direction, status],
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetCareInvitationsQuery(queryParams);

  const [acceptCareInvitation, { isLoading: isAccepting }] =
    useAcceptCareInvitationMutation();

  const [declineCareInvitation, { isLoading: isDeclining }] =
    useDeclineCareInvitationMutation();

  const [revokeCareInvitation, { isLoading: isRevoking }] =
    useRevokeCareInvitationMutation();

  const isMutating = isAccepting || isDeclining || isRevoking;

  const invitations = data?.list ?? [];
  const totalSize = data?.totalSize ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalSize / PAGE_SIZE));

  const handleChangeDirection = (nextDirection: CareInvitationDirection) => {
    setDirection(nextDirection);
    setStatus(null);
    setPage(1);
  };

  const handleChangeStatus = (nextStatus: CareInvitationStatus | null) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const handleAccept = (invitation: CareInvitation) => {
    if (isMutating) return;

    Alert.alert(
      "接受邀請",
      `確定要接受 ${invitation.inviterName} 的照護邀請嗎？`,
      [
        { text: "取消", style: "cancel" },
        {
          text: "接受",
          onPress: async () => {
            try {
              await acceptCareInvitation({
                invitationId: invitation.id,
              }).unwrap();
            } catch {
              Alert.alert("接受失敗", "請稍後再試。");
            }
          },
        },
      ],
    );
  };

  const handleDecline = (invitation: CareInvitation) => {
    if (isMutating) return;

    Alert.alert(
      "拒絕邀請",
      `確定要拒絕 ${invitation.inviterName} 的照護邀請嗎？`,
      [
        { text: "取消", style: "cancel" },
        {
          text: "拒絕",
          style: "destructive",
          onPress: async () => {
            try {
              await declineCareInvitation({
                invitationId: invitation.id,
              }).unwrap();
            } catch {
              Alert.alert("拒絕失敗", "請稍後再試。");
            }
          },
        },
      ],
    );
  };

  const handleRevoke = (invitation: CareInvitation) => {
    if (isMutating) return;

    Alert.alert(
      "撤回邀請",
      `確定要撤回寄給 ${invitation.inviteeEmail} 的邀請嗎？`,
      [
        { text: "取消", style: "cancel" },
        {
          text: "撤回",
          style: "destructive",
          onPress: async () => {
            try {
              await revokeCareInvitation({
                invitationId: invitation.id,
              }).unwrap();
            } catch {
              Alert.alert("撤回失敗", "請稍後再試。");
            }
          },
        },
      ],
    );
  };

  return (
    <>
      <View style={styles.screen}>
        <View style={styles.filterCard}>
          <AppSelectField
            label="邀請方向"
            value={direction}
            onChange={(value) => {
              if (!value) return;
              handleChangeDirection(value);
            }}
            options={directionOptions}
            modalTitle="選擇邀請方向"
            required
          />

          <AppSelectField
            label="邀請狀態"
            value={status}
            onChange={handleChangeStatus}
            options={statusOptions}
            modalTitle="選擇邀請狀態"
          />
        </View>

        {isLoading ? (
          <AppStateView loading description="載入照護邀請中..." />
        ) : isError ? (
          <AppStateView
            title="照護邀請載入失敗"
            description="請稍後再試，或重新整理列表。"
            actionLabel="重新整理"
            onActionPress={refetch}
          />
        ) : invitations.length === 0 ? (
          <AppStateView
            iconName={
              direction === CareInvitationDirection.sent
                ? "paper-plane-outline"
                : "mail-unread-outline"
            }
            title={`${getDirectionTitle(direction)}目前沒有資料`}
            description={
              status ? "目前沒有符合此狀態的照護邀請。" : "目前沒有照護邀請。"
            }
            actionLabel={
              direction === CareInvitationDirection.sent
                ? "新增邀請"
                : undefined
            }
            onActionPress={
              direction === CareInvitationDirection.sent
                ? () =>
                    router.push("/(protected)/settings/care-invitations/new")
                : undefined
            }
          />
        ) : (
          <>
            <FlatList
              data={invitations}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={isFetching && !isLoading}
                  onRefresh={refetch}
                  tintColor={theme.colors.primary}
                />
              }
              renderItem={({ item }) => (
                <CareInvitationCard
                  invitation={item}
                  direction={direction}
                  isMutating={isMutating}
                  onAccept={() => handleAccept(item)}
                  onDecline={() => handleDecline(item)}
                  onRevoke={() => handleRevoke(item)}
                />
              )}
            />

            <AppPagination
              page={page}
              totalPages={totalPages}
              totalSize={totalSize}
              isLoading={isFetching}
              onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
              onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            />
          </>
        )}
      </View>
    </>
  );
}

type CareInvitationCardProps = {
  invitation: CareInvitation;
  direction: CareInvitationDirection;
  isMutating: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onRevoke: () => void;
};

function CareInvitationCard({
  invitation,
  direction,
  isMutating,
  onAccept,
  onDecline,
  onRevoke,
}: CareInvitationCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isSent = direction === CareInvitationDirection.sent;
  const isReceived = direction === CareInvitationDirection.received;
  const isPending = invitation.status === CareInvitationStatus.pending;

  const title = isSent
    ? invitation.inviteeName || invitation.inviteeEmail
    : invitation.inviterName;

  return (
    <View style={styles.card}>
      <View style={styles.cardIconBox}>
        <Ionicons
          name={getStatusIcon(invitation.status)}
          size={22}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {title}
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {getStatusLabel(invitation.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.metaText} numberOfLines={1}>
          類型：{getInvitationTypeLabel(invitation.invitationType, direction)}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          權限：{getPermissionLabel(invitation.permissionLevel)}
        </Text>

        {isSent ? (
          <>
            <Text style={styles.metaText} numberOfLines={1}>
              收件 Email：{invitation.inviteeEmail}
            </Text>

            {invitation.inviteeName && (
              <Text style={styles.metaText} numberOfLines={1}>
                受邀人：{invitation.inviteeName}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.metaText} numberOfLines={1}>
            邀請人：{invitation.inviterName}
          </Text>
        )}

        <Text style={styles.metaText} numberOfLines={1}>
          寄出時間：{formatDateTime(invitation.sentAt)}
        </Text>

        {invitation.acceptedAt && (
          <Text style={styles.metaText} numberOfLines={1}>
            接受時間：{formatDateTime(invitation.acceptedAt)}
          </Text>
        )}

        {invitation.declinedAt && (
          <Text style={styles.metaText} numberOfLines={1}>
            拒絕時間：{formatDateTime(invitation.declinedAt)}
          </Text>
        )}

        {invitation.revokedAt && (
          <Text style={styles.metaText} numberOfLines={1}>
            撤回時間：{formatDateTime(invitation.revokedAt)}
          </Text>
        )}

        {invitation.expiredAt && (
          <Text style={styles.metaText} numberOfLines={1}>
            到期時間：{formatDateTime(invitation.expiredAt)}
          </Text>
        )}

        {isPending && isSent && (
          <View style={styles.cardActions}>
            <AppButton
              title="撤回邀請"
              variant="secondary"
              onPress={onRevoke}
              loading={isMutating}
            />
          </View>
        )}

        {isPending && isReceived && (
          <View style={styles.cardActionsRow}>
            <AppButton
              title="拒絕"
              variant="secondary"
              onPress={onDecline}
              disabled={isMutating}
              style={styles.actionButton}
            />

            <AppButton
              title="接受"
              onPress={onAccept}
              loading={isMutating}
              style={styles.actionButton}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingTop: theme.layout.screenPaddingVertical,
      gap: theme.spacing.lg,
    },

    header: {
      gap: theme.spacing.lg,
    },

    headerTextGroup: {
      gap: theme.spacing.xs,
    },

    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
    },

    description: {
      ...theme.typography.body,
      color: theme.colors.textMuted,
    },

    filterCard: {
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    listContent: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },

    card: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      ...theme.shadows.card,
    },

    cardIconBox: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
    },

    cardContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    cardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },

    cardTitle: {
      flex: 1,
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primarySoft,
    },

    statusBadgeText: {
      ...theme.typography.captionStrong,
      color: theme.colors.primary,
    },

    metaText: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    cardActions: {
      marginTop: theme.spacing.md,
    },

    cardActionsRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginTop: theme.spacing.md,
    },

    actionButton: {
      flex: 1,
    },
  });
