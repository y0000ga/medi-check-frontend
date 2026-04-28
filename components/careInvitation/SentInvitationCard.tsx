import { useAppTheme } from "@/shared/theme/theme";
import { AppButton } from "../ui/AppButton";
import { createStyles } from "@/styles/careInvitation";
import { useMemo } from "react";
import {
  CareInvitation,
  CareInvitationStatus,
  CareInvitationType,
} from "@/features/careInvitation/types";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDateTime } from "@/utils/common";
import { getPermissionLabel } from "@/features/careRelationship/careRelationshipOptions";

type SentInvitationCardProps = {
  invitation: CareInvitation;
  isRevoking: boolean;
  onRevoke: () => void;
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

const getInvitationTypeLabel = (type: CareInvitationType) => {
  switch (type) {
    case CareInvitationType.invitePatient:
      return "邀請對方成為被照護者";
    case CareInvitationType.inviteCaregiver:
      return "邀請對方成為照護者";
    default:
      return "未知邀請類型";
  }
};

function SentInvitationCard({
  invitation,
  isRevoking,
  onRevoke,
}: SentInvitationCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const canRevoke = invitation.status === CareInvitationStatus.pending;

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
            {invitation.inviteeName || invitation.inviteeEmail}
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {getStatusLabel(invitation.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.metaText} numberOfLines={1}>
          Email：{invitation.inviteeEmail}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          類型：{getInvitationTypeLabel(invitation.invitationType)}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          權限：{getPermissionLabel(invitation.permissionLevel)}
        </Text>

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

        {canRevoke && (
          <View style={styles.cardActions}>
            <AppButton
              title="撤回邀請"
              variant="secondary"
              onPress={onRevoke}
              loading={isRevoking}
            />
          </View>
        )}
      </View>
    </View>
  );
}

export default SentInvitationCard;
