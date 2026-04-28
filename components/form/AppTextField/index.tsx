import {
  KeyboardTypeOptions,
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { ReactNode, useMemo, useState } from "react";
import { useAppTheme } from "@/shared/theme/theme";
import { createStyles } from "./styles";

type AppTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;

  placeholder?: string;
  error?: string;

  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  onPressSuffixIcon?: () => void;

  required?: boolean;
  disabled?: boolean;

  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;

  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;

  inputProps?: Omit<
    TextInputProps,
    | "value"
    | "onChangeText"
    | "placeholder"
    | "editable"
    | "keyboardType"
    | "secureTextEntry"
    | "autoCapitalize"
    | "autoCorrect"
    | "multiline"
    | "numberOfLines"
    | "maxLength"
  >;
};

export function AppTextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,

  prefixIcon,
  suffixIcon,
  onPressSuffixIcon,

  required = false,
  disabled = false,

  keyboardType = "default",
  secureTextEntry = false,
  autoCapitalize = "none",
  autoCorrect = false,

  multiline = false,
  numberOfLines,
  maxLength,

  inputProps,
}: AppTextFieldProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);
  const shouldShowIcons = !multiline;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, disabled && styles.disabledText]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View
        style={[
          styles.inputContainer,
          multiline && styles.textareaContainer,
          isFocused && styles.inputContainerFocused,
          hasError && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
        ]}
      >
        {prefixIcon && shouldShowIcons && (
          <View style={styles.prefixIconBox}>{prefixIcon}</View>
        )}

        <TextInput
          style={[
            styles.input,
            multiline && styles.textareaInput,
            disabled && styles.disabledText,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
          editable={!disabled}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          textAlignVertical={multiline ? "top" : "center"}
          scrollEnabled={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={theme.colors.primary}
          cursorColor={theme.colors.primary}
          {...inputProps}
        />

        {suffixIcon &&
          shouldShowIcons &&
          (onPressSuffixIcon ? (
            <Pressable
              onPress={onPressSuffixIcon}
              style={styles.suffixIconButton}
              hitSlop={theme.layout.headerIconHitSlop}
              disabled={disabled}
            >
              {suffixIcon}
            </Pressable>
          ) : (
            <View style={styles.suffixIconBox}>{suffixIcon}</View>
          ))}
      </View>

      <View style={styles.metaRow}>
        {hasError ? <Text style={styles.errorText}>{error}</Text> : <View />}

        {typeof maxLength === "number" && multiline && (
          <Text style={styles.counterText}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
}
