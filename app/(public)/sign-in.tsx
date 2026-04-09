import { Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import Header from "@/components/ui/header";
import FieldInput from "@/components/ui/field-input";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { routes } from "@/constants/route";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ApiRequestError } from "@/libs/api/client";
import { useUserStore } from "@/stores/user";

const SignInScreen = () => {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const authLoading = useUserStore(
    (state) => state.isLoading.length > 0,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("請輸入 Email 和密碼。");
      return;
    }

    setError("");
    try {
      await login({ email, password });
      router.replace(routes.protected.home);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        console.log("sign-in error:", err.raw);
        setError(err.message);
        return;
      }
      setError(
        err instanceof Error ? err.message : "登入失敗，請稍後再試。",
      );
    }
  };

  return (
    <>
      <FullScreenLoading visible={authLoading} />
      <ThemedView style={styles.screen}>
        <Header>
          <View style={styles.brandRow}>
            <View style={styles.brandIconWrap}>
              <IconSymbol
                name="local-hospital"
                size={26}
                color="#3C83F6"
              />
            </View>
            <View style={styles.brandTextWrap}>
              <ThemedText
                type="title"
                style={styles.title}
              >
                MediCheck
              </ThemedText>
            </View>
          </View>
        </Header>

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedText
                type="subtitle"
                style={styles.cardTitle}
              >
                帳號登入
              </ThemedText>
            </View>

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
              placeholder="輸入密碼"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {error ? (
              <ThemedText style={styles.errorText}>
                {error}
              </ThemedText>
            ) : null}

            <Pressable
              style={styles.inlineAction}
              onPress={() => router.push(routes.public.forgotPassword)}
            >
              <ThemedText style={styles.inlineActionText}>
                忘記密碼
              </ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.primaryButton,
                authLoading && styles.buttonDisabled,
              ]}
              onPress={handleSignIn}
              disabled={authLoading}
            >
              <ThemedText style={styles.primaryButtonText}>
                登入
              </ThemedText>
            </Pressable>

            <Pressable
              style={styles.bottomAction}
              onPress={() => router.push(routes.public.signUp)}
            >
              <ThemedText style={styles.bottomActionText}>
                沒有帳號？前往註冊
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ThemedView>
    </>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  brandRow: {
    width: "100%",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  brandIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTextWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: "#0F172A",
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
  inlineAction: {
    alignSelf: "flex-end",
    marginTop: -4,
  },
  inlineActionText: {
    color: "#3C83F6",
    fontWeight: "600",
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
