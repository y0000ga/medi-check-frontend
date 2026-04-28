import { AppButton } from "@/components/ui/AppButton";
import { AppStateView } from "@/components/ui/AppStateView";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  useGetMedicationDetailQuery,
  useRemoveMedicationMutation,
} from "@/features/medication/medicationApi";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  dosageFormLabelMap,
  getDosageFormIcon,
} from "@/features/medication/dosageFormOptions";
import InfoRow from "@/components/ui/InfoRow";
import { getPermissionLabel } from "@/features/careRelationship/careRelationshipOptions";

export default function MedicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [removeMedication, { isLoading: isRemoving }] =
    useRemoveMedicationMutation();
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleDelete = () => {
    if (!id || isRemoving) return;

    Alert.alert("刪除藥品", "確定要刪除此藥品嗎？此操作無法復原。", [
      {
        text: "取消",
        style: "cancel",
      },
      {
        text: "刪除",
        style: "destructive",
        onPress: async () => {
          try {
            await removeMedication({
              medicationId: id,
            }).unwrap();

            router.replace("/(protected)/(tabs)/medications");
          } catch {
            Alert.alert("刪除失敗", "請稍後再試。");
          }
        },
      },
    ]);
  };

  const {
    data: medication,
    isLoading,
    isFetching,
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

  if (isLoading) {
    return <AppStateView loading description="載入藥品資料中..." />;
  }

  if (isError) {
    return (
      <AppStateView
        title="資料載入失敗"
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
        description="此藥品可能已被刪除，或你沒有檢視權限。"
        actionLabel="返回"
        onActionPress={() => router.back()}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "藥品詳情",
          headerRight: () => (
            <Pressable
              onPress={handleDelete}
              disabled={isRemoving}
              hitSlop={12}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                opacity: isRemoving ? 0.5 : 1,
              }}
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color={theme.colors.error}
              />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.medicationIconBox}>
            <Ionicons
              name={getDosageFormIcon(medication.dosageForm)}
              size={36}
              color={theme.colors.primary}
            />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.name}>{medication.name}</Text>

            <Text style={styles.subText}>
              {dosageFormLabelMap[medication.dosageForm]}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>藥品資訊</Text>

          <InfoRow label="藥品名稱" value={medication.name} />

          <InfoRow
            label="劑型"
            value={dosageFormLabelMap[medication.dosageForm]}
          />

          <InfoRow
            label="權限"
            value={getPermissionLabel(medication.permissionLevel)}
          />
        </View>

        <Pressable
          onPress={() =>
            router.push(`/(protected)/patients/${medication.patientId}/detail`)
          }
          style={({ pressed }) => [
            styles.card,
            styles.patientCard,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.patientInfo}>
            <Text style={styles.cardTitle}>照護對象</Text>

            <InfoRow label="名稱" value={medication.patientName} />
          </View>

          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={theme.colors.textMuted}
          />
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>筆記</Text>

          {medication.note ? (
            <Text style={styles.noteText}>{medication.note}</Text>
          ) : (
            <Text style={styles.emptyText}>尚未填寫筆記</Text>
          )}
        </View>

        <View style={styles.actions}>
          <AppButton
            title="編輯藥品"
            onPress={() =>
              router.push(`/(protected)/medications/${medication.id}/edit`)
            }
            loading={isFetching}
          />
        </View>
      </ScrollView>
    </>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    content: {
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingVertical: theme.layout.screenPaddingVertical,
      gap: theme.spacing.lg,
    },

    headerCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      ...theme.shadows.card,
    },

    medicationIconBox: {
      width: 72,
      height: 72,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
    },

    headerInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    name: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },

    subText: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    card: {
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    patientCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    cardPressed: {
      opacity: 0.85,
    },

    patientInfo: {
      flex: 1,
      gap: theme.spacing.md,
    },

    cardTitle: {
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },

    infoLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },

    infoValue: {
      flex: 1,
      ...theme.typography.captionStrong,
      color: theme.colors.text,
      textAlign: "right",
    },

    noteText: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 24,
    },

    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textMuted,
    },

    actions: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
  });
