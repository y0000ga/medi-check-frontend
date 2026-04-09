import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import Container from "@/components/ui/container";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import ModalHeader from "@/components/ui/modal-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useUserStore } from "@/stores/user";
import { routes } from "@/constants/route";

const SecurityModal = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const loading = useUserStore((state) => state.isLoading.length > 0);

  return (
    <>
      <FullScreenLoading visible={loading} />
      <ThemedView style={styles.screen}>
        <ModalHeader title="安全與登入" />
        <Container>
          {!currentUser?.isEmailVerified ? (
            <View style={styles.noticeCard}>
              <ThemedText style={styles.noticeTitle}>
                Email 尚未驗證
              </ThemedText>
              <ThemedText style={styles.noticeText}>
                完成 Email
                驗證後，之後在正式流程中會比較容易找回帳號與接收重要通知。
              </ThemedText>
              <Pressable style={styles.noticeButton}>
                <ThemedText style={styles.noticeButtonText}>
                  重新寄送驗證信
                </ThemedText>
              </Pressable>
            </View>
          ) : null}

          <View style={styles.infoCard}>
            <View style={styles.fieldRow}>
              <ThemedText style={styles.label}>Email 驗證</ThemedText>
              <ThemedText
                style={[
                  styles.value,
                  currentUser?.isEmailVerified
                    ? styles.verifiedText
                    : styles.unverifiedText,
                ]}
              >
                {currentUser?.isEmailVerified
                  ? "已完成驗證"
                  : "尚未驗證"}
              </ThemedText>
            </View>
          </View>
        </Container>
        <Header>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push(routes.public.resetPassword)}
          >
            <ThemedText style={styles.secondaryButtonText}>
              修改密碼
            </ThemedText>
          </Pressable>
        </Header>
      </ThemedView>
    </>
  );
};

export default SecurityModal;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  noticeCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  noticeTitle: {
    color: "#92400E",
    fontWeight: "700",
  },
  noticeText: {
    color: "#B45309",
    lineHeight: 22,
  },
  noticeButton: {
    alignSelf: "flex-start",
    backgroundColor: "#F59E0B",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 4,
  },
  noticeButtonText: {
    color: "white",
    fontWeight: "700",
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
  verifiedText: {
    color: "#15803D",
  },
  unverifiedText: {
    color: "#D97706",
  },
  secondaryButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
  },
  secondaryButtonText: {
    color: "#2563EB",
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
});
