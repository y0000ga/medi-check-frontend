import { AppDateField } from "@/components/form/AppDateField";
import { AppSelectField } from "@/components/form/AppSelectField";
import { AppFilterPanel } from "@/components/ui/AppFilterPanel";
import { AppPagination } from "@/components/ui/AppPagination";
import { AppStateView } from "@/components/ui/AppStateView";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { useGetHistoriesQuery } from "@/features/history/historyApi";
import { HistorySortBy } from "@/features/history/types";
import { IntakeHistoryStatus } from "@/features/schedule/types";
import { SortOrder } from "@/shared/api/types";
import { useAppTheme } from "@/shared/theme/theme";

import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { formatDateToYYYYMMDD, parseDate } from "@/utils/common";
import {
  INTAKE_HISTORY_STATUS_OPTIONS,
  intakeHistoryStatusLabelMap,
} from "@/features/history/constants";
import { PatientPickerBottomSheet } from "@/components/form/PatientPickerBottomSheet";
import { createStyles } from "@/styles/history";
import SummaryChip from "@/components/history/SummaryChip";
import HistoryCard from "@/components/history/HistoryCard";

type SelectedPatient = {
  id: string;
  name: string;
};

export default function HistoryScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedDate, setSelectedDate] = useState(
    formatDateToYYYYMMDD(new Date()),
  );
  const [page, setPage] = useState(1);
  const [selectedPatient, setSelectedPatient] =
    useState<SelectedPatient | null>(null);
  const [status, setStatus] = useState<IntakeHistoryStatus | null>(null);
  const [isPatientPickerVisible, setIsPatientPickerVisible] = useState(false);

  const historyQueryParams = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: HistorySortBy.intakeAt,
      sortOrder: SortOrder.desc,
      patientIds: selectedPatient ? [selectedPatient.id] : undefined,
      status,
      fromDate: selectedDate,
      toDate: selectedDate,
    }),
    [page, selectedPatient, status, selectedDate],
  );

  const {
    data: historiesData,
    isLoading: isHistoriesLoading,
    isFetching: isHistoriesFetching,
    isError: isHistoriesError,
    refetch: refetchHistories,
  } = useGetHistoriesQuery(historyQueryParams);

  const histories = historiesData?.list ?? [];
  const totalSize = historiesData?.totalSize ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalSize / DEFAULT_PAGE_SIZE));

  const handleChangeDate = (date: Date | null) => {
    setSelectedDate(formatDateToYYYYMMDD(date || new Date()));
    setPage(1);
  };

  const handleSelectPatient = (patient: SelectedPatient) => {
    setSelectedPatient(patient);
    setPage(1);
    setIsPatientPickerVisible(false);
  };

  const handleClearPatientFilter = () => {
    setSelectedPatient(null);
    setPage(1);
  };

  return (
    <View style={styles.screen}>
      <AppFilterPanel
        filters={[
          { label: "日期", value: selectedDate },
          { label: "照護對象", value: selectedPatient?.name },
          {
            label: "狀態",
            value: status ? intakeHistoryStatusLabelMap[status] : "",
          },
        ]}
      >
        <AppDateField
          label="日期"
          value={parseDate(selectedDate)}
          onChange={handleChangeDate}
          placeholder="請選擇日期"
          required
        />
        <AppSelectField
          label="狀態"
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          options={[
            { label: "全部狀態", value: null },
            ...INTAKE_HISTORY_STATUS_OPTIONS,
          ]}
          modalTitle="選擇紀錄狀態"
        />

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
      <View style={styles.compactSummaryRow}>
        <SummaryChip label="全部" value={totalSize} />
        <SummaryChip label="已服用" value={historiesData?.intakenSize ?? 0} />
        <SummaryChip label="已逾時" value={historiesData?.missedSize ?? 0} />
      </View>
      {isHistoriesLoading ? (
        <AppStateView loading description="載入服藥紀錄中..." />
      ) : isHistoriesError ? (
        <AppStateView
          title="服藥紀錄載入失敗"
          description="請稍後再試，或重新整理列表。"
          actionLabel="重新整理"
          onActionPress={refetchHistories}
        />
      ) : histories.length === 0 ? (
        <AppStateView
          iconName="document-text-outline"
          title="此日期沒有服藥紀錄"
          description="目前沒有符合條件的服藥紀錄。"
        />
      ) : (
        <>
          <FlatList
            data={histories}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.historyListContent}
            refreshControl={
              <RefreshControl
                refreshing={isHistoriesFetching && !isHistoriesLoading}
                onRefresh={refetchHistories}
                tintColor={theme.colors.primary}
              />
            }
            renderItem={({ item }) => (
              <HistoryCard
                history={item}
                onPress={() =>
                  router.push(`/(protected)/histories/${item.id}/detail`)
                }
              />
            )}
          />

          <AppPagination
            page={page}
            totalPages={totalPages}
            totalSize={totalSize}
            isLoading={isHistoriesFetching}
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
  );
}
