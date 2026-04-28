import { AppButton } from "@/components/ui/AppButton";
import { AppStateView } from "@/components/ui/AppStateView";
import InfoRow from "@/components/ui/InfoRow";
import { getPermissionLabel } from "@/features/careRelationship/careRelationshipOptions";
import { useGetPatientDetailQuery } from "@/features/patient/patientApi";
import { useAppTheme } from "@/shared/theme/theme";
import { formatDateToYYYYMMDD } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    data: patient,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPatientDetailQuery(
    { id },
    {
      skip: !id,
    },
  );

  if (isLoading) {
    return <AppStateView loading description="載入照護對象資料中..." />;
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

  if (!patient) {
    return (
      <AppStateView
        iconName="person-circle-outline"
        title="找不到照護對象"
        description="此照護對象可能已被刪除，或你沒有檢視權限。"
        actionLabel="返回"
        onActionPress={() => router.back()}
      />
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.avatarBox}>
          {patient.avatarUrl ? (
            <Image source={{ uri: patient.avatarUrl }} style={styles.avatar} />
          ) : (
            <Ionicons
              name="person-outline"
              size={36}
              color={theme.colors.primary}
            />
          )}
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.name}>{patient.name}</Text>

          <Text style={styles.subText}>
            {patient.linkedUserName
              ? `關聯帳號：${patient.linkedUserName}`
              : "尚未關聯使用者帳號"}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>基本資料</Text>

        <InfoRow label="生日" value={formatDateToYYYYMMDD(patient.birthDate)} />

        <InfoRow
          label="權限"
          value={getPermissionLabel(patient.permissionLevel)}
        />

        <InfoRow label="關聯帳號" value={patient.linkedUserName || "未關聯"} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>筆記</Text>

        {patient.note ? (
          <Text style={styles.noteText}>{patient.note}</Text>
        ) : (
          <Text style={styles.emptyText}>尚未填寫筆記</Text>
        )}
      </View>

      <View style={styles.actions}>
        <AppButton
          title="編輯資料"
          onPress={() =>
            router.push(`/(protected)/patients/${patient.id}/edit`)
          }
          loading={isFetching}
        />
      </View>
    </ScrollView>
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

    avatarBox: {
      width: 72,
      height: 72,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primarySoft,
      overflow: "hidden",
    },

    avatar: {
      width: "100%",
      height: "100%",
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
