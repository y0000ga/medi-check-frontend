import { MedicationConfirmStep } from "@/components/medication/MedicationConfirmStep";
import { MedicationFormStep } from "@/components/medication/MedicationFormStep";
import { AppButton } from "@/components/ui/AppButton";
import { AppStateView } from "@/components/ui/AppStateView";
import { editMedicationMachine } from "@/features/medication/editMedicationMachine";
import {
  useEditMedicationMutation,
  useGetMedicationDetailQuery,
} from "@/features/medication/medicationApi";
import {
  EditMedicationRequest,
  EditMedicationResponse,
} from "@/features/medication/types";
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

type EditMedicationMachineContentProps = {
  medicationId: string;
  patientName: string;
  initialForm: {
    name: string;
    dosageForm: EditMedicationRequest["dosageForm"];
    note: string;
  };
  editMedication: (
    payload: EditMedicationRequest,
  ) => Promise<EditMedicationResponse>;
};

function EditMedicationMachineContent({
  medicationId,
  patientName,
  initialForm,
  editMedication,
}: EditMedicationMachineContentProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [state, send] = useMachine(editMedicationMachine, {
    input: {
      medicationId,
      patientName,
      initialForm: {
        name: initialForm.name,
        dosageForm: initialForm.dosageForm ?? null,
        note: initialForm.note,
      },
      editMedication,
    },
  });

  const { form, errors, updatedMedicationId } = state.context;

  if (state.matches("fillMedication")) {
    return (
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <MedicationFormStep
            title="編輯藥品"
            description={`照護對象：${patientName}`}
            patientName={patientName}
            form={form}
            errors={errors}
            backLabel="取消"
            nextLabel="下一步"
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
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (state.matches("confirm")) {
    return (
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <MedicationConfirmStep
            mode="edit"
            patientName={patientName}
            form={form}
            error={errors.form}
            onBack={() => send({ type: "BACK" })}
            onSubmit={() => send({ type: "SUBMIT" })}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (state.matches("submitting")) {
    return <AppStateView loading description="更新藥品中..." />;
  }

  if (state.matches("failure")) {
    return (
      <AppStateView
        title="更新失敗"
        description={errors.form || "更新藥品失敗，請稍後再試。"}
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
        description="藥品資料已成功更新。"
        actionLabel="返回藥品詳情"
        onActionPress={() => {
          router.replace(
            `/(protected)/medications/${updatedMedicationId}/detail`,
          );
        }}
      />
    );
  }

  return null;
}

export default function EditMedicationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: medication,
    isLoading,
    isError,
    refetch,
  } = useGetMedicationDetailQuery(
    {
      medicationId: id,
    },
    {
      skip: !id,
    },
  );

  const [editMedication] = useEditMedicationMutation();

  if (!id) {
    return (
      <AppStateView
        title="缺少藥品 ID"
        description="無法取得要編輯的藥品資料。"
        actionLabel="返回"
        onActionPress={() => router.back()}
      />
    );
  }

  if (isLoading) {
    return <AppStateView loading description="載入藥品資料中..." />;
  }

  if (isError) {
    return (
      <AppStateView
        title="藥品資料載入失敗"
        description="請稍後再試，或重新整理資料。"
        actionLabel="重新整理"
        onActionPress={refetch}
      />
    );
  }

  if (!medication) {
    return (
      <AppStateView
        iconName="medkit-outline"
        title="找不到藥品"
        description="此藥品可能已被刪除，或你沒有編輯權限。"
        actionLabel="返回"
        onActionPress={() => router.back()}
      />
    );
  }

  return (
    <EditMedicationMachineContent
      medicationId={medication.id}
      patientName={medication.patientName}
      initialForm={{
        name: medication.name,
        dosageForm: medication.dosageForm,
        note: medication.note ?? "",
      }}
      editMedication={async (payload) => {
        return await editMedication(payload).unwrap();
      }}
    />
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
