import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const TabLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "首頁",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="home"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "歷史紀錄",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="history"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="medication"
        options={{
          title: "藥物列表",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="format-list-bulleted"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: "我",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="person"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
