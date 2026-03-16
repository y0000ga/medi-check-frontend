import { CareManagementPatient } from "@/libs/api/patient"
import { StyleSheet } from "react-native"
import { ThemedView } from "../themed-view"
import { ThemedText } from "../themed-text"
import { PermissionLevel } from "@/types/care"
import CaregiverCard, { EmptyCaregiverCard } from "./CaregiverCard"

interface IProps {
    patient: CareManagementPatient,
    onPermissionChange: (relationShipId: string, value: PermissionLevel) => void
    onCaregiverRemove: (relationShipId: string) => void
}

const PatientCard = ({
    patient,
    onPermissionChange,
    onCaregiverRemove
}: IProps) => {
    return (
        <ThemedView key={patient.patientId} style={styles.patientCard}>
            <ThemedView style={styles.patientHeader}>
                <ThemedView style={styles.patientMeta}>
                    <ThemedText type="subtitle" style={styles.patientName}>
                        {patient.patientName}
                    </ThemedText>
                    <ThemedText style={styles.patientSubtitle}>
                        {patient.ownerName
                            ? `病人帳號：${patient.ownerName}${patient.ownerEmail ? ` ・ ${patient.ownerEmail}` : ""}`
                            : "沒有綁定登入帳號的病人資料"}
                    </ThemedText>
                    {patient.patientNote ? (
                        <ThemedText style={styles.patientNote}>{patient.patientNote}</ThemedText>
                    ) : null}
                </ThemedView>
                <ThemedView style={[styles.permissionChip, patient.canManage && styles.permissionChipActive]}>
                    <ThemedText
                        style={[styles.permissionChipText, patient.canManage && styles.permissionChipTextActive]}
                    >
                        {patient.canManage ? "你可管理" : "僅可查看"}
                    </ThemedText>
                </ThemedView>
            </ThemedView>

            <ThemedView style={styles.caregiverSection}>
                <ThemedText style={styles.caregiverSectionTitle}>目前照顧者</ThemedText>
                <ThemedView style={styles.caregiverList}>
                    {patient.caregivers.length > 0 ? patient.caregivers.map((caregiver) => (
                        <CaregiverCard
                            key={caregiver.caregiverUserId}
                            caregiver={caregiver}
                            canManage={patient.canManage}
                            onPermissionChange={(value) => onPermissionChange(caregiver.relationshipId, value)}
                            onCaregiverRemove={() => onCaregiverRemove(caregiver.relationshipId)}
                        />
                    )) : (
                        <EmptyCaregiverCard />
                    )}
                </ThemedView>
            </ThemedView>
        </ThemedView>
    )
}

export default PatientCard

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
})