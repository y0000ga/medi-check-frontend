import { IDB_CareRelationship, IDB_History, IDB_Medication, IDB_Patient, IDB_Schedule, IDB_User } from "./db";

export interface IRES_User {
    id: IDB_User["id"],
    email: IDB_User["email"],
    name: IDB_User["name"],
    avatarUrl: IDB_User["avatarUrl"],
    isEmailVerified: IDB_User["isEmailVerified"],
    status: IDB_User["status"],
}

export interface IRES_Patient {
    id: IDB_Patient["id"],
    ownerUserId: IDB_Patient["ownerUserId"],
    name: IDB_Patient["name"],
    birthDate: IDB_Patient["birthDate"],
    avatarUrl: IDB_Patient["avatarUrl"],
    note: IDB_Patient["note"],
    createdAt: IDB_Patient["createdAt"],
    updatedAt: IDB_Patient["updatedAt"]
}

export interface IRES_CareRelationship {
    id: IDB_CareRelationship["id"],
    caregiverUserId: IDB_CareRelationship["caregiverUserId"],
    patientId: IDB_CareRelationship["patientId"],
    inviteeEmail: IDB_CareRelationship["inviteeEmail"],
    invitedByUserId: IDB_CareRelationship["invitedByUserId"],
    permissionLevel: IDB_CareRelationship["permissionLevel"],
    status: IDB_CareRelationship["status"],
    acceptedAt: IDB_CareRelationship["acceptedAt"],
    revokedAt: IDB_CareRelationship["revokedAt"],
    createdAt: IDB_CareRelationship["createdAt"],
    updatedAt: IDB_CareRelationship["updatedAt"]
}

export interface IRES_CarePatientSummary {
    patientId: IDB_Patient["id"],
    caregiverUserId: IDB_User["id"],
    relationshipId: IDB_CareRelationship["id"],
    permissionLevel: IDB_CareRelationship["permissionLevel"],
    relationshipStatus: IDB_CareRelationship["status"],
    patientName: IDB_Patient["name"],
    patientAvatarUrl: IDB_Patient["avatarUrl"],
    patientBirthDate: IDB_Patient["birthDate"],
    patientNote: IDB_Patient["note"],
    ownerUserId: IDB_Patient["ownerUserId"]
}

export interface IRES_Medication {
    id: IDB_Medication["id"]
    patientId: IDB_Medication["patientId"]
    name: IDB_Medication["name"]
    dosageForm: IDB_Medication["dosageForm"]
    memo: string
}

export interface IRES_History {
    id: IDB_History["id"],
    scheduleId: IDB_History["scheduleId"],
    patientId: IDB_Patient["id"],
    patientName: IDB_Patient["name"],
    scheduledTime: IDB_History["scheduledTime"],
    intakenTime: IDB_History["intakenTime"],
    status: IDB_History["status"],
    rate: IDB_History["rate"],
    takenAmount: IDB_History["takenAmount"],
    memo: IDB_History["memo"],
    feeling: IDB_History["feeling"],
    reason: IDB_History["reason"],
    source: IDB_History["source"],
    symptomTags: IDB_History["symptomTags"],
    medicationId: IDB_History["medicationIdSnapshot"],
    medicationName: IDB_History["medicationNameSnapshot"],
    medicationDosageForm: IDB_History["medicationDosageFormSnapshot"],
    amount: IDB_History["amountSnapshot"],
    doseUnit: IDB_History["doseUnitSnapshot"]
}

export interface IRES_Event {
    id: string,
    scheduleId: IDB_Schedule["id"]
    patientId: IDB_Patient["id"],
    patientName: IDB_Patient["name"],
    scheduledTime: IDB_History["scheduledTime"],
    amount: IDB_Schedule["amount"],
    doseUnit: IDB_Schedule["doseUnit"]
    medicationId: IDB_Medication["id"],
    medicationName: IDB_Medication["name"],
    medicationDosageForm: IDB_Medication["dosageForm"]
    historyId: IDB_History["id"] | null,
    status: IDB_History["status"],
    intakenTime?: IDB_History["intakenTime"],
    rate?: IDB_History["rate"],
    takenAmount?: IDB_History["takenAmount"],
    memo?: IDB_History["memo"],
    feeling?: IDB_History["feeling"],
    reason?: IDB_History["reason"],
    source?: IDB_History["source"],
    symptomTags?: IDB_History["symptomTags"]
}
