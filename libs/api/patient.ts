import dayjs from "dayjs";

import {
  DB_CARE_RELATIONSHIPS,
  DB_PATIENTS,
  RES_USERS,
  deriveEventsByDateForPatient,
  deriveHistoriesByDateForPatient,
} from "@/constants/mock";
import { PermissionLevel, RelationShipStatus } from "@/types/care";
import {
  IRES_CarePatientSummary,
  IRES_CareRelationship,
  IRES_Event,
  IRES_History,
  IRES_Patient,
} from "@/types/mock";

type MockCareRelationship = IRES_CareRelationship;
type MockPatient = IRES_Patient;

let mockPatients: MockPatient[] = DB_PATIENTS.map((item) => ({ ...item }));
let mockCareRelationships: MockCareRelationship[] = DB_CARE_RELATIONSHIPS.map((item) => ({ ...item }));

const buildCarePatientSummaries = (): IRES_CarePatientSummary[] =>
  mockCareRelationships
    .map((relationship) => {
      if (!relationship.caregiverUserId) {
        return null;
      }

      const patient = mockPatients.find((item) => item.id === relationship.patientId);

      if (!patient) {
        return null;
      }

      return {
        patientId: patient.id,
        caregiverUserId: relationship.caregiverUserId,
        relationshipId: relationship.id,
        permissionLevel: relationship.permissionLevel,
        relationshipStatus: relationship.status,
        patientName: patient.name,
        patientAvatarUrl: patient.avatarUrl,
        patientBirthDate: patient.birthDate,
        patientNote: patient.note,
        ownerUserId: patient.ownerUserId,
      };
    })
    .filter((item): item is IRES_CarePatientSummary => item !== null);

const getPatientOwner = (patientId: string) => {
  const patient = mockPatients.find((item) => item.id === patientId);
  return patient?.ownerUserId ? RES_USERS.find((item) => item.id === patient.ownerUserId) ?? null : null;
};

export async function fetchOwnedPatient(userId: string) {
  return mockPatients.find((item) => item.ownerUserId === userId);
}

export async function fetchCarePatients(caregiverUserId: string) {
  return buildCarePatientSummaries().filter(
    (item) => item.caregiverUserId === caregiverUserId && item.relationshipStatus === "active"
  );
}

export async function fetchCarePatientDetail(patientId: string, caregiverUserId?: string) {
  const patient = mockPatients.find((item) => item.id === patientId);

  if (!patient) {
    return undefined;
  }

  if (!caregiverUserId) {
    return patient;
  }

  const relationship = mockCareRelationships.find(
    (item) =>
      item.patientId === patientId &&
      item.caregiverUserId === caregiverUserId &&
      item.status === "active"
  );

  return relationship || patient.ownerUserId === caregiverUserId ? patient : undefined;
}

export async function fetchPatientHistories(patientId: string, date?: string) {
  const targetDate = date ? dayjs(date) : dayjs();
  return deriveHistoriesByDateForPatient(patientId, targetDate);
}

export async function fetchPatientTodayEvents(patientId: string, date?: string) {
  const targetDate = date ? dayjs(date) : dayjs();
  return deriveEventsByDateForPatient(patientId, targetDate);
}

export async function fetchCaregiverHistoryFeed(caregiverUserId: string, date?: string) {
  const targetDate = date ? dayjs(date) : dayjs();
  const patientIds = mockCareRelationships
    .filter((item) => item.caregiverUserId === caregiverUserId && item.status === "active")
    .map((item) => item.patientId);

  return patientIds
    .flatMap((patientId) =>
      deriveHistoriesByDateForPatient(patientId, targetDate).map((history) => ({
        patientId,
        patientName: DB_PATIENTS.find((item) => item.id === patientId)?.name ?? "Unknown Patient",
        history,
      }))
    )
    .sort((a, b) => (dayjs(a.history.scheduledTime).isBefore(dayjs(b.history.scheduledTime)) ? 1 : -1));
}

export interface CareTeamMember {
  relationshipId: string;
  caregiverUserId: string;
  caregiverName: string;
  caregiverEmail: string;
  caregiverAvatarUrl: string | null;
  permissionLevel: PermissionLevel;
  status: IRES_CareRelationship["status"];
  isPatientOwner: boolean;
}

export interface CareManagementPatient {
  patientId: string;
  patientName: string;
  patientAvatarUrl: string | null;
  patientNote: string | null;
  ownerUserId: string | null;
  ownerName: string | null;
  ownerEmail: string | null;
  canManage: boolean;
  caregivers: CareTeamMember[];
}

export async function fetchCareManagementPatients(userId: string) {
  const accessiblePatients = mockPatients.filter((patient) => {
    if (patient.ownerUserId === userId) {
      return true;
    }

    return mockCareRelationships.some(
      (relationship) =>
        relationship.patientId === patient.id &&
        relationship.caregiverUserId === userId &&
        relationship.status === "active"
    );
  });

  return accessiblePatients.map<CareManagementPatient>((patient) => {
    const owner = getPatientOwner(patient.id);
    const caregivers = mockCareRelationships
      .filter(
        (relationship) =>
          relationship.patientId === patient.id &&
          relationship.status !== "revoked" &&
          relationship.caregiverUserId !== patient.ownerUserId
      )
      .map<CareTeamMember | null>((relationship) => {
        if (!relationship.caregiverUserId) {
          return {
            relationshipId: relationship.id,
            caregiverUserId: "",
            caregiverName: relationship.inviteeEmail ?? "Pending invitation",
            caregiverEmail: relationship.inviteeEmail ?? "",
            caregiverAvatarUrl: null,
            permissionLevel: relationship.permissionLevel,
            status: relationship.status,
            isPatientOwner: false,
          };
        }

        const caregiver = RES_USERS.find((item) => item.id === relationship.caregiverUserId);

        if (!caregiver) {
          return null;
        }

        return {
          relationshipId: relationship.id,
          caregiverUserId: relationship.caregiverUserId,
          caregiverName: caregiver.name,
          caregiverEmail: caregiver.email,
          caregiverAvatarUrl: caregiver.avatarUrl,
          permissionLevel: relationship.permissionLevel,
          status: relationship.status,
          isPatientOwner: false,
        };
      })
      .filter((item): item is CareTeamMember => item !== null);

    const currentRelationship = mockCareRelationships.find(
      (relationship) =>
        relationship.patientId === patient.id &&
        relationship.caregiverUserId === userId &&
        relationship.status === "active"
    );

    return {
      patientId: patient.id,
      patientName: patient.name,
      patientAvatarUrl: patient.avatarUrl,
      patientNote: patient.note,
      ownerUserId: patient.ownerUserId,
      ownerName: owner?.name ?? null,
      ownerEmail: owner?.email ?? null,
      canManage: patient.ownerUserId === userId || currentRelationship?.permissionLevel === "admin",
      caregivers,
    };
  });
}

export async function fetchIncomingCareInvitations(userId: string) {
  return mockCareRelationships
    .filter((relationship) => relationship.caregiverUserId === userId && relationship.status === "invited")
    .map((relationship) => {
      const patient = mockPatients.find((item) => item.id === relationship.patientId);

      return {
        relationshipId: relationship.id,
        patientId: relationship.patientId,
        patientName: patient?.name ?? "Unknown Patient",
        inviteeEmail: relationship.inviteeEmail,
        permissionLevel: relationship.permissionLevel,
        createdAt: relationship.createdAt,
        invitedByUserId: relationship.invitedByUserId,
      };
    });
}

export async function inviteCaregiver(payload: {
  patientId: string;
  caregiverEmail: string;
  permissionLevel: PermissionLevel;
  invitedByUserId?: string | null;
}) {
  const patient = mockPatients.find((item) => item.id === payload.patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const normalizedEmail = payload.caregiverEmail.trim().toLowerCase();
  const caregiver = RES_USERS.find((item) => item.email.toLowerCase() === normalizedEmail);

  if (caregiver && patient.ownerUserId === caregiver.id) {
    throw new Error("Patient owner does not need an extra caregiver relationship");
  }

  const existed = mockCareRelationships.find(
    (item) =>
      item.patientId === payload.patientId &&
      (((caregiver && item.caregiverUserId === caregiver.id) || false) ||
        item.inviteeEmail?.toLowerCase() === normalizedEmail) &&
      item.status !== "revoked"
  );

  if (existed) {
    throw new Error("This caregiver has already been linked or invited");
  }

  const relationship: MockCareRelationship = {
    id: `care-${String(mockCareRelationships.length + 1).padStart(2, "0")}`,
    caregiverUserId: caregiver?.id ?? null,
    patientId: payload.patientId,
    inviteeEmail: normalizedEmail,
    invitedByUserId: payload.invitedByUserId ?? null,
    permissionLevel: payload.permissionLevel,
    status: RelationShipStatus.invited,
    acceptedAt: null,
    revokedAt: null,
    createdAt: dayjs().toISOString(),
    updatedAt: dayjs().toISOString(),
  };

  mockCareRelationships = [...mockCareRelationships, relationship];
  return relationship;
}

export async function createCarePatient(payload: {
  creatorUserId: string;
  patientName: string;
  birthDate?: string | null;
  note?: string | null;
}) {
  const normalizedName = payload.patientName.trim();

  if (!normalizedName) {
    throw new Error("請先輸入病人姓名");
  }

  const normalizedBirthDate = payload.birthDate?.trim() ?? "";
  const birthDateValue = dayjs(normalizedBirthDate);
  const isBirthDateValid =
    !normalizedBirthDate ||
    (/^\d{4}-\d{2}-\d{2}$/.test(normalizedBirthDate) &&
      birthDateValue.isValid() &&
      birthDateValue.format("YYYY-MM-DD") === normalizedBirthDate);

  if (!isBirthDateValid) {
    throw new Error("生日格式請使用 YYYY-MM-DD");
  }

  const normalizedNote = payload.note?.trim() ?? "";
  const now = dayjs().toISOString();
  const nextPatientIndex = mockPatients.length + 1;
  const patientId = `p${nextPatientIndex}`;

  const patient: MockPatient = {
    id: patientId,
    ownerUserId: null,
    name: normalizedName,
    birthDate: normalizedBirthDate || null,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(normalizedName)}`,
    note: normalizedNote || null,
    createdAt: now,
    updatedAt: now,
  };

  mockPatients = [...mockPatients, patient];

  const relationship: MockCareRelationship = {
    id: `care-${String(mockCareRelationships.length + 1).padStart(2, "0")}`,
    caregiverUserId: payload.creatorUserId,
    patientId,
    inviteeEmail: null,
    invitedByUserId: payload.creatorUserId,
    permissionLevel: PermissionLevel.admin,
    status: RelationShipStatus.active,
    acceptedAt: now,
    revokedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  mockCareRelationships = [...mockCareRelationships, relationship];

  return {
    patient,
    relationship,
  };
}

export async function updateCaregiverPermission(
  relationshipId: string,
  permissionLevel: PermissionLevel
) {
  const relationship = mockCareRelationships.find((item) => item.id === relationshipId);
  if (!relationship) {
    throw new Error("Care relationship not found");
  }

  const updated: MockCareRelationship = {
    ...relationship,
    permissionLevel,
    updatedAt: dayjs().toISOString(),
  };

  mockCareRelationships = mockCareRelationships.map((item) =>
    item.id === relationshipId ? updated : item
  );

  return updated;
}

export async function removeCaregiver(relationshipId: string) {
  const relationship = mockCareRelationships.find((item) => item.id === relationshipId);
  if (!relationship) {
    throw new Error("Care relationship not found");
  }

  mockCareRelationships = mockCareRelationships.map((item) =>
    item.id === relationshipId
      ? {
          ...item,
          status: RelationShipStatus.revoked,
          revokedAt: dayjs().toISOString(),
          updatedAt: dayjs().toISOString(),
        }
      : item
  );

  return { success: true };
}

export type CarePatientDetail = IRES_Patient | undefined;
export type CarePatientSummary = IRES_CarePatientSummary;
export type PatientHistory = IRES_History;
export type PatientEvent = IRES_Event;
