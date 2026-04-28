import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import {
  funcStyles,
  signInStyles,
} from "@/components/auth/styles/sign-in.style";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import FieldInput from "@/components/ui/field-input";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import Header from "@/components/ui/header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { routes } from "@/constants/route";
import { ApiRequestError } from "@/store/api/client";
import { useAuthFlows } from "@/store/user";
import { useFieldValidation } from "@/hooks/use-field-validation";

const SignInScreen = () => {
  const router = useRouter();
  const { signIn: signInFlow, isSigningIn: authLoading } =
    useAuthFlows();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailValidation = useFieldValidation("email", email);
  const passwordValidation = useFieldValidation("password", password);
  // 可能包含前端驗證與後端驗證的 Error
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setSubmitted(true);

    if (!emailValidation.valid || !passwordValidation.valid) {
      return;
    }

    setError("");

    try {
      await signInFlow({
        email: email.trim(),
        password,
      });
      router.replace(routes.protected.home);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
        return;
      }

      setError(
        err instanceof Error ? err.message : "Sign-in failed.",
      );
    }
  };

  return (
    <>
      <FullScreenLoading visible={authLoading} />
      <ThemedView style={signInStyles.screen}>
        <Header>
          <View style={signInStyles.brandRow}>
            <View style={signInStyles.brandIconWrap}>
              <IconSymbol
                name="local-hospital"
                size={26}
                color="#3C83F6"
              />
            </View>
            <View style={signInStyles.brandTextWrap}>
              <ThemedText
                type="title"
                style={signInStyles.title}
              >
                MediCheck
              </ThemedText>
            </View>
          </View>
        </Header>

        <View style={signInStyles.content}>
          <View style={signInStyles.card}>
            <FieldInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              message={
                submitted && emailValidation.errorKeys.length > 0
                  ? emailValidation.message
                  : undefined
              }
            />

            <FieldInput
              label="密碼"
              value={password}
              onChangeText={setPassword}
              placeholder="test123456"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              message={
                submitted && passwordValidation.errorKeys.length > 0
                  ? passwordValidation.message
                  : undefined
              }
            />

            {error ? (
              <ThemedText style={signInStyles.errorText}>
                {error}
              </ThemedText>
            ) : null}
            {/* TODO: 待開發忘記密碼功能 */}
            <Pressable
              style={[signInStyles.inlineAction, funcStyles.disabled]}
              onPress={() =>
                router.push(routes.public.forgotPassword)
              }
            >
              <ThemedText style={signInStyles.inlineActionText}>
                忘記密碼
              </ThemedText>
            </Pressable>

            <Pressable
              style={[
                signInStyles.primaryButton,
                authLoading && signInStyles.buttonDisabled,
              ]}
              onPress={handleSignIn}
              disabled={authLoading}
            >
              <ThemedText style={signInStyles.primaryButtonText}>
                登入
              </ThemedText>
            </Pressable>

            <Pressable
              style={signInStyles.bottomAction}
              onPress={() => router.push(routes.public.signUp)}
            >
              <ThemedText style={signInStyles.bottomActionText}>
                還沒有帳號？前往註冊
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ThemedView>
    </>
  );
};

export default SignInScreen;
