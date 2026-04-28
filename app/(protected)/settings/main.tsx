import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useLogoutMutation } from "@/features/user/userApi";
import { clearUser, setBootstrapped } from "@/features/user/userStore";
import { appApi } from "@/shared/api/appApi";
import { tokenStorage } from "@/shared/storage/tokenStorage";
import { useAppDispatch } from "@/shared/store/hooks";
import { useAppTheme } from "@/shared/theme/theme";
import { AppButton } from "@/components/ui/AppButton";

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    Alert.alert("Logout", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            const refreshToken = await tokenStorage.getRefreshToken();

            if (refreshToken) {
              await logout({ refreshToken })
                .unwrap()
                .catch(() => undefined);
            } else {
              await tokenStorage.clearTokens();
              dispatch(clearUser());
              dispatch(appApi.util.resetApiState());
            }
          } finally {
            dispatch(setBootstrapped(true));
            router.replace("/(public)/login");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SettingEntryCard
        iconName="person-circle-outline"
        title="編輯個人資料"
        onPress={() => router.push("/(protected)/settings/profile/edit")}
      />

      <SettingEntryCard
        iconName="people-outline"
        title="管理照護關係"
        onPress={() =>
          router.push("/(protected)/settings/care-relationships/list")
        }
      />

      <SettingEntryCard
        iconName="mail-unread-outline"
        title="照護邀請"
        onPress={() =>
          router.push("/(protected)/settings/care-invitations/list")
        }
      />
      <AppButton
        variant="danger"
        disabled={isLoggingOut}
        onPress={handleLogout}
        title={isLoggingOut ? "登出中..." : "登出"}
      />
    </ScrollView>
  );
}

type SettingEntryCardProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
};

function SettingEntryCard({ iconName, title, onPress }: SettingEntryCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.entryCard, pressed && styles.cardPressed]}
    >
      <View style={styles.entryIconBox}>
        <Ionicons name={iconName} size={24} color={theme.colors.primary} />
      </View>

      <View style={styles.entryContent}>
        <Text style={styles.entryTitle}>{title}</Text>
      </View>

      <Ionicons
        name="chevron-forward-outline"
        size={20}
        color={theme.colors.textMuted}
      />
    </Pressable>
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
      paddingTop: theme.layout.screenPaddingVertical,
      paddingBottom: theme.spacing.xxl,
      gap: theme.spacing.xl,
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

    section: {
      gap: theme.spacing.md,
    },

    sectionTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    entryCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      ...theme.shadows.card,
    },

    cardPressed: {
      opacity: 0.85,
    },

    disabled: {
      opacity: 0.5,
    },

    entryIconBox: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
    },

    entryContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    entryTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    entryDescription: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
      lineHeight: 20,
    },

    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.error,
      ...theme.shadows.card,
    },

    logoutIconBox: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.errorSoft,
    },

    logoutTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.error,
    },
  });
