import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import { PERMISSION_LABEL, ROLE_LABEL } from "@/constants/care";
import { useTimedMessage } from "@/hooks/use-timed-message";
import { PermissionLevel, Role } from "@/types/api/care-invitation";
import { ICreateInvitationInput } from "@/types/schemas/care-invitation";
import { createEnumOptions } from "@/utils/common";

import { ThemedText } from "../themed-text";
import FieldInput from "../ui/field-input";
import FieldPicker from "../ui/field-picker";

interface IProps {
  onConfirm: (
    role: Role,
    input: ICreateInvitationInput,
  ) => Promise<void>;
}

const InviteForm = ({ onConfirm }: IProps) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<PermissionLevel>(
    PermissionLevel.Read,
  );
  const [type, setType] = useState<Role>(Role.Patient);
  const [error, setError] = useState("");
  const {
    message: feedback,
    showMessage: showFeedback,
    clearMessage: clearFeedback,
  } = useTimedMessage();

  const handleInvite = async () => {
    try {
      clearFeedback();
      setError("");
      await onConfirm(type, { email, permission });
      setEmail("");
      setPermission(PermissionLevel.Read);
      showFeedback("邀請已送出");
    } catch (inviteActionError) {
      setError(
        inviteActionError instanceof Error
          ? inviteActionError.message
          : "邀請照顧者失敗",
      );
    }
  };

  return (
    <>
      <FieldPicker<Role>
        required
        label="邀請身分"
        value={type}
        options={createEnumOptions(Role, ROLE_LABEL)}
        onValueChange={(value) => setType(value)}
      />
      <FieldInput
        label="照顧者 Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setError("");
        }}
        placeholder="name@example.com"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FieldPicker<PermissionLevel>
        required
        label="權限"
        value={permission}
        options={createEnumOptions(PermissionLevel, PERMISSION_LABEL)}
        onValueChange={(value) => {
          setPermission(value);
          setError("");
        }}
      />
      {feedback ? (
        <ThemedText style={styles.feedbackText}>
          {feedback}
        </ThemedText>
      ) : null}
      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : null}
      <Pressable
        style={styles.primaryAction}
        onPress={handleInvite}
      >
        <ThemedText style={styles.primaryActionText}>
          發送邀請
        </ThemedText>
      </Pressable>
    </>
  );
};

export default InviteForm;

const styles = StyleSheet.create({
  feedbackText: {
    color: "#15803D",
    lineHeight: 20,
  },
  errorText: {
    color: "#DC2626",
    lineHeight: 20,
  },
  primaryAction: {
    borderRadius: 8,
    backgroundColor: "#3C83F6",
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryActionText: {
    color: "white",
    fontWeight: "700",
  },
});
