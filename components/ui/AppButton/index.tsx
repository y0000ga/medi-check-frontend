import { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, ViewStyle } from "react-native";
import { AppTheme, useAppTheme } from "@/shared/theme/theme";
import { createStyles } from "./styles";

type AppButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: ViewStyle;
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
}: AppButtonProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor(theme, variant)} />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
}

const getTextColor = (theme: AppTheme, variant: AppButtonVariant) => {
  if (variant === "secondary" || variant === "ghost")
    return theme.colors.primary;
  return "#FFFFFF";
};
