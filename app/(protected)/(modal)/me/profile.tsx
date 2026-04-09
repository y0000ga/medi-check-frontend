import { Pressable, StyleSheet, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";

import Container from "@/components/ui/container";
import FieldInput from "@/components/ui/field-input";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import ModalHeader from "@/components/ui/modal-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useUserStore } from "@/stores/user";
import { USER_STATUS_LABEL } from "@/constants/user";

const ProfileModal = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const loadCurrentUser = useUserStore(
    (state) => state.loadCurrentUser,
  );
  const updateProfile = useUserStore((state) => state.updateProfile);
  const loading = useUserStore((state) => state.isLoading.length > 0);

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      loadCurrentUser();
      return;
    }

    setName(currentUser.name);
    setAvatarUrl(currentUser.avatarUrl ?? "");
  }, [currentUser, loadCurrentUser]);

  const initials = useMemo(() => {
    const source = name || currentUser?.name || "Medi Check";

    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [currentUser?.name, name]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("顯示名稱不能留白。");
      return;
    }

    setError("");
    await updateProfile({
      name: name.trim(),
      avatarUrl: avatarUrl.trim() || null,
    });
    router.back();
  };

  return (
    <>
      <FullScreenLoading visible={loading} />
      <ThemedView style={styles.screen}>
        <ModalHeader title="個人檔案" />
        <Container>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {initials}
              </ThemedText>
            </View>
            <View style={styles.profileMeta}>
              <ThemedText
                type="subtitle"
                style={styles.profileName}
              >
                {currentUser?.name ?? "未命名使用者"}
              </ThemedText>
              <ThemedText style={styles.profileEmail}>
                {currentUser?.email ?? ""}
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoCard}>
            <FieldInput
              label="顯示名稱"
              value={name}
              onChangeText={setName}
              placeholder="請輸入顯示名稱"
            />

            <FieldInput
              label="頭像網址"
              value={avatarUrl}
              onChangeText={setAvatarUrl}
              placeholder="https://example.com/avatar.png"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.infoCard}>
            <View style={styles.fieldRow}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <ThemedText style={styles.value}>
                {currentUser?.email ?? ""}
              </ThemedText>
            </View>
            <View style={styles.fieldRow}>
              <ThemedText style={styles.label}>帳號狀態</ThemedText>
              <ThemedText style={styles.value}>
                {currentUser
                  ? USER_STATUS_LABEL[currentUser.status]
                  : ""}
              </ThemedText>
            </View>
          </View>

          {error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : null}
        </Container>
        <Header>
          <Pressable
            style={styles.primaryButton}
            onPress={handleSave}
          >
            <ThemedText style={styles.primaryButtonText}>
              儲存變更
            </ThemedText>
          </Pressable>
        </Header>
      </ThemedView>
    </>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#2563EB",
    fontSize: 22,
    fontWeight: "700",
  },
  profileMeta: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    color: "#0F172A",
  },
  profileEmail: {
    color: "#64748B",
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  fieldRow: {
    gap: 4,
  },
  label: {
    color: "#64748B",
    fontWeight: "600",
  },
  value: {
    color: "#0F172A",
  },
  errorText: {
    color: "#DC2626",
    lineHeight: 20,
  },
  primaryButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#3C83F6",
  },
  primaryButtonText: {
    color: "white",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
});
