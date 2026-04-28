import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import { signUpStyles } from "@/components/auth/styles/sign-up.style";
import FieldInput from "@/components/ui/field-input";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { routes } from "@/constants/route";
import { ApiRequestError } from "@/store/api/client";
import { useAuthFlows } from "@/store/user";

const SignUpScreen = () => {
  const router = useRouter();
  const { signUp: signUpFlow, isSigningUp: authLoading } =
    useAuthFlows();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please complete all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    try {
      await signUpFlow({ name, email, password });
      router.replace(routes.protected.home);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
        return;
      }
      setError(err instanceof Error ? err.message : "Sign-up failed.");
    }
  };

  return (
    <>
      <FullScreenLoading visible={authLoading} />
      <ThemedView style={signUpStyles.screen}>
        <View style={signUpStyles.content}>
          <View style={signUpStyles.card}>
            <View style={signUpStyles.cardHeader}>
              <ThemedText type="subtitle" style={signUpStyles.cardTitle}>
                Create account
              </ThemedText>
            </View>

            <FieldInput
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
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
              placeholder="Enter password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <FieldInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {error ? (
              <ThemedText style={signUpStyles.errorText}>{error}</ThemedText>
            ) : null}

            <Pressable
              style={[
                signUpStyles.primaryButton,
                authLoading && signUpStyles.buttonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={authLoading}
            >
              <ThemedText style={signUpStyles.primaryButtonText}>
                Sign up
              </ThemedText>
            </Pressable>

            <Pressable
              style={signUpStyles.bottomAction}
              onPress={() => router.push(routes.public.signIn)}
            >
              <ThemedText style={signUpStyles.bottomActionText}>
                Already have an account? Sign in
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ThemedView>
    </>
  );
};

export default SignUpScreen;
