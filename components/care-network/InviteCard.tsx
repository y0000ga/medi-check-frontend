import { Pressable, StyleSheet } from "react-native";

import { INVITATION_STATUS_LABEL } from "@/constants/care-relationship";
import { PERMISSION_LABEL } from "@/constants/care";
import {
  IInvitation,
  InvitationDirection,
  InvitationType,
} from "@/types/api/care-invitation";

import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

interface IProps {
  invite: IInvitation;
  isLast: boolean;
  direction: InvitationDirection;
  onAccept?: (invitationId: string) => void | Promise<void>;
  onDecline?: (invitationId: string) => void | Promise<void>;
  onRevoke?: (invitationId: string) => void | Promise<void>;
}

const INVITATION_TYPE_LABEL: Record<InvitationType, string> = {
  [InvitationType.InvitePatient]: "邀請對方成為病人",
  [InvitationType.InviteCaregive]: "邀請對方成為照顧者",
};

const InviteCard = ({
  invite,
  isLast,
  direction,
  onAccept,
  onDecline,
  onRevoke,
}: IProps) => {
  return (
    <ThemedView
      style={[styles.inviteRow, isLast && styles.inviteRowLast]}
    >
      <ThemedView style={styles.inviteHeader}>
        <ThemedView style={styles.inviteMeta}>
          <ThemedText style={styles.inviteTitle}>
            {direction === InvitationDirection.received
              ? `邀請者：${invite.inviter_name}`
              : `被邀請者：${invite.invitee_name}`}
          </ThemedText>
          <ThemedText style={styles.inviteSubtitle}>
            用途：{INVITATION_TYPE_LABEL[invite.invitation_type]}
          </ThemedText>
          <ThemedText style={styles.inviteSubtitle}>
            權限：{PERMISSION_LABEL[invite.permission_level]}
          </ThemedText>
          <ThemedText style={styles.inviteSubtitle}>
            邀請日期：
            {invite.sent_at
              ? ` ${new Date(invite.sent_at).toLocaleDateString()}`
              : " -"}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.inviteChip}>
          <ThemedText style={styles.inviteChipText}>
            {INVITATION_STATUS_LABEL[invite.status]}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {direction === InvitationDirection.received ? (
        <ThemedView style={styles.actionRow}>
          <Pressable
            style={[styles.secondaryAction, styles.rejectAction]}
            hitSlop={8}
            onPress={() => onDecline?.(invite.id)}
          >
            <ThemedText style={styles.rejectActionText}>
              拒絕
            </ThemedText>
          </Pressable>
          <Pressable
            style={styles.primaryAction}
            hitSlop={8}
            onPress={() => onAccept?.(invite.id)}
          >
            <ThemedText style={styles.primaryActionText}>
              接受邀請
            </ThemedText>
          </Pressable>
        </ThemedView>
      ) : (
        <Pressable
          style={[styles.secondaryAction, styles.revokeAction]}
          hitSlop={8}
          onPress={() => onRevoke?.(invite.id)}
        >
          <ThemedText style={styles.revokeActionText}>
            撤銷邀請
          </ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );
};

export default InviteCard;

const styles = StyleSheet.create({
  inviteRow: {
    gap: 14,
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  inviteRowLast: {
    borderBottomWidth: 0,
  },
  inviteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  inviteMeta: {
    flex: 1,
    gap: 6,
  },
  inviteTitle: {
    color: "#0F172A",
    fontWeight: "700",
    lineHeight: 22,
  },
  inviteSubtitle: {
    color: "#64748B",
    lineHeight: 20,
  },
  inviteChip: {
    alignSelf: "flex-start",
    backgroundColor: "#FEF3C7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inviteChipText: {
    color: "#B45309",
    fontWeight: "700",
    fontSize: 12,
  },
  primaryAction: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryAction: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rejectAction: {
    backgroundColor: "#FEF2F2",
  },
  rejectActionText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 15,
  },
  revokeAction: {
    backgroundColor: "#FFF7ED",
  },
  revokeActionText: {
    color: "#C2410C",
    fontWeight: "700",
    fontSize: 15,
  },
});
