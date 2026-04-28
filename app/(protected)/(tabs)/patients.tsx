import { AppPagination } from "@/components/ui/AppPagination";
import { AppStateView } from "@/components/ui/AppStateView";
import { AppFilterPanel } from "@/components/ui/AppFilterPanel";
import { AppTextField } from "@/components/form/AppTextField";
import { AppSelectField } from "@/components/form/AppSelectField";
import OverviewCard from "@/components/patients/OverviewCard";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { useGetPatientsQuery } from "@/features/patient/patientApi";
import { PatientsSortBy } from "@/features/patient/types";
import { SortOrder } from "@/shared/api/types";
import { useAppTheme } from "@/shared/theme/theme";
import { createStyles } from "@/styles/patients";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import {
  getSortLabel,
  getSortOrderLabel,
  patientSortOptions,
} from "@/features/patient/patientOptions";

export default function PatientsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<PatientsSortBy>(
    PatientsSortBy.createdAt,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.desc);

  const queryParams = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy,
      sortOrder,
      search: search.trim() || undefined,
    }),
    [page, search, sortBy, sortOrder],
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetPatientsQuery(queryParams);

  const patients = data?.list ?? [];
  const totalSize = data?.totalSize ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalSize / DEFAULT_PAGE_SIZE));

  const handleSearchChange = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  const handleChangeSortBy = (nextSortBy: PatientsSortBy | null) => {
    if (!nextSortBy) return;

    setSortBy(nextSortBy);
    setPage(1);
  };

  const handleToggleSortOrder = () => {
    setSortOrder((prev) =>
      prev === SortOrder.asc ? SortOrder.desc : SortOrder.asc,
    );
    setPage(1);
  };

  return (
    <View style={styles.screen}>
      <AppFilterPanel
        filters={[
          { label: "搜尋", value: search.trim() },
          {
            label: "排序",
            value: `${getSortLabel(sortBy)}・${sortOrder === SortOrder.asc ? "升冪" : "降冪"}`,
          },
        ]}
      >
        <AppTextField
          label="搜尋"
          value={search}
          onChangeText={handleSearchChange}
          placeholder="搜尋照護對象名稱"
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

        <View style={styles.sortControls}>
          <View style={styles.sortByField}>
            <AppSelectField
              label="排序欄位"
              value={sortBy}
              onChange={handleChangeSortBy}
              placeholder="請選擇排序欄位"
              modalTitle="選擇排序欄位"
              options={patientSortOptions}
            />
          </View>

          <Pressable
            onPress={handleToggleSortOrder}
            style={({ pressed }) => [
              styles.sortOrderButton,
              pressed && styles.sortOrderButtonPressed,
            ]}
          >
            <Ionicons
              name={
                sortOrder === SortOrder.asc
                  ? "arrow-up-outline"
                  : "arrow-down-outline"
              }
              size={18}
              color={theme.colors.primary}
            />

            <Text style={styles.sortOrderText}>
              {getSortOrderLabel(sortOrder)}
            </Text>
          </Pressable>
        </View>
      </AppFilterPanel>
      {isLoading ? (
        <AppStateView loading description="載入照護對象中..." />
      ) : isError ? (
        <AppStateView
          title="資料載入失敗"
          description="請稍後再試，或重新整理列表。"
          actionLabel="重新整理"
          onActionPress={refetch}
        />
      ) : patients.length === 0 ? (
        <AppStateView
          iconName="people-outline"
          title="尚無照護對象"
          description="你可以新增無帳號照護對象，或建立有帳號照護關係。"
        />
      ) : (
        <>
          <FlatList
            data={patients}
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
              <OverviewCard
                patient={item}
                onPress={() =>
                  router.push(`/(protected)/patients/${item.id}/detail`)
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
  );
}
