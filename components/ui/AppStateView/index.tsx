import { AppButton } from "@/components/ui/AppButton";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, ReactNode, useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type AppStateViewProps = {
  title?: string;
  description?: string;
  iconName?: IoniconName;
  loading?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
  children?: ReactNode;
};

export function AppStateView({
  title,
  description,
  iconName,
  loading = false,
  actionLabel,
  onActionPress,
  style,
  children,
}: AppStateViewProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]}>
      {loading ? (
        <ActivityIndicator />
      ) : iconName ? (
        <Ionicons name={iconName} size={40} color={theme.colors.textMuted} />
      ) : null}

      {title && <Text style={styles.title}>{title}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}

      {children}

      {actionLabel && onActionPress && (
        <AppButton title={actionLabel} onPress={onActionPress} />
      )}
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
    },

    title: {
      ...theme.typography.h2,
      color: theme.colors.text,
      textAlign: "center",
    },

    description: {
      ...theme.typography.body,
      color: theme.colors.textMuted,
      textAlign: "center",
    },
  });
