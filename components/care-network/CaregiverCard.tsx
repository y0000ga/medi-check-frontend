import { Pressable, StyleSheet } from "react-native"
import { ThemedView } from "../themed-view"
import { ThemedText } from "../themed-text"
import FieldPicker from "../ui/field-picker"
import { PermissionLevel } from "@/types/care"
import { PERMISSION_LABEL, PERMISSION_OPTIONS, STATUS_LABEL } from "@/constants/care"
import { CareTeamMember } from "@/libs/api/patient"

interface IProps {
    caregiver: CareTeamMember,
    canManage: boolean,
    onPermissionChange: (value: PermissionLevel) => void
    onCaregiverRemove: () => void
}

const CaregiverCard = ({ caregiver, canManage, onPermissionChange, onCaregiverRemove }: IProps) => {
    return (
        <ThemedView key={caregiver.relationshipId} style={styles.caregiverCard}>
            <ThemedView style={styles.caregiverRow}>
                <ThemedView style={styles.caregiverMeta}>
                    <ThemedText style={styles.caregiverName}>{caregiver.caregiverName}</ThemedText>
                    <ThemedText style={styles.caregiverEmail}>{caregiver.caregiverEmail}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.statusChip}>
                    <ThemedText style={styles.statusChipText}>{STATUS_LABEL[caregiver.status]}</ThemedText>
                </ThemedView>
            </ThemedView>

            {canManage ? (
                <ThemedView style={styles.manageRow}>
                    <ThemedView style={styles.permissionPickerWrap}>
                        <FieldPicker<PermissionLevel>
                            label="權限"
                            value={caregiver.permissionLevel}
                            options={PERMISSION_OPTIONS}
                            onValueChange={(value) => { onPermissionChange(value) }
                            }
                        />
                    </ThemedView>
                    <Pressable
                        style={styles.removeButton}
                        onPress={() => onCaregiverRemove()}
                    >
                        <ThemedText style={styles.removeButtonText}>移除</ThemedText>
                    </Pressable>
                </ThemedView>
            ) : (
                <ThemedText style={styles.caregiverPermission}>
                    權限：{PERMISSION_LABEL[caregiver.permissionLevel]}
                </ThemedText>
            )}
        </ThemedView>
    )
}

export default CaregiverCard

export const EmptyCaregiverCard = () => {
    return (
        <ThemedView style={styles.emptyCaregiverCard}>
            <ThemedText style={styles.emptyCaregiverText}>目前沒有其他照顧者。</ThemedText>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    emptyCaregiverCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 10,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    emptyCaregiverText: {
        color: "#64748B",
    },
    // ----
    manageRow: {
        padding: 14,
        gap: 12,
    },
    permissionPickerWrap: {
        flex: 1,
    },
    statusChip: {
        backgroundColor: "#E2E8F0",
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignSelf: "flex-start",
    },
    statusChipText: {
        color: "#334155",
        fontWeight: "700",
        fontSize: 11,
    },
    caregiverPermission: {
        color: "#475569",
    },
    caregiverCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 10,
        padding: 14,
        gap: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    caregiverRow: {
        padding: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    caregiverMeta: {
        flex: 1,
        gap: 2,
    },
    caregiverName: {
        color: "#0F172A",
        fontWeight: "700",
    },
    caregiverEmail: {
        color: "#64748B",
    },
    removeButton: {
        borderRadius: 8,
        backgroundColor: "#FEE2E2",
        paddingVertical: 12,
        alignItems: "center",
    },
    removeButtonText: {
        color: "#B91C1C",
        fontWeight: "700",
    },
})