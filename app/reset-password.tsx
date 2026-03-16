import { Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import FieldInput from "@/components/ui/field-input";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useUserStore } from "@/stores/user";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === "string" ? params.email : "";
  const confirmPasswordReset = useUserStore((state) => state.confirmPasswordReset);
  const authLoading = useUserStore((state) => state.isLoading.length > 0);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      setError("請輸入新密碼並再次確認。");
      return;
    }

    setError("");
    try {
      await confirmPasswordReset({ password, confirmPassword });
      router.push("/sign-in");
    } catch (err) {
      setError(err instanceof Error ? err.message : "重設失敗，請稍後再試。");
    }
  };

  return (
    <>
      <FullScreenLoading visible={authLoading} />
      <ThemedView style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                重設密碼
              </ThemedText>
              <ThemedText style={styles.cardDescription}>
                {email ? `正在重設 ${email} 的密碼。` : "設定新的登入密碼。"}
              </ThemedText>
            </View>

            <FieldInput
              label="New Password"
              value={password}
              onChangeText={setPassword}
              placeholder="輸入新密碼"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FieldInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="再次輸入新密碼"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

            <Pressable style={[styles.primaryButton, authLoading && styles.buttonDisabled]} onPress={handleReset} disabled={authLoading}>
              <ThemedText style={styles.primaryButtonText}>完成重設</ThemedText>
            </Pressable>

            <Pressable style={styles.bottomAction} onPress={() => router.push("/sign-in")}>
              <ThemedText style={styles.bottomActionText}>返回登入</ThemedText>
            </Pressable>
          </View>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    justifyContent: "center",
    gap: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    gap: 6,
  },
  cardTitle: {
    color: "#0F172A",
  },
  cardDescription: {
    color: "#64748B",
    lineHeight: 22,
  },
  errorText: {
    color: "#DC2626",
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#3C83F6",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "700",
  },
  bottomAction: {
    alignSelf: "center",
    marginTop: 4,
  },
  bottomActionText: {
    color: "#3C83F6",
    fontWeight: "600",
  },
});
