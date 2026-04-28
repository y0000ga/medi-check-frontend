import { AppPagination } from "@/components/ui/AppPagination";
import { AppStateView } from "@/components/ui/AppStateView";
import { AppTextField } from "@/components/form/AppTextField";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { useGetPatientMedicationsQuery } from "@/features/medication/medicationApi";
import {
  MedicationOverview,
  MedicationsSortBy,
} from "@/features/medication/types";
import {
  SelectedScheduleMedication,
  SelectedSchedulePatient,
} from "@/features/schedule/createScheduleMachine";
import { SortOrder } from "@/shared/api/types";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppButton } from "@/components/ui/AppButton";
import { dosageFormLabelMap } from "@/features/medication/dosageFormOptions";

type SelectMedicationStepProps = {
  selectedPatient: SelectedSchedulePatient;
  selectedMedication: SelectedScheduleMedication | null;
  onBack: () => void;
  onSelectMedication: (medication: SelectedScheduleMedication) => void;
};

export function SelectMedicationStep({
  selectedPatient,
  selectedMedication,
  onBack,
  onSelectMedication,
}: SelectMedicationStepProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const queryParams = useMemo(
    () => ({
      patientId: selectedPatient.id,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: MedicationsSortBy.createdAt,
      sortOrder: SortOrder.desc,
      search: search.trim() || undefined,
    }),
    [selectedPatient.id, page, search],
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetPatientMedicationsQuery(queryParams);

  const medications = data?.list ?? [];
  const totalSize = data?.totalSize ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalSize / DEFAULT_PAGE_SIZE));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>選擇藥品</Text>
        <Text style={styles.description}>照護對象：{selectedPatient.name}</Text>
      </View>

      {selectedMedication && (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedLabel}>目前選擇</Text>
          <Text style={styles.selectedName}>{selectedMedication.name}</Text>
        </View>
      )}

      <AppTextField
        label="搜尋"
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

      {isLoading ? (
        <AppStateView loading description="載入藥品中..." />
      ) : isError ? (
        <AppStateView
          title="藥品載入失敗"
          description="請稍後再試，或重新整理列表。"
          actionLabel="重新整理"
          onActionPress={refetch}
        />
      ) : medications.length === 0 ? (
        <AppStateView
          iconName="medkit-outline"
          title="尚無藥品"
          description="此照護對象目前尚未建立藥品。"
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
                  onSelectMedication({
                    id: item.id,
                    name: item.name,
                    dosageForm: item.dosageForm,
                    patientId: item.patientId,
                    patientName: item.patientName,
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

      <AppButton title="上一步" variant="secondary" onPress={onBack} />
    </View>
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
