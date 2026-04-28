import { useState } from "react";
import { Pressable, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { resetPasswordStyles } from "@/components/auth/styles/reset-password.style";
import FieldInput from "@/components/ui/field-input";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { routes } from "@/constants/route";
import { useResetPasswordMutation } from "@/store/user";

const ResetPasswordScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === "string" ? params.email : "";
  const [confirmPasswordReset, { isLoading: authLoading }] =
    useResetPasswordMutation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      setError("Please enter and confirm your new password.");
      return;
    }

    setError("");
    try {
      await confirmPasswordReset({ password, confirmPassword }).unwrap();
      router.push(routes.public.signIn);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed.");
    }
  };

  return (
    <>
      <FullScreenLoading visible={authLoading} />
      <ThemedView style={resetPasswordStyles.screen}>
        <View style={resetPasswordStyles.content}>
          <View style={resetPasswordStyles.card}>
            <View style={resetPasswordStyles.cardHeader}>
              <ThemedText type="subtitle" style={resetPasswordStyles.cardTitle}>
                Reset password
              </ThemedText>
              <ThemedText style={resetPasswordStyles.cardDescription}>
                {email
                  ? `Resetting password for ${email}`
                  : "Enter a new password to continue."}
              </ThemedText>
            </View>

            <FieldInput
              label="New Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FieldInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {error ? (
              <ThemedText style={resetPasswordStyles.errorText}>
                {error}
              </ThemedText>
            ) : null}

            <Pressable
              style={[
                resetPasswordStyles.primaryButton,
                authLoading && resetPasswordStyles.buttonDisabled,
              ]}
              onPress={handleReset}
              disabled={authLoading}
            >
              <ThemedText style={resetPasswordStyles.primaryButtonText}>
                Reset password
              </ThemedText>
            </Pressable>

            <Pressable
              style={resetPasswordStyles.bottomAction}
              onPress={() => router.back()}
            >
              <ThemedText style={resetPasswordStyles.bottomActionText}>
                Back
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ThemedView>
    </>
  );
};

export default ResetPasswordScreen;
