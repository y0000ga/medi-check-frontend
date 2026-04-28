import { AppButton } from "@/components/ui/AppButton";
import { useAppTheme } from "@/shared/theme/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type AppPaginationProps = {
  page: number;
  totalPages: number;
  totalSize: number;

  isLoading?: boolean;
  disabled?: boolean;

  onPrev: () => void;
  onNext: () => void;

  prevLabel?: string;
  nextLabel?: string;

  style?: ViewStyle;
};

export function AppPagination({
  page,
  totalPages,
  totalSize,

  isLoading = false,
  disabled = false,

  onPrev,
  onNext,

  prevLabel = "上一頁",
  nextLabel = "下一頁",

  style,
}: AppPaginationProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const normalizedTotalPages = Math.max(1, totalPages);
  const normalizedPage = Math.min(Math.max(1, page), normalizedTotalPages);

  const canGoPrev = normalizedPage > 1;
  const canGoNext = normalizedPage < normalizedTotalPages;

  const isPrevDisabled = disabled || isLoading || !canGoPrev;
  const isNextDisabled = disabled || isLoading || !canGoNext;

  return (
    <View style={[styles.container, style]}>
      <AppButton
        title={prevLabel}
        variant="secondary"
        disabled={isPrevDisabled}
        onPress={onPrev}
        style={styles.button}
      />

      <View style={styles.info}>
        <Text style={styles.pageText}>
          第 {normalizedPage} / {normalizedTotalPages} 頁
        </Text>
        <Text style={styles.totalText}>共 {totalSize} 筆</Text>
      </View>

      <AppButton
        title={nextLabel}
        variant="secondary"
        disabled={isNextDisabled}
        onPress={onNext}
        style={styles.button}
      />
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderMuted,
      backgroundColor: theme.colors.background,
    },

    button: {
      flex: 1,
    },

    info: {
      alignItems: "center",
      justifyContent: "center",
      minWidth: 88,
    },

    pageText: {
      ...theme.typography.captionStrong,
      color: theme.colors.text,
    },

    totalText: {
      ...theme.typography.error,
      color: theme.colors.textMuted,
    },
  });
