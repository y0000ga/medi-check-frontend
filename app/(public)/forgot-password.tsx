import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import { forgotPasswordStyles } from "@/components/auth/styles/forgot-password.style";
import FieldInput from "@/components/ui/field-input";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { routes } from "@/constants/route";
import { useForgotPasswordMutation } from "@/store/user";

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [requestPasswordReset, { isLoading: authLoading }] =
    useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setError("");
    try {
      await requestPasswordReset({ email }).unwrap();
      router.push(routes.public.resetPasswordWithEmail(email));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    }
  };

  return (
    <>
      <FullScreenLoading visible={authLoading} />
      <ThemedView style={forgotPasswordStyles.screen}>
        <View style={forgotPasswordStyles.content}>
          <View style={forgotPasswordStyles.card}>
            <View style={forgotPasswordStyles.cardHeader}>
              <ThemedText type="subtitle" style={forgotPasswordStyles.cardTitle}>
                Forgot password
              </ThemedText>
              <ThemedText style={forgotPasswordStyles.cardDescription}>
                Enter your email and we will send a password reset link.
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

            {error ? (
              <ThemedText style={forgotPasswordStyles.errorText}>
                {error}
              </ThemedText>
            ) : null}

            <Pressable
              style={[
                forgotPasswordStyles.primaryButton,
                authLoading && forgotPasswordStyles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={authLoading}
            >
              <ThemedText style={forgotPasswordStyles.primaryButtonText}>
                Send reset link
              </ThemedText>
            </Pressable>

            <Pressable
              style={forgotPasswordStyles.bottomAction}
              onPress={() => router.push(routes.public.signIn)}
            >
              <ThemedText style={forgotPasswordStyles.bottomActionText}>
                Back to sign in
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ThemedView>
    </>
  );
};

export default ForgotPasswordScreen;
