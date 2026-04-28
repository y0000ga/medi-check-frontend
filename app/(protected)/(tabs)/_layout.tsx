import { useAppTheme } from "@/shared/theme/theme";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RelativePathString, Tabs, router } from "expo-router";
import { useCallback, useMemo } from "react";
import { Pressable } from "react-native";

type IoniconName = keyof typeof Ionicons.glyphMap;

type TabBarIconProps = {
  color: string;
  size: number;
  focused: boolean;
};

const createTabBarIcon = (
  activeIcon: IoniconName,
  inactiveIcon: IoniconName,
) => {
  function TabBarIcon({ color, size, focused }: TabBarIconProps) {
    return (
      <Ionicons
        name={focused ? activeIcon : inactiveIcon}
        size={size}
        color={color}
      />
    );
  }

  TabBarIcon.displayName = `TabBarIcon(${activeIcon}/${inactiveIcon})`;

  return TabBarIcon;
};

export default function ProtectedTabsLayout() {
  const theme = useAppTheme();

  const screenOptions: BottomTabNavigationOptions = useMemo(
    () => ({
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerTintColor: theme.colors.text,
      headerTitleAlign: "center",

      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        height: 64,
        paddingTop: 6,
        paddingBottom: theme.spacing.sm,
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textMuted,
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: "500",
      },
      tabBarIconStyle: {
        marginBottom: theme.spacing.xxs,
      },
      tabBarHideOnKeyboard: true,
    }),
    [theme],
  );

  const createHeaderRight = useCallback(
    ({ href, icon }: { href: string; icon: IoniconName }) => (
      <Pressable
        onPress={() => router.push(href as RelativePathString)}
        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
        hitSlop={8}
      >
        <Ionicons name={icon} size={22} color={theme.colors.text} />
      </Pressable>
    ),
    [theme],
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="main"
        options={{
          title: "今日排程",
          tabBarLabel: "今日排程",
          tabBarIcon: createTabBarIcon("home", "home-outline"),
          headerRight: () =>
            createHeaderRight({
              href: "/(protected)/settings/main",
              icon: "settings-outline",
            }),
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: "藥品",
          tabBarLabel: "藥品",
          tabBarIcon: createTabBarIcon("medkit", "medkit-outline"),
          headerRight: () =>
            createHeaderRight({
              href: "/(protected)/medications/new",
              icon: "add-outline",
            }),
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          title: "關係",
          tabBarLabel: "關係",
          tabBarIcon: createTabBarIcon("people", "people-outline"),
          headerRight: () =>
            createHeaderRight({
              href: "/(protected)/patients/new",
              icon: "add-outline",
            }),
        }}
      />

      <Tabs.Screen
        name="schedules"
        options={{
          title: "排程",
          tabBarLabel: "排程",
          tabBarIcon: createTabBarIcon("calendar", "calendar-outline"),
          headerRight: () =>
            createHeaderRight({
              href: "/(protected)/schedules/new",
              icon: "add-outline",
            }),
        }}
      />

      <Tabs.Screen
        name="histories"
        options={{
          title: "紀錄",
          tabBarLabel: "紀錄",
          tabBarIcon: createTabBarIcon("time", "time-outline"),
        }}
      />
    </Tabs>
  );
}
