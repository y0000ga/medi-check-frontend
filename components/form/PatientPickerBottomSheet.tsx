import { AppPagination } from "@/components/ui/AppPagination";
import { AppStateView } from "@/components/ui/AppStateView";
import { AppTextField } from "@/components/form/AppTextField";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { useGetPatientsQuery } from "@/features/patient/patientApi";
import { PatientsSortBy } from "@/features/patient/types";
import { SortOrder } from "@/shared/api/types";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type PatientPickerValue = {
  id: string;
  name: string;
};

type PatientPickerBottomSheetProps = {
  visible: boolean;
  selectedPatient: PatientPickerValue | null;
  onClose: () => void;
  onSelectPatient: (patient: PatientPickerValue) => void;
};

export function PatientPickerBottomSheet({
  visible,
  selectedPatient,
  onClose,
  onSelectPatient,
}: PatientPickerBottomSheetProps) {
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

  const { data, isLoading, isFetching, isError, refetch } = useGetPatientsQuery(
    queryParams,
    {
      skip: !visible,
    },
  );

  const patients = data?.list ?? [];
  const totalSize = data?.totalSize ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalSize / DEFAULT_PAGE_SIZE));

  const handleSearchChange = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  const handleSelectPatient = (patient: PatientPickerValue) => {
    onSelectPatient(patient);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerTextGroup}>
              <Text style={styles.title}>選擇照護對象</Text>
              <Text style={styles.description}>
                選擇後會套用到目前的篩選條件。
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
            >
              <Ionicons
                name="close-outline"
                size={24}
                color={theme.colors.text}
              />
            </Pressable>
          </View>

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
              title="照護對象載入失敗"
              description="請稍後再試，或重新整理。"
              actionLabel="重新整理"
              onActionPress={refetch}
            />
          ) : patients.length === 0 ? (
            <AppStateView
              iconName="people-outline"
              title="尚無照護對象"
              description="目前沒有可選擇的照護對象。"
            />
          ) : (
            <>
              <FlatList
                data={patients}
                keyExtractor={(item) => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                refreshControl={
                  <RefreshControl
                    refreshing={isFetching && !isLoading}
                    onRefresh={refetch}
                    tintColor={theme.colors.primary}
                  />
                }
                renderItem={({ item }) => {
                  const isSelected = selectedPatient?.id === item.id;

                  return (
                    <Pressable
                      onPress={() =>
                        handleSelectPatient({
                          id: item.id,
                          name: item.name,
                        })
                      }
                      style={({ pressed }) => [
                        styles.patientItem,
                        isSelected && styles.patientItemSelected,
                        pressed && styles.patientItemPressed,
                      ]}
                    >
                      <View style={styles.patientIconBox}>
                        <Ionicons
                          name="person-outline"
                          size={18}
                          color={theme.colors.primary}
                        />
                      </View>

                      <View style={styles.patientTextGroup}>
                        <Text style={styles.patientName} numberOfLines={1}>
                          {item.name}
                        </Text>

                        {item.linkedUserName && (
                          <Text style={styles.patientMeta} numberOfLines={1}>
                            關聯帳號：{item.linkedUserName}
                          </Text>
                        )}
                      </View>

                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={20}
                          color={theme.colors.primary}
                        />
                      )}
                    </Pressable>
                  );
                }}
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
      </View>
    </Modal>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
    },

    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.35)",
    },

    sheet: {
      maxHeight: "82%",
      minHeight: "56%",
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.xl,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      backgroundColor: theme.colors.background,
      gap: theme.spacing.md,
    },

    handle: {
      alignSelf: "center",
      width: 40,
      height: 4,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.borderMuted,
      marginBottom: theme.spacing.xs,
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },

    headerTextGroup: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    title: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },

    description: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    closeButton: {
      width: 36,
      height: 36,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
    },

    closeButtonPressed: {
      opacity: 0.85,
    },

    list: {
      flex: 1,
    },

    listContent: {
      gap: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
    },

    patientItem: {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      backgroundColor: theme.colors.surface,
    },

    patientItemSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primarySoft,
    },

    patientItemPressed: {
      opacity: 0.85,
    },

    patientIconBox: {
      width: 36,
      height: 36,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
    },

    patientTextGroup: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    patientName: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    patientMeta: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },
  });
