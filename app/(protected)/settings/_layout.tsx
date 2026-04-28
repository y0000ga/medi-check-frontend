import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function SettingsLayout() {
  const theme = useAppTheme();
  return (
    <Stack>
      <Stack.Screen
        name="main"
        options={{
          title: "個人設定",
          headerLeft: () => (
            <Pressable
              onPress={() => router.push("/(protected)/(tabs)/main")}
              hitSlop={12}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color={theme.colors.text}
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="profile/edit"
        options={{
          title: "編輯個人資料",
          headerLeft: () => (
            <Pressable
              onPress={() => router.push("/(protected)/(tabs)/main")}
              hitSlop={12}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color={theme.colors.text}
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="care-relationships/list"
        options={{
          title: "管理照護關係",
          headerLeft: () => (
            <Pressable
              onPress={() => router.push("/(protected)/settings/main")}
              hitSlop={12}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color={theme.colors.text}
              />
            </Pressable>
          ),
        }}
      />

      <Stack.Screen
        name="care-invitations/list"
        options={{
          title: "照護邀請",
          headerLeft: () => (
            <Pressable
              onPress={() => router.push("/(protected)/settings/main")}
              hitSlop={12}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color={theme.colors.text}
              />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() =>
                router.push("/(protected)/settings/care-invitations/new")
              }
              hitSlop={12}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Ionicons
                name="add-outline"
                size={26}
                color={theme.colors.primary}
              />
            </Pressable>
          ),
        }}
      />

      <Stack.Screen
        name="care-invitations/new"
        options={{ title: "新增照護邀請" }}
      />
    </Stack>
  );
}
