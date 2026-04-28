import { AppTextField } from "@/components/form/AppTextField";
import { AppButton } from "@/components/ui/AppButton";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { createStyles } from "@/styles/login";
import { useGetValidationConfigQuery } from "@/features/appConfig/appConfigApi";
import { validateFields } from "@/shared/validation/validator";
import { useSignInMutation } from "@/features/user/userApi";
import { normalizeApiError } from "@/shared/api/errors";
import { tokenStorage } from "@/shared/storage/tokenStorage";
import { useDispatch } from "react-redux";
import { setAuthenticated, setBootstrapped } from "@/features/user/userStore";

type LoginErrors = {
  email?: string;
  password?: string;
};

const isValidEmail = (value: string) => {
  return /^\S+@\S+\.\S+$/.test(value);
};

export default function LoginScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: validationConfig, error: validationConfigError } =
    useGetValidationConfigQuery();

  const [mutateLogin] = useSignInMutation();

  const clearFieldError = (field: keyof LoginErrors) => {
    if (!errors[field]) return;

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validate = () => {
    const nextErrors: LoginErrors = {};

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "請輸入 Email";
    } else if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = "Email 格式不正確";
    }

    if (!validationConfig) {
      const message = validationConfigError
        ? "驗證規則載入失敗，請稍後再試"
        : "驗證規則尚未載入，請稍後再試";

      nextErrors.password = message;

      setErrors(nextErrors);
      return false;
    }

    const fieldValidationResult = validateFields(
      {
        password,
      },
      {
        password: validationConfig.rules.password,
      },
    );

    nextErrors.password = fieldValidationResult.errors.password;
    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleLogin = async () => {
    setFormError(null);
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const result = await mutateLogin({ password, email }).unwrap();
      await tokenStorage.setAccessToken(result.accessToken);

      dispatch(setAuthenticated(true));
      dispatch(setBootstrapped(true));
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
          <Text style={styles.title}>登入</Text>
          <Text style={styles.description}>請登入以管理用藥與照護排程</Text>
        </View>

        {formError && (
          <View style={styles.formErrorBox}>
            <Text style={styles.formErrorText}>{formError}</Text>
          </View>
        )}

        <View style={styles.form}>
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

          <AppTextField
            label="密碼"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearFieldError("password");
            }}
            placeholder="請輸入密碼"
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

          <AppButton
            title="登入"
            onPress={handleLogin}
            loading={isSubmitting}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>尚未建立帳號？</Text>
          <Pressable onPress={() => router.push("/(public)/register")}>
            <Text style={styles.footerLink}>前往註冊</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
