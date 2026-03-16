import { Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import FieldInput from "@/components/ui/field-input";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useUserStore } from "@/stores/user";

export default function SignUpScreen() {
  const router = useRouter();
  const register = useUserStore((state) => state.register);
  const authLoading = useUserStore((state) => state.isLoading.length > 0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("請完整填寫註冊資訊。");
      return;
    }

    if (password !== confirmPassword) {
      setError("兩次輸入的密碼不一致。");
      return;
    }

    setError("");
    try {
      await register({ name, email, password });
      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "註冊失敗，請稍後再試。");
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
                建立帳號
              </ThemedText>
            </View>

            <FieldInput
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="輸入名稱"
              autoCapitalize="words"
              autoCorrect={false}
            />

            <FieldInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FieldInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="設定密碼"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FieldInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="再次輸入密碼"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

            <Pressable style={[styles.primaryButton, authLoading && styles.buttonDisabled]} onPress={handleSignUp} disabled={authLoading}>
              <ThemedText style={styles.primaryButtonText}>註冊</ThemedText>
            </Pressable>

            <Pressable style={styles.bottomAction} onPress={() => router.push("/sign-in")}>
              <ThemedText style={styles.bottomActionText}>已經有帳號？返回登入</ThemedText>
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
    gap: 4,
  },
  cardTitle: {
    color: "#0F172A",
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
