import { StyleSheet } from "react-native";
import { ThemedView } from "../themed-view";
import { IInvite } from "@/types/care";
import { ThemedText } from "../themed-text";
import { PERMISSION_LABEL } from "@/constants/care";

interface IProps {
  invite: IInvite;
  isLast: boolean;
}

const InviteCard = ({ invite, isLast }: IProps) => {
  return (
    <ThemedView
      key={invite.relationshipId}
      style={[styles.inviteRow, isLast && styles.inviteRowLast]}
    >
      <ThemedView style={styles.inviteMeta}>
        <ThemedText style={styles.inviteTitle}>
          {invite.patientName}
        </ThemedText>
        <ThemedText style={styles.inviteSubtitle}>
          權限：{PERMISSION_LABEL[invite.permissionLevel]} ・
          邀請日期：
          {` ${new Date(invite.createdAt).toLocaleDateString()}`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.inviteChip}>
        <ThemedText style={styles.inviteChipText}>邀請中</ThemedText>
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
