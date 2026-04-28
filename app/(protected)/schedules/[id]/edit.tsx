import { AppButton } from "@/components/ui/AppButton";
import { AppStateView } from "@/components/ui/AppStateView";
import { ScheduleConfirmStep } from "@/components/schedule/ScheduleConfirmStep";
import { ScheduleRuleStep } from "@/components/schedule/ScheduleRuleStep";
import { editScheduleMachine } from "@/features/schedule/editScheduleMachine";
import {
  useEditScheduleMutation,
  useGetScheduleDetailQuery,
} from "@/features/schedule/scheduleApi";
import {
  EditScheduleRequest,
  EditScheduleResponse,
  Schedule,
  ScheduleFormRequest,
} from "@/features/schedule/types";
import { useAppTheme } from "@/shared/theme/theme";
import { useMachine } from "@xstate/react";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

const mapScheduleToForm = (schedule: Schedule): ScheduleFormRequest => {
  return {
    timezone: schedule.timezone,
    startDate: schedule.startDate,
    timeSlots: schedule.timeSlots,

    amount: schedule.amount,
    doseUnit: schedule.doseUnit,

    endType: schedule.endType,

    frequencyUnit: schedule.frequencyUnit,
    interval: schedule.interval,
    weekdays: schedule.weekdays,

    untilDate: schedule.untilDate,
    occurrenceCount: schedule.occurrenceCount,
  };
};

type EditScheduleMachineContentProps = {
  schedule: Schedule;
  editSchedule: (payload: EditScheduleRequest) => Promise<EditScheduleResponse>;
};

function EditScheduleMachineContent({
  schedule,
  editSchedule,
}: EditScheduleMachineContentProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [state, send] = useMachine(editScheduleMachine, {
    input: {
      scheduleId: schedule.id,

      selectedPatient: {
        id: schedule.patientId,
        name: schedule.patientName,
      },

      selectedMedication: {
        id: schedule.medicationId,
        name: schedule.medicationName,
        dosageForm: schedule.medicationDosageForm,
        patientId: schedule.patientId,
        patientName: schedule.patientName,
      },

      initialForm: mapScheduleToForm(schedule),

      editSchedule,
    },
  });

  const {
    selectedPatient,
    selectedMedication,
    form,
    errors,
    updatedScheduleId,
  } = state.context;

  if (state.matches("fillRule")) {
    return (
      <ScreenWrapper styles={styles}>
        <ScheduleRuleStep
          mode="edit"
          form={form}
          errors={errors}
          onBack={() => router.back()}
          onNext={() => send({ type: "NEXT" })}
          onUpdateForm={(field, value) =>
            send({
              type: "UPDATE_FORM",
              field,
              value,
            })
          }
        />
      </ScreenWrapper>
    );
  }

  if (state.matches("confirm")) {
    return (
      <ScreenWrapper styles={styles}>
        <ScheduleConfirmStep
          mode="edit"
          selectedPatient={selectedPatient}
          selectedMedication={selectedMedication}
          form={form}
          error={errors.form}
          onBack={() => send({ type: "BACK" })}
          onSubmit={() => send({ type: "SUBMIT" })}
        />
      </ScreenWrapper>
    );
  }

  if (state.matches("submitting")) {
    return <AppStateView loading description="更新排程中..." />;
  }

  if (state.matches("failure")) {
    return (
      <AppStateView
        title="更新失敗"
        description={errors.form || "更新排程失敗，請稍後再試。"}
        actionLabel="返回表單"
        onActionPress={() => send({ type: "BACK" })}
      >
        <AppButton title="重新送出" onPress={() => send({ type: "RETRY" })} />
      </AppStateView>
    );
  }

  if (state.matches("success")) {
    return (
      <AppStateView
        iconName="checkmark-circle-outline"
        title="更新成功"
        description="排程資料已成功更新。"
        actionLabel="返回排程詳情"
        onActionPress={() => {
          router.replace(
            `/(protected)/schedules/${updatedScheduleId ?? schedule.id}`,
          );
        }}
      />
    );
  }

  return null;
}

export default function EditScheduleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: schedule,
    isLoading,
    isError,
    refetch,
  } = useGetScheduleDetailQuery(
    {
      scheduleId: id,
    },
    {
      skip: !id,
    },
  );

  const [editSchedule] = useEditScheduleMutation();

  if (!id) {
    return (
      <AppStateView
        title="缺少排程 ID"
        description="無法取得要編輯的排程資料。"
        actionLabel="返回"
        onActionPress={() => router.back()}
      />
    );
  }

  if (isLoading) {
    return <AppStateView loading description="載入排程資料中..." />;
  }

  if (isError) {
    return (
      <AppStateView
        title="排程資料載入失敗"
        description="請稍後再試，或重新整理資料。"
        actionLabel="重新整理"
        onActionPress={refetch}
      />
    );
  }

  if (!schedule) {
    return (
      <AppStateView
        iconName="calendar-outline"
        title="找不到排程"
        description="此排程可能已被刪除，或你沒有編輯權限。"
        actionLabel="返回"
        onActionPress={() => router.back()}
      />
    );
  }

  return (
    <EditScheduleMachineContent
      schedule={schedule}
      editSchedule={async (payload) => {
        return await editSchedule(payload).unwrap();
      }}
    />
  );
}

type ScreenWrapperProps = {
  styles: ReturnType<typeof createStyles>;
  children: React.ReactNode;
};

function ScreenWrapper({ styles, children }: ScreenWrapperProps) {
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    content: {
      flexGrow: 1,
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingVertical: theme.layout.screenPaddingVertical,
    },
  });
