import { AppPagination } from "@/components/ui/AppPagination";
import { AppStateView } from "@/components/ui/AppStateView";
import { AppTextField } from "@/components/form/AppTextField";
import OverviewCard from "@/components/patients/OverviewCard";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { useGetPatientsQuery } from "@/features/patient/patientApi";
import { PatientsSortBy } from "@/features/patient/types";
import { SortOrder } from "@/shared/api/types";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SelectedPatient } from "@/features/medication/createMedicationMachine";

type SelectPatientStepProps = {
  selectedPatient: SelectedPatient | null;
  onSelectPatient: (patient: SelectedPatient) => void;
};

export function SelectPatientStep({
  selectedPatient,
  onSelectPatient,
}: SelectPatientStepProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const queryParams = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: PatientsSortBy.createdAt,
      sortOrder: SortOrder.desc,
      search: search.trim() || undefined,
    }),
    [page, search],
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.description}>
          請先選擇此藥品要建立在哪一位照護對象底下。
        </Text>
      </View>

      {selectedPatient && (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedLabel}>目前選擇</Text>
          <Text style={styles.selectedName}>{selectedPatient.name}</Text>
        </View>
      )}

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
          description="請先新增照護對象，再建立藥品。"
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
                  onSelectPatient({
                    id: item.id,
                    name: item.name,
                  })
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

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: theme.spacing.lg,
    },

    header: {
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

    selectedBox: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primarySoft,
      gap: theme.spacing.xs,
    },

    selectedLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    selectedName: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    listContent: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
  });
