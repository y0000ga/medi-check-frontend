import { StyleSheet } from "react-native";
import { ThemedView } from "../themed-view";
import { ThemedText } from "../themed-text";
import { PERMISSION_LABEL } from "@/constants/care";
import { IInvitation } from "@/types/api/care-invitation";

interface IProps {
  invite: IInvitation;
  isLast: boolean;
}

const InviteCard = ({ invite, isLast }: IProps) => {
  return (
    <ThemedView
      style={[styles.inviteRow, isLast && styles.inviteRowLast]}
    >
      <ThemedView style={styles.inviteMeta}>
        <ThemedText style={styles.inviteTitle}>
          邀請者：{invite.inviter_name}
        </ThemedText>
        <ThemedText style={styles.inviteSubtitle}>
          權限：{PERMISSION_LABEL[invite.permission_level]} ・
          邀請日期：
          {invite.sent_at &&
            ` ${new Date(invite.sent_at).toLocaleDateString()}`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.inviteChip}>
        <ThemedText style={styles.inviteChipText}>{}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default InviteCard;

const styles = StyleSheet.create({
  inviteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  inviteRowLast: {
    borderBottomWidth: 0,
  },
  inviteMeta: {
    flex: 1,
    gap: 4,
  },
  inviteTitle: {
    color: "#0F172A",
    fontWeight: "700",
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
    paddingVertical: 4,
  },
  inviteChipText: {
    color: "#B45309",
    fontWeight: "700",
    fontSize: 12,
  },
});
