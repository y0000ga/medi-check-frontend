import { AppTextField } from "@/components/form/AppTextField";
import { AppSelectField } from "@/components/form/AppSelectField";
import { AppFilterPanel } from "@/components/ui/AppFilterPanel";
import { AppPagination } from "@/components/ui/AppPagination";
import { AppStateView } from "@/components/ui/AppStateView";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import {
  DOSAGE_FORM_OPTIONS,
  dosageFormLabelMap,
} from "@/features/medication/dosageFormOptions";
import { useGetAllMedicationsQuery } from "@/features/medication/medicationApi";
import {
  DosageForm,
  MedicationOverview,
  MedicationsSortBy,
} from "@/features/medication/types";
import { SortOrder } from "@/shared/api/types";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function MedicationsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dosageForm, setDosageForm] = useState<DosageForm | null>(null);

  const queryParams = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: MedicationsSortBy.createdAt,
      sortOrder: SortOrder.desc,
      dosageForm,
      search: search.trim() || undefined,
    }),
    [page, dosageForm, search],
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAllMedicationsQuery(queryParams);

  const medications = data?.list ?? [];
  const totalSize = data?.totalSize ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalSize / DEFAULT_PAGE_SIZE));

  return (
    <>
      <View style={styles.screen}>
        <AppFilterPanel
          filters={[
            { label: "搜尋", value: search.trim() },
            {
              label: "劑型",
              value: dosageForm ? dosageFormLabelMap[dosageForm] : "",
            },
          ]}
        >
          <AppTextField
            label="搜尋藥品"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setPage(1);
            }}
            placeholder="搜尋藥品名稱"
            prefixIcon={
              <Ionicons
                name="search-outline"
                size={20}
                color={theme.colors.textMuted}
              />
            }
            suffixIcon={
              search ? (
                <Ionicons
                  name="close-circle-outline"
                  size={20}
                  color={theme.colors.textMuted}
                />
              ) : undefined
            }
            onPressSuffixIcon={
              search
                ? () => {
                    setSearch("");
                    setPage(1);
                  }
                : undefined
            }
          />

          <AppSelectField<DosageForm>
            label="劑型"
            value={dosageForm}
            onChange={(value) => {
              setDosageForm(value);
              setPage(1);
            }}
            placeholder="全部劑型"
            modalTitle="選擇劑型"
            options={[
              { label: "全部劑型", value: null },
              ...DOSAGE_FORM_OPTIONS,
            ]}
            prefixIcon={
              <Ionicons
                name="filter-outline"
                size={20}
                color={theme.colors.textMuted}
              />
            }
          />
        </AppFilterPanel>

        {isLoading ? (
          <AppStateView loading description="載入藥品列表中..." />
        ) : isError ? (
          <AppStateView
            title="藥品列表載入失敗"
            description="請稍後再試，或重新整理列表。"
            actionLabel="重新整理"
            onActionPress={refetch}
          />
        ) : medications.length === 0 ? (
          <AppStateView
            iconName="medkit-outline"
            title="尚無藥品"
            description="目前尚未建立藥品，或沒有符合條件的結果。"
            actionLabel="新增藥品"
            onActionPress={() => router.push("/(protected)/medications/new")}
          />
        ) : (
          <>
            <FlatList
              data={medications}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={isFetching && !isLoading}
                  onRefresh={refetch}
                  tintColor={theme.colors.primary}
                />
              }
              renderItem={({ item }) => (
                <MedicationCard
                  medication={item}
                  onPress={() =>
                    router.push(`/(protected)/medications/${item.id}/detail`)
                  }
                />
              )}
            />

            <AppPagination
              page={page}
              totalPages={totalPages}
              totalSize={totalSize}
              isLoading={isFetching}
              onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
              onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            />
          </>
        )}
      </View>
    </>
  );
}

type MedicationCardProps = {
  medication: MedicationOverview;
  onPress: () => void;
};

function MedicationCard({ medication, onPress }: MedicationCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.iconBox}>
        <Ionicons
          name="medkit-outline"
          size={22}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{medication.name}</Text>

        <Text style={styles.cardMeta}>
          劑型：{dosageFormLabelMap[medication.dosageForm]}
        </Text>

        <Text style={styles.cardMeta}>照護對象：{medication.patientName}</Text>
      </View>

      <Ionicons
        name="chevron-forward-outline"
        size={20}
        color={theme.colors.textMuted}
      />
    </Pressable>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingTop: theme.layout.screenPaddingVertical,
      gap: theme.spacing.lg,
    },

    header: {
      gap: theme.spacing.lg,
    },

    headerTextGroup: {
      gap: theme.spacing.xs,
    },

    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
    },

    description: {
      ...theme.typography.body,
      color: theme.colors.textMuted,
    },

    dosageGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },

    listContent: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },

    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      ...theme.shadows.card,
    },

    cardPressed: {
      opacity: 0.85,
    },

    iconBox: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
    },

    cardContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    cardTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    cardMeta: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },
  });
