import { AppFilterPanel } from "@/components/ui/AppFilterPanel";
import { AppPagination } from "@/components/ui/AppPagination";
import { AppStateView } from "@/components/ui/AppStateView";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { useGetSchedulesQuery } from "@/features/schedule/scheduleApi";
import { ScheduleSortBy } from "@/features/schedule/types";
import { SortOrder } from "@/shared/api/types";
import { useAppTheme } from "@/shared/theme/theme";

import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

import { createStyles } from "@/styles/schedule";
import ScheduleCard from "@/components/schedule/ScheduleCard";
import { PatientPickerBottomSheet } from "@/components/form/PatientPickerBottomSheet";

type SelectedPatient = {
  id: string;
  name: string;
};

export default function SchedulesScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  /**
   * Schedule list state
   */
  const [page, setPage] = useState(1);
  const [selectedPatient, setSelectedPatient] =
    useState<SelectedPatient | null>(null);
  const [isPatientPickerVisible, setIsPatientPickerVisible] = useState(false);

  const scheduleQueryParams = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: ScheduleSortBy.createdAt,
      sortOrder: SortOrder.desc,
      patientIds: selectedPatient ? [selectedPatient.id] : undefined,
    }),
    [page, selectedPatient],
  );

  const {
    data: schedulesData,
    isLoading: isSchedulesLoading,
    isFetching: isSchedulesFetching,
    isError: isSchedulesError,
    refetch: refetchSchedules,
  } = useGetSchedulesQuery(scheduleQueryParams);

  const schedules = schedulesData?.list ?? [];
  const totalSize = schedulesData?.totalSize ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalSize / DEFAULT_PAGE_SIZE));

  const handleSelectPatient = (patient: SelectedPatient) => {
    setSelectedPatient(patient);
    setPage(1);
  };

  const handleClearPatientFilter = () => {
    setSelectedPatient(null);
    setPage(1);
  };

  return (
    <>
      <View style={styles.screen}>
        <AppFilterPanel
          filters={[{ label: "照護對象", value: selectedPatient?.name }]}
        >
          <View style={styles.compactPatientFilterBox}>
            <View style={styles.compactPatientFilterTextGroup}>
              <Text style={styles.compactFilterLabel}>照護對象</Text>
              <Text style={styles.compactFilterValue} numberOfLines={1}>
                {selectedPatient ? selectedPatient.name : "全部照護對象"}
              </Text>
            </View>

            <View style={styles.compactFilterActions}>
              {selectedPatient && (
                <Pressable
                  onPress={handleClearPatientFilter}
                  style={({ pressed }) => [
                    styles.smallTextButton,
                    pressed && styles.smallButtonPressed,
                  ]}
                >
                  <Text style={styles.smallTextButtonText}>清除</Text>
                </Pressable>
              )}

              <Pressable
                onPress={() => setIsPatientPickerVisible(true)}
                style={({ pressed }) => [
                  styles.smallPrimaryButton,
                  pressed && styles.smallButtonPressed,
                ]}
              >
                <Text style={styles.smallPrimaryButtonText}>選擇</Text>
              </Pressable>
            </View>
          </View>
        </AppFilterPanel>

        {isSchedulesLoading ? (
          <AppStateView loading description="載入排程列表中..." />
        ) : isSchedulesError ? (
          <AppStateView
            title="排程列表載入失敗"
            description="請稍後再試，或重新整理列表。"
            actionLabel="重新整理"
            onActionPress={refetchSchedules}
          />
        ) : schedules.length === 0 ? (
          <AppStateView
            iconName="calendar-outline"
            title="尚無排程"
            description={
              selectedPatient
                ? "此照護對象目前尚未建立排程。"
                : "目前尚未建立任何排程。"
            }
            actionLabel="新增排程"
            onActionPress={() => router.push("/(protected)/schedules/new")}
          />
        ) : (
          <>
            <FlatList
              data={schedules}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.scheduleListContent}
              refreshControl={
                <RefreshControl
                  refreshing={isSchedulesFetching && !isSchedulesLoading}
                  onRefresh={refetchSchedules}
                  tintColor={theme.colors.primary}
                />
              }
              renderItem={({ item }) => (
                <ScheduleCard
                  schedule={item}
                  onPress={() =>
                    router.push(`/(protected)/schedules/${item.id}/detail`)
                  }
                />
              )}
            />

            <AppPagination
              page={page}
              totalPages={totalPages}
              totalSize={totalSize}
              isLoading={isSchedulesFetching}
              onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
              onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            />
          </>
        )}
        <PatientPickerBottomSheet
          visible={isPatientPickerVisible}
          selectedPatient={selectedPatient}
          onClose={() => setIsPatientPickerVisible(false)}
          onSelectPatient={handleSelectPatient}
        />
      </View>
    </>
  );
}
