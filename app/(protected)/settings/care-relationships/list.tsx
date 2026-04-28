import { AppPagination } from "@/components/ui/AppPagination";
import { AppSelectField } from "@/components/form/AppSelectField";
import { AppStateView } from "@/components/ui/AppStateView";
import { useGetCareRelationshipsQuery } from "@/features/careRelationship/careRelationshipApi";
import {
  CareRelationship,
  CareRelationshipDirection,
  CareRelationshipSortBy,
} from "@/features/careRelationship/types";
import { PermissionLevel } from "@/features/patient/types";
import { SortOrder } from "@/shared/api/types";
import { useAppTheme } from "@/shared/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import {
  directionOptions,
  getPermissionLabel,
  getRelationshipIcon,
  getRelationshipSubtitle,
  getRelationshipTitle,
  totalpermissionOptions,
} from "@/features/careRelationship/careRelationshipOptions";

export default function CareRelationshipsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState<CareRelationshipDirection>(
    CareRelationshipDirection.patient,
  );
  const [permissionLevel, setPermissionLevel] =
    useState<PermissionLevel | null>(null);

  const queryParams = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: CareRelationshipSortBy.createdAt,
      sortOrder: SortOrder.desc,
      direction,
      permissionLevel,
    }),
    [page, direction, permissionLevel],
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetCareRelationshipsQuery(queryParams);

  const relationships = data?.list ?? [];
  const totalSize = data?.totalSize ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalSize / DEFAULT_PAGE_SIZE));

  const handleChangeDirection = (nextDirection: CareRelationshipDirection) => {
    setDirection(nextDirection);
    setPage(1);
  };

  const handleChangePermissionLevel = (
    nextPermissionLevel: PermissionLevel | null,
  ) => {
    setPermissionLevel(nextPermissionLevel);
    setPage(1);
  };

  return (
    <>
      <View style={styles.screen}>
        <View style={styles.filterCard}>
          <AppSelectField
            label="關係方向"
            value={direction}
            onChange={(value) => {
              if (!value) return;
              handleChangeDirection(value);
            }}
            options={directionOptions}
            modalTitle="選擇關係方向"
            required
          />

          <AppSelectField
            label="權限"
            value={permissionLevel}
            onChange={handleChangePermissionLevel}
            options={totalpermissionOptions}
            modalTitle="選擇權限"
          />
        </View>

        {isLoading ? (
          <AppStateView loading description="載入照護關係中..." />
        ) : isError ? (
          <AppStateView
            title="照護關係載入失敗"
            description="請稍後再試，或重新整理列表。"
            actionLabel="重新整理"
            onActionPress={refetch}
          />
        ) : relationships.length === 0 ? (
          <AppStateView
            iconName="people-outline"
            title="尚無照護關係"
            description={
              direction === CareRelationshipDirection.patient
                ? "目前沒有你正在照護的對象。"
                : "目前沒有正在照護你的人。"
            }
          />
        ) : (
          <>
            <FlatList
              data={relationships}
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
                <CareRelationshipCard
                  relationship={item}
                  direction={direction}
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
      </View>
    </>
  );
}

type CareRelationshipCardProps = {
  relationship: CareRelationship;
  direction: CareRelationshipDirection;
};

function CareRelationshipCard({
  relationship,
  direction,
}: CareRelationshipCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.card}>
      <View style={styles.cardIconBox}>
        <Ionicons
          name={getRelationshipIcon(direction)}
          size={22}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {getRelationshipTitle(relationship, direction)}
          </Text>

          <View style={styles.permissionBadge}>
            <Text style={styles.permissionBadgeText}>
              {getPermissionLabel(relationship.permissionLevel)}
            </Text>
          </View>
        </View>

        <Text style={styles.metaText} numberOfLines={1}>
          {getRelationshipSubtitle(relationship, direction)}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          照護者：{relationship.caregiverName}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          被照護者：{relationship.patientName}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          關係 ID：{relationship.id}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.layout.screenPaddingHorizontal,
      paddingTop: theme.layout.screenPaddingVertical,
      gap: theme.spacing.lg,
    },

    header: {
      gap: theme.spacing.lg,
    },

    headerTextGroup: {
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

    filterCard: {
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    listContent: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },

    card: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
      ...theme.shadows.card,
    },

    cardIconBox: {
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

    cardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },

    cardTitle: {
      flex: 1,
      ...theme.typography.bodyStrong,
      color: theme.colors.text,
    },

    permissionBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primarySoft,
    },

    permissionBadgeText: {
      ...theme.typography.captionStrong,
      color: theme.colors.primary,
    },

    metaText: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },
  });
