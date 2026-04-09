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
import { request } from "./client";
import { ICreatePatientBody } from "@/types/api/patient";

type MockCareRelationship = IRES_CareRelationship;
type MockPatient = IRES_Patient;

let mockPatients: MockPatient[] = DB_PATIENTS.map((item) => ({
  ...item,
}));
let mockCareRelationships: MockCareRelationship[] =
  DB_CARE_RELATIONSHIPS.map((item) => ({ ...item }));

const buildCarePatientSummaries = (): IRES_CarePatientSummary[] =>
  mockCareRelationships
    .map((relationship) => {
      if (!relationship.caregiverUserId) {
        return null;
      }

      const patient = mockPatients.find(
        (item) => item.id === relationship.patientId,
      );

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
  return patient?.ownerUserId
    ? (RES_USERS.find((item) => item.id === patient.ownerUserId) ??
        null)
    : null;
};

export const fetchOwnedPatient = async (userId: string) => {
  return mockPatients.find((item) => item.ownerUserId === userId);
};

export const fetchCarePatients = async (caregiverUserId: string) => {
  return buildCarePatientSummaries().filter(
    (item) =>
      item.caregiverUserId === caregiverUserId &&
      item.relationshipStatus === "active",
  );
};

export const fetchCarePatientDetail = async (
  patientId: string,
  caregiverUserId?: string,
) => {
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
      item.status === "active",
  );

  return relationship || patient.ownerUserId === caregiverUserId
    ? patient
    : undefined;
};

export const fetchPatientHistories = async (
  patientId: string,
  date?: string,
) => {
  const targetDate = date ? dayjs(date) : dayjs();
  return deriveHistoriesByDateForPatient(patientId, targetDate);
};

export const fetchPatientTodayEvents = async (
  patientId: string,
  date?: string,
) => {
  const targetDate = date ? dayjs(date) : dayjs();
  return deriveEventsByDateForPatient(patientId, targetDate);
};

export const fetchCaregiverHistoryFeed = async (
  caregiverUserId: string,
  date?: string,
) => {
  const targetDate = date ? dayjs(date) : dayjs();
  const patientIds = mockCareRelationships
    .filter(
      (item) =>
        item.caregiverUserId === caregiverUserId &&
        item.status === "active",
    )
    .map((item) => item.patientId);

  return patientIds
    .flatMap((patientId) =>
      deriveHistoriesByDateForPatient(patientId, targetDate).map(
        (history) => ({
          patientId,
          patientName:
            DB_PATIENTS.find((item) => item.id === patientId)?.name ??
            "Unknown Patient",
          history,
        }),
      ),
    )
    .sort((a, b) =>
      dayjs(a.history.scheduledTime).isBefore(
        dayjs(b.history.scheduledTime),
      )
        ? 1
        : -1,
    );
};

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

export const fetchCareManagementPatients = async (userId: string) => {
  const accessiblePatients = mockPatients.filter((patient) => {
    if (patient.ownerUserId === userId) {
      return true;
    }

    return mockCareRelationships.some(
      (relationship) =>
        relationship.patientId === patient.id &&
        relationship.caregiverUserId === userId &&
        relationship.status === "active",
    );
  });

  return accessiblePatients.map<CareManagementPatient>((patient) => {
    const owner = getPatientOwner(patient.id);
    const caregivers = mockCareRelationships
      .filter(
        (relationship) =>
          relationship.patientId === patient.id &&
          relationship.status !== "revoked" &&
          relationship.caregiverUserId !== patient.ownerUserId,
      )
      .map<CareTeamMember | null>((relationship) => {
        if (!relationship.caregiverUserId) {
          return {
            relationshipId: relationship.id,
            caregiverUserId: "",
            caregiverName:
              relationship.inviteeEmail ?? "Pending invitation",
            caregiverEmail: relationship.inviteeEmail ?? "",
            caregiverAvatarUrl: null,
            permissionLevel: relationship.permissionLevel,
            status: relationship.status,
            isPatientOwner: false,
          };
        }

        const caregiver = RES_USERS.find(
          (item) => item.id === relationship.caregiverUserId,
        );

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
        relationship.status === "active",
    );

    return {
      patientId: patient.id,
      patientName: patient.name,
      patientAvatarUrl: patient.avatarUrl,
      patientNote: patient.note,
      ownerUserId: patient.ownerUserId,
      ownerName: owner?.name ?? null,
      ownerEmail: owner?.email ?? null,
      canManage:
        patient.ownerUserId === userId ||
        currentRelationship?.permissionLevel === "admin",
      caregivers,
    };
  });
};

export const fetchIncomingCareInvitations = async (
  userId: string,
) => {
  return mockCareRelationships
    .filter(
      (relationship) =>
        relationship.caregiverUserId === userId &&
        relationship.status === "invited",
    )
    .map((relationship) => {
      const patient = mockPatients.find(
        (item) => item.id === relationship.patientId,
      );

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
};

export const createCarePatient = async (
  payload: ICreatePatientBody,
) => {
  const body = {
    email: payload.email,
    birth_date: payload.birth_date,
    avatar_url: null,
    name: payload.name,
  };

  return request<{ id: string }, ICreatePatientBody>("/patients", {
    method: "POST",
    body,
  });
};

export const updateCaregiverPermission = async (
  relationshipId: string,
  permissionLevel: PermissionLevel,
) => {
  const relationship = mockCareRelationships.find(
    (item) => item.id === relationshipId,
  );
  if (!relationship) {
    throw new Error("Care relationship not found");
  }

  const updated: MockCareRelationship = {
    ...relationship,
    permissionLevel,
    updatedAt: dayjs().toISOString(),
  };

  mockCareRelationships = mockCareRelationships.map((item) =>
    item.id === relationshipId ? updated : item,
  );

  return updated;
};

export const removeCaregiver = async (relationshipId: string) => {
  const relationship = mockCareRelationships.find(
    (item) => item.id === relationshipId,
  );
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
      : item,
  );

  return { success: true };
};

export type CarePatientDetail = IRES_Patient | undefined;
export type CarePatientSummary = IRES_CarePatientSummary;
export type PatientHistory = IRES_History;
export type PatientEvent = IRES_Event;