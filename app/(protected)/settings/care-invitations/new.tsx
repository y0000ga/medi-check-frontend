import { AppButton } from "@/components/ui/AppButton";
import { AppSelectField } from "@/components/form/AppSelectField";
import { AppTextField } from "@/components/form/AppTextField";
import {
  useCreateCaregiverInvitationMutation,
  useCreatePatientInvitationMutation,
} from "@/features/careInvitation/careInvitationApi";
import { PermissionLevel } from "@/features/patient/types";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import InfoRow from "@/components/ui/InfoRow";
import { permissionOptions } from "@/features/careRelationship/careRelationshipOptions";

enum InvitationTargetType {
  caregiver = "caregiver",
  patient = "patient",
}

type InvitationForm = {
  targetType: InvitationTargetType;
  inviteeEmail: string;
  permissionLevel: PermissionLevel;
};

type InvitationFormErrors = Partial<
  Record<"targetType" | "inviteeEmail" | "permissionLevel" | "form", string>
>;

const invitationTargetOptions = [
  {
    label: "邀請照護者",
    value: InvitationTargetType.caregiver,
  },
  {
    label: "邀請被照護者",
    value: InvitationTargetType.patient,
  },
];

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

const validateForm = (form: InvitationForm): InvitationFormErrors => {
  const errors: InvitationFormErrors = {};

  if (!form.targetType) {
    errors.targetType = "請選擇邀請類型";
  }

  if (!form.inviteeEmail.trim()) {
    errors.inviteeEmail = "請輸入邀請對象 Email";
  } else if (!isValidEmail(form.inviteeEmail)) {
    errors.inviteeEmail = "Email 格式不正確";
  }

  if (!form.permissionLevel) {
    errors.permissionLevel = "請選擇權限";
  }

  return errors;
};

const getTargetTypeDescription = (targetType: InvitationTargetType) => {
  switch (targetType) {
    case InvitationTargetType.caregiver:
      return "邀請對方成為你的照護者，協助查看或管理你的服藥資料。";
    case InvitationTargetType.patient:
      return "邀請對方成為你的被照護對象，讓你可以查看或管理對方的服藥資料。";
    default:
      return "";
  }
};

export default function NewCareInvitationScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [createCaregiverInvitation, { isLoading: isCreatingCaregiver }] =
    useCreateCaregiverInvitationMutation();

  const [createPatientInvitation, { isLoading: isCreatingPatient }] =
    useCreatePatientInvitationMutation();

  const isSubmitting = isCreatingCaregiver || isCreatingPatient;

  const [form, setForm] = useState<InvitationForm>({
    targetType: InvitationTargetType.caregiver,
    inviteeEmail: "",
    permissionLevel: PermissionLevel.read,
  });

  const [errors, setErrors] = useState<InvitationFormErrors>({});

  const handleUpdateForm = <K extends keyof InvitationForm>(
    field: K,
    value: InvitationForm[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      form: undefined,
    }));
  };

  const handleSubmit = async () => {
    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      inviteeEmail: form.inviteeEmail.trim(),
      permissionLevel: form.permissionLevel,
    };

    try {
      if (form.targetType === InvitationTargetType.caregiver) {
        await createCaregiverInvitation(payload).unwrap();
      } else {
        await createPatientInvitation(payload).unwrap();
      }

      router.replace("/(protected)/settings/care-invitations/list");
    } catch {
      setErrors({
        form: "新增邀請失敗，請稍後再試。",
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "新增照護邀請",
          headerLeft: () => (
            <Pressable
              onPress={() =>
                router.push("/(protected)/settings/care-invitations/list")
              }
              hitSlop={12}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
              disabled={isSubmitting}
            >
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color={theme.colors.text}
              />
            </Pressable>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>新增照護邀請</Text>
            <Text style={styles.description}>
              輸入對方 Email，選擇邀請類型與權限後送出邀請。
            </Text>
          </View>

          {errors.form && (
            <View style={styles.formErrorBox}>
              <Text style={styles.formErrorText}>{errors.form}</Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>邀請設定</Text>

            <AppSelectField
              label="邀請類型"
              value={form.targetType}
              onChange={(value) => {
                if (!value) return;
                handleUpdateForm("targetType", value);
              }}
              options={invitationTargetOptions}
              modalTitle="選擇邀請類型"
              error={errors.targetType}
              required
            />

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.infoText}>
                {getTargetTypeDescription(form.targetType)}
              </Text>
            </View>

            <AppTextField
              label="邀請對象 Email"
              value={form.inviteeEmail}
              onChangeText={(value) => handleUpdateForm("inviteeEmail", value)}
              placeholder="user@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.inviteeEmail}
              required
            />

            <AppSelectField
              label="權限"
              value={form.permissionLevel}
              onChange={(value) => {
                if (!value) return;
                handleUpdateForm("permissionLevel", value);
              }}
              options={permissionOptions}
              modalTitle="選擇權限"
              error={errors.permissionLevel}
              required
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>送出後的處理</Text>

            <InfoRow label="狀態" value="等待對方回覆" />
            <InfoRow label="列表位置" value="邀請寄送區" />
            <InfoRow label="可撤回" value="對方接受前，可於邀請寄送區撤回" />
          </View>

          <View style={styles.actions}>
            <AppButton
              title="送出邀請"
              onPress={handleSubmit}
              loading={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
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
      gap: theme.spacing.lg,
    },

    header: {
      gap: theme.spacing.xs,
    },

    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
    },

    description: {
      ...theme.typography.body,
      color: theme.colors.textMuted,
    },

    formErrorBox: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.error,
      backgroundColor: theme.colors.errorSoft,
    },

    formErrorText: {
      ...theme.typography.captionStrong,
      color: theme.colors.error,
    },

    card: {
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    cardTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    infoBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primarySoft,
    },

    infoText: {
      flex: 1,
      ...theme.typography.caption,
      color: theme.colors.text,
      lineHeight: 20,
    },

    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },

    infoLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    infoValue: {
      flex: 1,
      ...theme.typography.captionStrong,
      color: theme.colors.text,
      textAlign: "right",
    },

    actions: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
  });
