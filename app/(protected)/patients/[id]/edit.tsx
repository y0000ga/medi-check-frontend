import { AppDateField } from "@/components/form/AppDateField";
import { AppTextField } from "@/components/form/AppTextField";
import { AppButton } from "@/components/ui/AppButton";
import { AppStateView } from "@/components/ui/AppStateView";
import { useGetValidationConfigQuery } from "@/features/appConfig/appConfigApi";
import {
  useEditPatientMutation,
  useGetPatientDetailQuery,
} from "@/features/patient/patientApi";
import { normalizeApiError } from "@/shared/api/errors";
import { useAppTheme } from "@/shared/theme/theme";
import { validateFields } from "@/shared/validation/validator";
import { formatDateToYYYYMMDD, parseDate } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type PatientEditErrors = {
  name?: string;
  birthDate?: string;
  note?: string;
};

export default function EditPatientScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [note, setNote] = useState("");

  const [errors, setErrors] = useState<PatientEditErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const {
    data: patient,
    isLoading: isPatientLoading,
    isError: isPatientError,
    refetch,
  } = useGetPatientDetailQuery(
    { id },
    {
      skip: !id,
    },
  );

  const { data: validationConfig, error: validationConfigError } =
    useGetValidationConfigQuery();

  const [editPatient, { isLoading: isEditing }] = useEditPatientMutation();

  useEffect(() => {
    if (!patient || hasInitialized) return;

    setName(patient.name ?? "");
    setBirthDate(parseDate(patient.birthDate));
    setNote(patient.note ?? "");
    setHasInitialized(true);
  }, [patient, hasInitialized]);

  const clearFieldError = (field: keyof PatientEditErrors) => {
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
    const nextErrors: PatientEditErrors = {};

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
        note: validationConfig.rules.memo,
      },
    );

    nextErrors.name = result.errors.name;
    nextErrors.note = result.errors.note;

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!id) {
      setFormError("缺少照護對象 ID，無法更新資料");
      return;
    }

    if (!validate()) return;

    try {
      await editPatient({
        id,
        name: name.trim(),
        birthDate: birthDate ? formatDateToYYYYMMDD(birthDate) : undefined,
        note: note.trim(),
      }).unwrap();

      router.replace(`/(protected)/patients/${id}/detail`);
    } catch (error) {
      const normalizedError = normalizeApiError(error);

      setFormError(normalizedError.message || "更新照護對象失敗，請稍後再試");
    }
  };

  if (isPatientLoading) {
    return <AppStateView loading description="載入照護對象資料中..." />;
  }

  if (isPatientError) {
    return (
      <AppStateView
        title="資料載入失敗"
        description="請稍後再試，或重新整理資料。"
        actionLabel="重新整理"
        onActionPress={refetch}
      />
    );
  }

  if (!patient) {
    return (
      <AppStateView
        iconName="person-circle-outline"
        title="找不到照護對象"
        description="此照護對象可能已被刪除，或你沒有編輯權限。"
        actionLabel="返回"
        onActionPress={() => router.back()}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>編輯照護對象</Text>
          <Text style={styles.description}>
            修改照護對象的基本資料，更新後會套用於相關用藥排程與紀錄。
          </Text>
        </View>

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
              setNote(text);
              clearFieldError("note");
            }}
            placeholder="例如：過敏、特殊照護需求、提醒事項"
            error={errors.note}
            multiline
            numberOfLines={4}
            maxLength={500}
          />

          <View style={styles.actions}>
            <AppButton
              title="取消"
              variant="secondary"
              onPress={() => router.back()}
              disabled={isEditing}
              style={styles.actionButton}
            />

            <AppButton
              title="儲存"
              onPress={handleSubmit}
              loading={isEditing}
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

    content: {
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
