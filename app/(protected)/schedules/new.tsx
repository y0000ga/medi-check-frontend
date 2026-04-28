import { AppButton } from "@/components/ui/AppButton";
import { AppStateView } from "@/components/ui/AppStateView";
import { ScheduleConfirmStep } from "@/components/schedule/ScheduleConfirmStep";
import { ScheduleRuleStep } from "@/components/schedule/ScheduleRuleStep";
import { SelectMedicationStep } from "@/components/schedule/create/SelectMedicationStep";
import { SelectPatientStep } from "@/components/schedule/create/SelectPatientStep";
import { createScheduleMachine } from "@/features/schedule/createScheduleMachine";
import { useCreateScheduleMutation } from "@/features/schedule/scheduleApi";
import { useAppTheme } from "@/shared/theme/theme";
import { useMachine } from "@xstate/react";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function NewScheduleScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [createSchedule] = useCreateScheduleMutation();

  const [state, send] = useMachine(createScheduleMachine, {
    input: {
      createSchedule: async (payload) => {
        return await createSchedule(payload).unwrap();
      },
    },
  });

  const {
    selectedPatient,
    selectedMedication,
    form,
    errors,
    createdScheduleId,
  } = state.context;

  if (state.matches("selectPatient")) {
    return (
      <ScreenWrapper styles={styles}>
        <SelectPatientStep
          selectedPatient={selectedPatient}
          onSelectPatient={(patient) =>
            send({
              type: "SELECT_PATIENT",
              patient,
            })
          }
        />
      </ScreenWrapper>
    );
  }

  if (state.matches("selectMedication")) {
    if (!selectedPatient) {
      return (
        <AppStateView
          title="尚未選擇照護對象"
          description="請返回上一步選擇照護對象。"
          actionLabel="回到選擇病人"
          onActionPress={() => send({ type: "BACK" })}
        />
      );
    }

    return (
      <ScreenWrapper styles={styles}>
        <SelectMedicationStep
          selectedPatient={selectedPatient}
          selectedMedication={selectedMedication}
          onBack={() => send({ type: "BACK" })}
          onSelectMedication={(medication) =>
            send({
              type: "SELECT_MEDICATION",
              medication,
            })
          }
        />
      </ScreenWrapper>
    );
  }

  if (state.matches("fillRule")) {
    return (
      <ScreenWrapper styles={styles}>
        <ScheduleRuleStep
          mode="create"
          form={form}
          errors={errors}
          onBack={() => send({ type: "BACK" })}
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
    if (!selectedPatient || !selectedMedication) {
      return (
        <AppStateView
          title="資料不完整"
          description="缺少照護對象或藥品資料，請重新選擇。"
          actionLabel="重新開始"
          onActionPress={() => send({ type: "RESET" })}
        />
      );
    }

    return (
      <ScreenWrapper styles={styles}>
        <ScheduleConfirmStep
          mode="create"
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
    return <AppStateView loading description="新增排程中..." />;
  }

  if (state.matches("failure")) {
    return (
      <AppStateView
        title="新增失敗"
        description={errors.form || "新增排程失敗，請稍後再試。"}
        actionLabel="返回時間規則"
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
        title="新增成功"
        description="排程已成功建立。"
        actionLabel="查看排程"
        onActionPress={() => {
          if (createdScheduleId) {
            router.replace(`/(protected)/schedules/${createdScheduleId}`);
            return;
          }

          router.replace("/(protected)/(tabs)/schedules");
        }}
      />
    );
  }

  return null;
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
