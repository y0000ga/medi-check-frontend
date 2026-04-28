import { AppButton } from "@/components/ui/AppButton";
import { AppStateView } from "@/components/ui/AppStateView";
import { SelectPatientStep } from "@/components/medication/create/SelectPatientStep";
import { createMedicationMachine } from "@/features/medication/createMedicationMachine";
import { useCreateMedicationMutation } from "@/features/medication/medicationApi";
import { useAppTheme } from "@/shared/theme/theme";
import { router } from "expo-router";
import { useMachine } from "@xstate/react";
import { useMemo } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { MedicationFormStep } from "@/components/medication/MedicationFormStep";
import { MedicationConfirmStep } from "@/components/medication/MedicationConfirmStep";

export default function NewMedicationScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [createMedication] = useCreateMedicationMutation();

  const [state, send] = useMachine(createMedicationMachine, {
    input: {
      createMedication: async (payload) => {
        return await createMedication(payload).unwrap();
      },
    },
  });

  const { selectedPatient, form, errors, createdMedicationId } = state.context;

  if (state.matches("selectPatient")) {
    return (
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <SelectPatientStep
            selectedPatient={selectedPatient}
            onSelectPatient={(patient) =>
              send({
                type: "SELECT_PATIENT",
                patient,
              })
            }
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (state.matches("fillMedication")) {
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
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <MedicationFormStep
            title="填寫藥品資訊"
            description={`照護對象：${selectedPatient.name}`}
            patientName={selectedPatient.name}
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
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (state.matches("confirm")) {
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
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <MedicationConfirmStep
            mode="create"
            patientName={selectedPatient.name}
            form={form}
            error={errors.form}
            onBack={() => send({ type: "BACK" })}
            onSubmit={() => send({ type: "SUBMIT" })}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (state.matches("submitting")) {
    return <AppStateView loading description="新增藥品中..." />;
  }

  if (state.matches("failure")) {
    return (
      <AppStateView
        title="新增失敗"
        description={errors.form || "新增藥品失敗，請稍後再試。"}
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
        title="新增成功"
        description="藥品已成功建立。"
        actionLabel="查看藥品"
        onActionPress={() => {
          if (createdMedicationId) {
            router.replace(
              `/(protected)/medications/${createdMedicationId}/detail`,
            );
            return;
          }

          router.replace("/(protected)/(tabs)/medications");
        }}
      />
    );
  }

  return null;
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
