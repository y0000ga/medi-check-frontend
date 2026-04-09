import dayjs from "dayjs";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { IEvent } from "@/types/schedule";
import { evaluateLabel, evaluteStatus } from "@/utils/common";
import { IconSymbol } from "./ui/icon-symbol";

interface IProps {
  toggleCheck: () => void;
  toggleExpanded?: () => void;
  onManage?: () => void;
  onViewMedication?: () => void;
  patientNameTag?: string | null;
  expanded?: boolean;
  event: IEvent;
}

const EventCard = ({
  toggleCheck,
  toggleExpanded,
  onManage,
  onViewMedication,
  patientNameTag,
  expanded = false,
  event: {
    scheduledTime,
    intakenTime,
    amount,
    doseUnit,
    medicationName,
    medicationDosageForm,
  },
}: IProps) => {
  const { isOperable, isIntaken, isMissed } = evaluteStatus({
    scheduledTime,
    intakenTime,
  });

  const { label, icon: headerIcon } = evaluateLabel({
    medicationDosageForm,
    doseUnit,
    amount,
  });

  const checkedIconProps = useMemo(() => {
    if (isIntaken) {
      return {
        name: "check-circle",
        color: "#22C55E",
      };
    }

    if (isMissed) {
      return {
        name: "check-circle-outline",
        color: "#EF4444",
      };
    }

    return {
      name: "check-circle-outline",
      color: "#3C83F6",
    };
  }, [isIntaken, isMissed]);

  return (
    <View style={[styles.card, !isOperable && styles.disabled]}>
      <Pressable onPress={toggleCheck}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: headerIcon.backgroundColor },
            ]}
          >
            <IconSymbol
              size={24}
              name={headerIcon.name}
              color={headerIcon.color}
            />
          </View>
          <View style={styles.content}>
            <Text style={[styles.title, isIntaken && styles.done]}>
              {medicationName}
            </Text>
            <Text style={styles.meta}>
              {label} {dayjs(scheduledTime).format("HH:mm")}
            </Text>
          </View>
          <View style={styles.checkAction}>
            <IconSymbol
              size={28}
              {...checkedIconProps}
            />
          </View>
        </View>
      </Pressable>
      <View style={styles.footer}>
        {patientNameTag ? (
          <View style={styles.patientTag}>
            <Text style={styles.patientTagText}>
              {patientNameTag}
            </Text>
          </View>
        ) : (
          <View />
        )}
        {toggleExpanded ? (
          <Pressable
            onPress={toggleExpanded}
            style={styles.moreButton}
          >
            <Text style={styles.moreText}>
              {expanded ? "收合" : "更多"}
            </Text>
            <IconSymbol
              size={18}
              name={
                expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"
              }
              color="#64748B"
            />
          </Pressable>
        ) : null}
      </View>
      {expanded ? (
        <View style={styles.expandPanel}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>預定時間</Text>
            <Text style={styles.detailValue}>
              {dayjs(scheduledTime).format("YYYY/MM/DD HH:mm")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>紀錄時間</Text>
            <Text style={styles.detailValue}>
              {intakenTime
                ? dayjs(intakenTime).format("YYYY/MM/DD HH:mm")
                : "尚未紀錄"}
            </Text>
          </View>
          <View style={styles.actionRow}>
            <Pressable
              style={styles.secondaryAction}
              onPress={onViewMedication}
            >
              <Text style={styles.secondaryActionText}>查看藥物</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryAction}
              onPress={onManage}
            >
              <Text style={styles.secondaryActionText}>管理提醒</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  patientTag: {
    alignSelf: "flex-start",
    backgroundColor: "#F8FAFC",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  patientTagText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "600",
  },
  title: {
    color: "#0F172A",
    fontWeight: "600",
  },
  meta: {
    color: "#64748B",
  },
  checkAction: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 28,
    minHeight: 28,
  },
  moreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  moreText: {
    color: "#64748B",
    fontWeight: "600",
  },
  expandPanel: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  detailLabel: {
    color: "#64748B",
    fontWeight: "600",
  },
  detailValue: {
    color: "#0F172A",
    flex: 1,
    textAlign: "right",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  secondaryAction: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryActionText: {
    color: "#334155",
    fontWeight: "600",
  },
  disabled: { opacity: 0.6 },
  done: { textDecorationLine: "line-through" },
});

export default EventCard;
