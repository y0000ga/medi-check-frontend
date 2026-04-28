import { AppDateField } from "@/components/form/AppDateField";
import { AppTextField } from "@/components/form/AppTextField";
import { AppButton } from "@/components/ui/AppButton";
import { useGetValidationConfigQuery } from "@/features/appConfig/appConfigApi";
import { useAppTheme } from "@/shared/theme/theme";
import { validateFields } from "@/shared/validation/validator";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useCreatePatientMutation } from "@/features/patient/patientApi";
import { normalizeApiError } from "@/shared/api/errors";

dayjs.extend(utc);

type PatientFormErrors = {
  name?: string;
  birthDate?: string;
  note?: string;
};

export default function NewPatientScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(new Date());
  const [note, setMemo] = useState("");

  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: validationConfig, error: validationConfigError } =
    useGetValidationConfigQuery();

  const [mutateCreate] = useCreatePatientMutation();

  const clearFieldError = (field: keyof PatientFormErrors) => {
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
    const nextErrors: PatientFormErrors = {};

    if (!birthDate) {
      nextErrors.birthDate = "請選擇生日";
    }

    if (!validationConfig) {
      const message = validationConfigError
        ? "驗證規則載入失敗，請稍後再試"
        : "驗證規則尚未載入，請稍後再試";

      nextErrors.name = message;
      nextErrors.note = message;

      setErrors(nextErrors);
      return false;
    }

    const result = validateFields(
      {
        name,
        note,
      },
      {
        name: validationConfig.rules.name,
        note: validationConfig.rules.note,
      },
    );

    nextErrors.name = result.errors.name;
    nextErrors.note = result.errors.note;

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        name: name.trim(),
        birthDate: dayjs(birthDate).utc().toISOString(),
        note: note.trim(),
      };

      await mutateCreate(payload).unwrap();

      router.push("/(protected)/(tabs)/patients");
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.description}>
          請填寫照護對象的基本資料，之後可用於用藥排程與紀錄。
        </Text>

        <View style={styles.form}>
          {formError && (
            <View style={styles.formErrorBox}>
              <Text style={styles.formErrorText}>{formError}</Text>
            </View>
          )}

          <AppTextField
            label="名稱"
            value={name}
            onChangeText={(text) => {
              setName(text);
              clearFieldError("name");
            }}
            placeholder="請輸入照護對象名稱"
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

          <AppDateField
            label="生日"
            value={birthDate}
            onChange={(date) => {
              setBirthDate(date);
              clearFieldError("birthDate");
            }}
            placeholder="請選擇生日"
            error={errors.birthDate}
            required
            maximumDate={new Date()}
          />

          <AppTextField
            label="筆記"
            value={note}
            onChangeText={(text) => {
              setMemo(text);
              clearFieldError("note");
            }}
            placeholder="例如：過敏、特殊照護需求、提醒事項"
            error={errors.note}
            multiline
            numberOfLines={4}
          />

          <View style={styles.actions}>
            <AppButton
              title="取消"
              variant="secondary"
              onPress={() => router.back()}
              disabled={isSubmitting}
              style={styles.actionButton}
            />

            <AppButton
              title="建立"
              onPress={handleSubmit}
              loading={isSubmitting}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingVertical: theme.layout.screenPaddingVertical,
      gap: theme.spacing.xxl,
    },

    header: {
      gap: theme.spacing.sm,
    },

    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
    },

    description: {
      ...theme.typography.body,
      color: theme.colors.textMuted,
    },

    form: {
      gap: theme.spacing.lg,
    },

    formErrorBox: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.errorSoft,
      borderWidth: 1,
      borderColor: theme.colors.error,
    },

    formErrorText: {
      ...theme.typography.captionStrong,
      color: theme.colors.error,
    },

    actions: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },

    actionButton: {
      flex: 1,
    },
  });
