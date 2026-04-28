import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
} from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { IconSymbol } from "./icon-symbol";

const TEXT_INPUT_PROPS = {
  underlineColorAndroid: "transparent",
  placeholderTextColor: "#6B7280",
};

interface IFieldInputProps {
  label?: string;
  onChangeText: (text: string) => void;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  required?: boolean;
  iconName?: string;
  message?: string;
}

const FieldInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  disabled,
  multiline,
  numberOfLines,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  required = false,
  iconName,
  message,
}: IFieldInputProps) => {
  return (
    <ThemedView style={styles.field}>
      {label && (
        <ThemedText style={styles.label}>
          {label}
          {required && "*"}
        </ThemedText>
      )}
      <ThemedView
        style={[
          styles.inputContainer,
          multiline && styles.multilineContainer,
          disabled && styles.disabled,
        ]}
      >
        {iconName && (
          <IconSymbol
            name={iconName}
            size={20}
            color="#6B7280"
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            iconName ? { paddingLeft: 40 } : { paddingLeft: 16 },
            styles.input,
            multiline && styles.multilineInput,
            {
              outlineStyle: "none",
            },
          ]}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? "top" : "center"}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          {...TEXT_INPUT_PROPS}
        />
      </ThemedView>
      {message && (
        <ThemedText
          style={{ fontSize: 12, lineHeight: 12, color: "#DC2626" }}
        >
          {message}
        </ThemedText>
      )}
    </ThemedView>
  );
};

export default FieldInput;

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    top: 14,
    left: 12,
  },
  label: {
    color: "#334155",
  },
  input: {
    width: "100%",
    borderWidth: 0,
    fontSize: 14,
    color: "#0F172A",
  },
  inputContainer: {
    backgroundColor: "#F1F5F9",
    width: "100%",
    paddingVertical: 14,

    paddingRight: 16,
    position: "relative",
    borderRadius: 4,
  },
  multilineContainer: {
    minHeight: 112,
  },
  disabled: {
    opacity: 0.6,
  },
  field: {
    flexDirection: "column",
    gap: 8,
  },
  multilineInput: {
    minHeight: 84,
  },
});
