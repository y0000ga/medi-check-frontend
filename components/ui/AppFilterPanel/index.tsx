import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type AppFilterPanelProps = {
  title?: string;
  filters: { value?: string; label: string }[];
  defaultExpanded?: boolean;
  children: ReactNode;
};

export function AppFilterPanel({
  title = "篩選條件",
  filters,
  defaultExpanded = false,
  children,
}: AppFilterPanelProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const summary = useMemo(() => {
    const filtereds = [];

    for (const { value, label } of filters) {
      if (!value) {
        continue;
      }
      filtereds.push(`${label}：${value}`);
    }

    return filtereds.join("｜");
  }, [filters]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setIsExpanded((prev) => !prev)}
        style={({ pressed }) => [
          styles.header,
          pressed && styles.headerPressed,
        ]}
      >
        <View style={styles.headerTextGroup}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.summary} numberOfLines={1}>
            {summary}
          </Text>
        </View>

        <Ionicons
          name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
          color={theme.colors.textMuted}
        />
      </Pressable>

      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      overflow: "hidden",
      marginBottom: 14,
    },

    header: {
      minHeight: 56,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },

    headerPressed: {
      opacity: 0.85,
    },

    headerTextGroup: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    title: {
      ...theme.typography.captionStrong,
      color: theme.colors.text,
    },

    summary: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
      gap: theme.spacing.md,
    },
  });
