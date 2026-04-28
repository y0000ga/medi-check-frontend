import { AppButton } from "@/components/ui/AppButton";
import { AppStateView } from "@/components/ui/AppStateView";
import { AppDateField } from "@/components/form/AppDateField";
import { AppTextField } from "@/components/form/AppTextField";
import {
  useEditCurrentUserMutation,
  useGetCurrentUserQuery,
} from "@/features/user/userApi";
import { User } from "@/features/user/types";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { formatDateToYYYYMMDD, parseDate } from "@/utils/common";
import InfoRow from "@/components/ui/InfoRow";

type ProfileEditForm = {
  name: string;
  avatarUrl: string;
  birthDate: Date | null;
};

type ProfileEditErrors = Partial<
  Record<"name" | "avatarUrl" | "birthDate" | "form", string>
>;

const isValidUrl = (value: string) => {
  if (!value.trim()) return true;

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const mapUserToForm = (user: User): ProfileEditForm => {
  return {
    name: user.name ?? "",
    avatarUrl: user.avatarUrl ?? "",
    birthDate: parseDate((user as unknown as { birthDate?: string }).birthDate),
  };
};

const validateForm = (form: ProfileEditForm): ProfileEditErrors => {
  const errors: ProfileEditErrors = {};

  if (!form.name.trim()) {
    errors.name = "請輸入姓名";
  }

  if (!isValidUrl(form.avatarUrl)) {
    errors.avatarUrl = "頭像網址格式不正確";
  }

  return errors;
};

const getEmailVerifiedLabel = (isEmailVerified: boolean) => {
  return isEmailVerified ? "已驗證" : "尚未驗證";
};

export default function EditProfileScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    data: currentUser,
    isLoading,
    isError,
    refetch,
  } = useGetCurrentUserQuery();

  const [editCurrentUser, { isLoading: isSubmitting }] =
    useEditCurrentUserMutation();

  const [form, setForm] = useState<ProfileEditForm>({
    name: "",
    avatarUrl: "",
    birthDate: null,
  });

  const [errors, setErrors] = useState<ProfileEditErrors>({});

  useEffect(() => {
    if (!currentUser) return;

    setForm(mapUserToForm(currentUser));
    setErrors({});
  }, [currentUser]);

  const handleUpdateForm = <K extends keyof ProfileEditForm>(
    field: K,
    value: ProfileEditForm[K],
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
    if (!currentUser) return;

    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      await editCurrentUser({
        name: form.name.trim(),
        avatarUrl: form.avatarUrl.trim() || null,
        birthDate: form.birthDate
          ? formatDateToYYYYMMDD(form.birthDate)
          : undefined,
      }).unwrap();

      router.replace("/(protected)/settings/main");
    } catch {
      setErrors({
        form: "更新個人資料失敗，請稍後再試。",
      });
    }
  };

  if (isLoading) {
    return <AppStateView loading description="載入個人資料中..." />;
  }

  if (isError) {
    return (
      <AppStateView
        title="個人資料載入失敗"
        description="請稍後再試，或重新整理資料。"
        actionLabel="重新整理"
        onActionPress={refetch}
      />
    );
  }

  if (!currentUser) {
    return (
      <AppStateView
        iconName="person-circle-outline"
        title="找不到個人資料"
        description="目前無法取得登入使用者資料。"
        actionLabel="返回"
        onActionPress={() => router.replace("/(protected)/settings/main")}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "編輯個人資料",
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace("/(protected)/settings/main")}
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
          <View style={styles.headerCard}>
            <View style={styles.avatarBox}>
              {form.avatarUrl ? (
                <Image source={{ uri: form.avatarUrl }} style={styles.avatar} />
              ) : (
                <Ionicons
                  name="person-outline"
                  size={36}
                  color={theme.colors.primary}
                />
              )}
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {form.name || currentUser.name}
              </Text>

              <Text style={styles.headerMeta} numberOfLines={1}>
                {currentUser.email}
              </Text>

              <Text style={styles.headerMeta}>
                Email：{getEmailVerifiedLabel(currentUser.isEmailVerified)}
              </Text>
            </View>
          </View>

          {errors.form && (
            <View style={styles.formErrorBox}>
              <Text style={styles.formErrorText}>{errors.form}</Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>帳號資訊</Text>

            <InfoRow label="Email" value={currentUser.email} />
            <InfoRow
              label="Email 驗證"
              value={getEmailVerifiedLabel(currentUser.isEmailVerified)}
            />
            <InfoRow label="帳號狀態" value={currentUser.status} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>可編輯資料</Text>

            <AppTextField
              label="姓名"
              value={form.name}
              onChangeText={(value) => handleUpdateForm("name", value)}
              placeholder="請輸入姓名"
              error={errors.name}
              required
            />

            <AppTextField
              label="頭像網址"
              value={form.avatarUrl}
              onChangeText={(value) => handleUpdateForm("avatarUrl", value)}
              placeholder="https://example.com/avatar.png"
              error={errors.avatarUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <AppDateField
              label="生日"
              value={form.birthDate}
              onChange={(date) => handleUpdateForm("birthDate", date)}
              placeholder="請選擇生日"
              error={errors.birthDate}
            />
          </View>

          <View style={styles.actions}>
            <AppButton
              title="儲存修改"
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

    headerCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      ...theme.shadows.card,
    },

    avatarBox: {
      width: 72,
      height: 72,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
      overflow: "hidden",
    },

    avatar: {
      width: 72,
      height: 72,
      borderRadius: theme.radius.full,
    },

    headerInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    headerTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },

    headerMeta: {
      ...theme.typography.caption,
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
