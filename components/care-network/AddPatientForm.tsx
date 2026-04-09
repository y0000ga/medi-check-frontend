import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import { useTimedMessage } from "@/hooks/use-timed-message";
import { ICreatePatientInput } from "@/types/schemas/patient";

import { ThemedText } from "../themed-text";
import FieldInput from "../ui/field-input";

interface IProps {
  onConfirm: (input: ICreatePatientInput) => Promise<void>;
}

const AddPatientForm = ({ onConfirm }: IProps) => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const {
    message: feedback,
    showMessage: showFeedback,
    clearMessage: clearFeedback,
  } = useTimedMessage();

  const handleNameChange = (value: string) => {
    setName(value);
    setError("");
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError("");
  };

  const handleBirthDateChange = (value: string) => {
    setBirthDate(value);
    setError("");
  };

  const onAdd = async () => {
    try {
      setError("");
      clearFeedback();
      await onConfirm({
        name,
        birthDate,
        email,
      });
      setName("");
      setBirthDate("");
      setEmail("");
      showFeedback("已新增病人，現在可以繼續邀請照顧者。");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "新增病人失敗",
      );
    }
  };

  return (
    <>
      <FieldInput
        required
        label="病人姓名"
        value={name}
        onChangeText={handleNameChange}
        placeholder="例如：王媽媽"
      />
      <FieldInput
        label="病人 Email"
        value={email}
        onChangeText={handleEmailChange}
        placeholder="例如：abc@gmail.com"
      />
      <FieldInput
        label="生日"
        value={birthDate}
        onChangeText={handleBirthDateChange}
        placeholder="YYYY-MM-DD"
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
        style={styles.secondaryAction}
        onPress={onAdd}
      >
        <ThemedText style={styles.secondaryActionText}>
          新增病人
        </ThemedText>
      </Pressable>
    </>
  );
};

export default AddPatientForm;

const styles = StyleSheet.create({
  feedbackText: {
    color: "#15803D",
    lineHeight: 20,
  },
  errorText: {
    color: "#DC2626",
    lineHeight: 20,
  },
  secondaryAction: {
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryActionText: {
    color: "#0F172A",
    fontWeight: "700",
  },
});
