import { StyleSheet } from "react-native";
import { ThemedView } from "../themed-view";
import { ThemedText } from "../themed-text";
import { ICareRelationship } from "@/types/api/care-relationship";
import { PermissionLevel, Role } from "@/types/api/care-invitation";
import { ROLE_LABEL } from "@/constants/care";

interface IProps {
  userRole: Role;
  relationship: ICareRelationship;
  onPermissionChange: () => void;
  onCaregiverRemove: () => void;
}

const RelationShipCard = ({
  userRole,
  relationship,
  onPermissionChange,
  onCaregiverRemove,
}: IProps) => {
  return (
    <ThemedView style={styles.patientCard}>
      <ThemedView style={styles.patientHeader}>
        <ThemedView style={styles.patientMeta}>
          <ThemedText
            type="subtitle"
            style={styles.patientName}
          >
            {userRole === Role.Patient && relationship.caregiver_name}
            {userRole === Role.CareGiver && relationship.patient_name}
          </ThemedText>
          <ThemedText style={styles.patientSubtitle}>
            我的
            {
              ROLE_LABEL[
                userRole === Role.CareGiver
                  ? Role.Patient
                  : Role.CareGiver
              ]
            }
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={[
            styles.permissionChip,
            relationship.permission_level === PermissionLevel.Write &&
              styles.permissionChipActive,
          ]}
        >
          <ThemedText
            style={[
              styles.permissionChipText,
              relationship.permission_level ===
                PermissionLevel.Write &&
                styles.permissionChipTextActive,
            ]}
          >
            {relationship.permission_level === PermissionLevel.Write
              ? "可編輯"
              : "僅可查看"}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default RelationShipCard;

const styles = StyleSheet.create({
  patientCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 18,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  patientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  patientMeta: {
    flex: 1,
    gap: 4,
  },
  patientName: {
    color: "#0F172A",
  },
  patientSubtitle: {
    color: "#475569",
    lineHeight: 20,
  },
  patientNote: {
    color: "#64748B",
    lineHeight: 20,
  },

  permissionChip: {
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  permissionChipActive: {
    backgroundColor: "#DBEAFE",
  },
  permissionChipText: {
    color: "#64748B",
    fontWeight: "700",
    fontSize: 12,
  },
  permissionChipTextActive: {
    color: "#1D4ED8",
  },
  caregiverSection: {
    gap: 10,
  },
  caregiverSectionTitle: {
    color: "#0F172A",
    fontWeight: "700",
  },
  caregiverList: {
    gap: 10,
  },
});
