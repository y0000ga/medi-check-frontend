import { AppDateField } from "@/components/form/AppDateField";
import { AppTextField } from "@/components/form/AppTextField";
import { AppButton } from "@/components/ui/AppButton";
import { useGetValidationConfigQuery } from "@/features/appConfig/appConfigApi";
import { useAppTheme } from "@/shared/theme/theme";
import { validateFields } from "@/shared/validation/validator";
import { createStyles } from "@/styles/register";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSignUpMutation } from "@/features/user/userApi";
import { normalizeApiError } from "@/shared/api/errors";

dayjs.extend(utc);

type RegisterErrors = {
  name?: string;
  email?: string;
  birthday?: string;
  password?: string;
  confirmPassword?: string;
};

const isValidEmail = (value: string) => {
  return /^\S+@\S+\.\S+$/.test(value);
};

export default function RegisterScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(new Date());
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: validationConfig, error: validationConfigError } =
    useGetValidationConfigQuery();

  const [mutateRegister] = useSignUpMutation();

  const clearFieldError = (field: keyof RegisterErrors) => {
    if (formError) {
      setFormError(null);
    }

    if (!errors[field]) return;

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validate = () => {
    const nextErrors: RegisterErrors = {};

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "請輸入 Email";
    } else if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = "Email 格式不正確";
    }

    if (!birthDate) {
      nextErrors.birthday = "請選擇生日";
    }

    if (!validationConfig) {
      const message = validationConfigError
        ? "驗證規則載入失敗，請稍後再試"
        : "驗證規則尚未載入，請稍後再試";

      nextErrors.name = message;
      nextErrors.password = message;
      nextErrors.confirmPassword = message;

      setErrors(nextErrors);
      return false;
    }

    const fieldValidationResult = validateFields(
      {
        name,
        password,
        confirmPassword,
      },
      {
        name: validationConfig.rules.name,
        password: validationConfig.rules.password,
        confirmPassword: validationConfig.rules.password,
      },
    );

    nextErrors.name = fieldValidationResult.errors.name;
    nextErrors.password = fieldValidationResult.errors.password;

    nextErrors.confirmPassword =
      fieldValidationResult.errors.confirmPassword ||
      (fieldValidationResult.values.confirmPassword !==
      fieldValidationResult.values.password
        ? "兩次輸入的密碼不一致"
        : undefined);

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleRegister = async () => {
    setFormError(null);
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        name: name.trim(),
        email: email.trim(),
        birthDate: dayjs(birthDate).utc().toISOString(),
        password,
      };

      await mutateRegister(payload).unwrap();
      router.replace("/(protected)/(tabs)/main");
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setFormError(normalizedError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>建立帳號</Text>
          <Text style={styles.description}>
            請填寫基本資料以建立用藥管理帳號
          </Text>
        </View>

        {formError && (
          <View style={styles.formErrorBox}>
            <Text style={styles.formErrorText}>{formError}</Text>
          </View>
        )}

        <View style={styles.form}>
          <AppTextField
            label="使用者名稱"
            value={name}
            onChangeText={(text) => {
              setName(text);
              clearFieldError("name");
            }}
            placeholder="請輸入使用者名稱"
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.name}
            required
            prefixIcon={
              <Ionicons
                name="person-outline"
                size={20}
                color={theme.colors.textMuted}
              />
            }
          />

          <AppTextField
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearFieldError("email");
            }}
            placeholder="請輸入 Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            required
            prefixIcon={
              <Ionicons
                name="mail-outline"
                size={20}
                color={theme.colors.textMuted}
              />
            }
          />

          <AppDateField
            label="生日"
            value={birthDate}
            onChange={(date) => {
              setBirthDate(date);
              clearFieldError("birthday");
            }}
            placeholder="請選擇生日"
            error={errors.birthday}
            required
            maximumDate={new Date()}
          />

          <AppTextField
            label="密碼"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearFieldError("password");
              clearFieldError("confirmPassword");
            }}
            placeholder="至少 6 碼，需包含大寫與特殊符號"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.password}
            required
            prefixIcon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={theme.colors.textMuted}
              />
            }
            suffixIcon={
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.colors.textMuted}
              />
            }
            onPressSuffixIcon={() => setShowPassword((prev) => !prev)}
          />

          <AppTextField
            label="再次輸入密碼"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              clearFieldError("confirmPassword");
            }}
            placeholder="請再次輸入密碼"
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.confirmPassword}
            required
            prefixIcon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={theme.colors.textMuted}
              />
            }
            suffixIcon={
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.colors.textMuted}
              />
            }
            onPressSuffixIcon={() => setShowConfirmPassword((prev) => !prev)}
          />

          <AppButton
            title="建立帳號"
            onPress={handleRegister}
            loading={isSubmitting}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>已經有帳號？</Text>
          <Pressable onPress={() => router.replace("/(public)/login")}>
            <Text style={styles.footerLink}>前往登入</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
