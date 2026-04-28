import {
  useGetCurrentUserQuery,
  useRefreshAuthMutation,
} from "@/features/user/userApi";
import {
  clearUser,
  setAuthenticated,
  setBootstrapped,
} from "@/features/user/userStore";
import { tokenStorage } from "@/shared/storage/tokenStorage";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

export default function ProtectedLayout() {
  const dispatch = useAppDispatch();
  const [refreshAuth] = useRefreshAuthMutation();
  const [isRecoveringSession, setIsRecoveringSession] = useState(false);

  const isBootstrapped = useAppSelector((state) => state.user.isBootstrapped);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const [hasCheckedToken, setHasCheckedToken] = useState(false);

  const {
    isLoading: isGetMeLoading,
    isFetching: isGetMeFetching,
    isError: isGetMeError,
    refetch: refetchCurrentUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !hasCheckedToken || !isAuthenticated,
  });

  useEffect(() => {
    const bootstrapAuth = async () => {
      const accessToken = await tokenStorage.getAccessToken();
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!accessToken) {
        if (!refreshToken) {
          await tokenStorage.clearTokens();
          dispatch(clearUser());
          dispatch(setBootstrapped(true));
          setHasCheckedToken(true);
          return;
        }

        try {
          const refreshed = await refreshAuth({ refreshToken }).unwrap();

          await tokenStorage.setAccessToken(refreshed.accessToken);
          await tokenStorage.setRefreshToken(refreshed.refreshToken);
        } catch {
          await tokenStorage.clearTokens();
          dispatch(clearUser());
          dispatch(setBootstrapped(true));
          setHasCheckedToken(true);
          return;
        }
      }

      dispatch(setAuthenticated(true));
      dispatch(setBootstrapped(true));
      setHasCheckedToken(true);
    };

    bootstrapAuth();
  }, [dispatch, refreshAuth]);

  useEffect(() => {
    if (!isGetMeError) return;

    const recoverSession = async () => {
      setIsRecoveringSession(true);

      const refreshToken = await tokenStorage.getRefreshToken();

      if (refreshToken) {
        try {
          const refreshed = await refreshAuth({ refreshToken }).unwrap();

          await tokenStorage.setAccessToken(refreshed.accessToken);
          await tokenStorage.setRefreshToken(refreshed.refreshToken);

          dispatch(setAuthenticated(true));
          await refetchCurrentUser();
          return;
        } catch {
          // fall through to local cleanup
        }
      }

      await tokenStorage.clearTokens();
      dispatch(clearUser());
      dispatch(setBootstrapped(true));
    };

    recoverSession().finally(() => setIsRecoveringSession(false));
  }, [dispatch, isGetMeError, refreshAuth, refetchCurrentUser]);

  const isCheckingAuth =
    !isBootstrapped ||
    !hasCheckedToken ||
    isGetMeLoading ||
    isGetMeFetching ||
    isRecoveringSession;

  if (isCheckingAuth) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isAuthenticated || (isGetMeError && !isRecoveringSession)) {
    return <Redirect href="/(public)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />

      <Stack.Screen name="medications/new" options={{ title: "新增藥品" }} />
      <Stack.Screen
        name="medications/[id]/detail"
        options={{ title: "檢視藥品" }}
      />
      <Stack.Screen
        name="medications/[id]/edit"
        options={{ title: "編輯藥品" }}
      />

      <Stack.Screen name="patients/new" options={{ title: "新增病人" }} />
      <Stack.Screen
        name="patients/[id]/detail"
        options={{
          title: "檢視被照護對象",
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace("/(protected)/(tabs)/patients")}
              hitSlop={12}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Ionicons name="chevron-back" size={24} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="patients/[id]/edit" options={{ title: "編輯病人" }} />

      <Stack.Screen name="schedules/new" options={{ title: "新增排程" }} />
      <Stack.Screen
        name="schedules/[id]/detail"
        options={{ title: "檢視排程" }}
      />
      <Stack.Screen
        name="schedules/[id]/edit"
        options={{ title: "編輯排程" }}
      />
      <Stack.Screen
        name="histories/[id]/detail"
        options={{ title: "檢視歷史紀錄" }}
      />

      <Stack.Screen
        name="histories/[id]/edit"
        options={{ title: "編輯歷史紀錄" }}
      />
    </Stack>
  );
}
