import dayjs from "dayjs";

import { deriveEventsFromClientData } from "@/utils/occurrence";
import { IRES_Event, IRES_History, IRES_Patient } from "@/types/api";
import { IPaginationResponse } from "@/types/api/base";
import {
  InvitationDirection,
  InvationStatus,
  PermissionLevel,
  Role,
} from "@/types/api/care-invitation";
import { ICareRelationship } from "@/types/api/care-relationship";
import {
  ICreatePatientBody,
  ICreatePatientResponse,
  IDetailPatient,
  IPatient,
  IPatientOption,
  TGetPatientOptionsParams,
  TGetPatientsParams,
} from "@/types/api/patient";
import { IInvite, RelationShipStatus } from "@/types/care";
import {
  IRES_CarePatientSummary,
  IRES_CareRelationship,
} from "@/types/mock";
import { ScheduleEndType } from "@/types/domain";

import { getHistoryList } from "./history";
import { getInvitationList } from "./care-invitation";
import { getMe } from "./auth";
import { getMedicationList } from "./medication";
import { getCareRelationships } from "./care-relationship";
import { request } from "./client";
import { getScheduleMatches } from "./schedule";

const DEFAULT_PAGE_SIZE = 200;

const toPatientResponse = (
  patient: IPatient | IDetailPatient,
): IRES_Patient => ({
  id: patient.id,
  ownerUserId: patient.linked_user_id,
  name: patient.name,
  birthDate: patient.birth_date,
  avatarUrl: patient.avatar_url,
  note: null,
  createdAt: "",
  updatedAt: "",
});

const toCarePatientSummary = (
  relationship: ICareRelationship,
): IRES_CarePatientSummary => ({
  patientId: relationship.patient_id,
  caregiverUserId: relationship.caregiver_user_id,
  relationshipId: relationship.id,
  permissionLevel: relationship.permission_level,
  relationshipStatus: RelationShipStatus.active,
  patientName: relationship.patient_name,
  patientAvatarUrl: null,
  patientBirthDate: null,
  patientNote: null,
  ownerUserId: null,
});

export interface PatientPickerOption {
  label: string;
  value: string;
  avatarUrl: string | null;
  permissionLevel: PermissionLevel;
}

const toPatientPickerOption = (
  patient: IPatientOption,
): PatientPickerOption => ({
  label: patient.name,
  value: patient.id,
  avatarUrl: patient.avatar_url,
  permissionLevel: patient.permission_level,
});

const toDomainEndType = (
  endType: "never" | "until" | "counts" | null,
) => {
  if (endType === null) {
    return null;
  }

  if (endType === "counts") {
    return ScheduleEndType.count;
  }

  if (endType === "until") {
    return ScheduleEndType.until;
  }

  return ScheduleEndType.never;
};

const toHistoryResponse = (
  history: Awaited<ReturnType<typeof getHistoryList>>["list"][number],
): IRES_History => ({
  id: history.id,
  scheduleId: history.schedule_id ?? "",
  patientId: history.patient_id,
  patientName: "",
  scheduledTime: history.scheduled_at,
  intakenTime: history.intake_at,
  status: history.status,
  rate: null,
  takenAmount: history.taken_amount,
  memo: null,
  feeling: null,
  reason: null,
  source: history.source,
  symptomTags: [],
  medicationId: history.medication_id ?? "",
  medicationName: history.medication_name_snapshot,
  medicationDosageForm: null,
  amount: history.amount_snapshot,
  doseUnit: history.dose_unit_snapshot,
});

export const fetchOwnedPatient = async (_userId: string) => {
  const me = await getMe();
  if (!me.patient_id) {
    return undefined;
  }

  const patient = await getPatientDetail(me.patient_id);
  return toPatientResponse(patient);
};

export const getPatientOptions = (
  params?: Partial<TGetPatientOptionsParams>,
) =>
  request<
    { list: IPatientOption[] },
    undefined,
    Partial<TGetPatientOptionsParams>
  >("/patients/options", { params });

export const fetchPatientOptions = async (
  params?: Partial<TGetPatientOptionsParams>,
) => {
  const response = await getPatientOptions(params);
  return response.list.map(toPatientPickerOption);
};

export const fetchCarePatients = async (_caregiverUserId: string) => {
  const [options, response, ownPatient] = await Promise.all([
    getPatientOptions(),
    getCareRelationships({
      page: 1,
      page_size: DEFAULT_PAGE_SIZE,
      sort_by: "created_at",
      sort_order: "desc",
      direction: Role.Patient,
    }),
    fetchOwnedPatient(""),
  ]);

  const ownPatientId = ownPatient?.id ?? null;
  const optionMap = new Map(
    options.list.map((item) => [item.id, item]),
  );

  return response.list
    .filter((item) => item.patient_id !== ownPatientId)
    .map((relationship) => {
      const option = optionMap.get(relationship.patient_id);

      return {
        ...toCarePatientSummary(relationship),
        patientName: option?.name ?? relationship.patient_name,
        patientAvatarUrl: option?.avatar_url ?? null,
      };
    });
};

export const fetchCarePatientDetail = async (
  patientId: string,
  _caregiverUserId?: string,
) => {
  const patient = await getPatientDetail(patientId);
  return toPatientResponse(patient);
};

export const fetchPatientHistories = async (
  patientId: string,
  date?: string,
) => {
  const targetDate = date ? dayjs(date) : dayjs();
  const response = await getHistoryList({
    patient_ids: [patientId],
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    sort_by: "scheduled_at",
    sort_order: "desc",
    from_date: targetDate.format("YYYY-MM-DD"),
    to_date: targetDate.format("YYYY-MM-DD"),
  });

  return response.list.map(toHistoryResponse);
};

export const fetchPatientTodayEvents = async (
  patientId: string,
  date?: string,
) => {
  const targetDate = dayjs(date ?? undefined);
  const [scheduleMatches, medications, histories] = await Promise.all([
    getScheduleMatches({
      patient_ids: [patientId],
      from_date: targetDate.format("YYYY-MM-DD"),
      to_date: targetDate.format("YYYY-MM-DD"),
    }),
    getMedicationList(patientId, {
      page: 1,
      page_size: DEFAULT_PAGE_SIZE,
      sort_by: "created_at",
      sort_order: "desc",
    }),
    fetchPatientHistories(patientId, targetDate.toISOString()),
  ]);

  return deriveEventsFromClientData({
    schedules: scheduleMatches.list.map((item) => ({
      id: item.id,
      patientId: item.patient_id,
      medicationId: item.medication_id,
      timezone: item.timezone,
      startAt: item.started_at,
      timeSlots: item.time_slots ?? [],
      amount: item.amount,
      doseUnit: item.dose_unit,
      frequencyUnit: item.frequency_unit,
      interval: item.interval,
      weekdays: item.weekdays,
      endType: toDomainEndType(item.end_type),
      untilDate: item.until_date,
      occurrenceCount: item.occurrence_count,
    })),
    medications: medications.list.map((item) => ({
      id: item.id,
      patientId: item.patient_id,
      name: item.name,
      dosageForm: item.dosage_form,
      memo: "",
    })),
    histories,
    targetDate,
  });
};

export const fetchCaregiverHistoryFeed = async (
  caregiverUserId: string,
  date?: string,
) => {
  const carePatients = await fetchCarePatients(caregiverUserId);
  const patientIds = carePatients.map((item) => item.patientId);

  if (!patientIds.length) {
    return [];
  }

  const targetDate = dayjs(date ?? undefined);
  const response = await getHistoryList({
    patient_ids: patientIds,
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    sort_by: "scheduled_at",
    sort_order: "desc",
    from_date: targetDate.format("YYYY-MM-DD"),
    to_date: targetDate.format("YYYY-MM-DD"),
  });

  return response.list.map((history) => ({
    patientId: history.patient_id,
    patientName:
      carePatients.find((item) => item.patientId === history.patient_id)
        ?.patientName ?? "Unknown Patient",
    history: toHistoryResponse(history),
  }));
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

export const fetchCareManagementPatients = async (_userId: string) => {
  const [ownPatient, relationships] = await Promise.all([
    fetchOwnedPatient(""),
    getCareRelationships({
      page: 1,
      page_size: DEFAULT_PAGE_SIZE,
      sort_by: "created_at",
      sort_order: "desc",
      direction: Role.Patient,
    }),
  ]);

  if (!ownPatient) {
    return [];
  }

  return [
    {
      patientId: ownPatient.id,
      patientName: ownPatient.name,
      patientAvatarUrl: ownPatient.avatarUrl,
      patientNote: ownPatient.note,
      ownerUserId: ownPatient.ownerUserId,
      ownerName: null,
      ownerEmail: null,
      canManage: true,
      caregivers: relationships.list.map((relationship) => ({
        relationshipId: relationship.id,
        caregiverUserId: relationship.caregiver_user_id,
        caregiverName: relationship.caregiver_name,
        caregiverEmail: "",
        caregiverAvatarUrl: null,
        permissionLevel: relationship.permission_level,
        status: RelationShipStatus.active,
        isPatientOwner: false,
      })),
    },
  ];
};

export const fetchIncomingCareInvitations = async (
  _userId: string,
) => {
  const response = await getInvitationList({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    sort_by: "sent_at",
    sort_order: "desc",
    direction: InvitationDirection.received,
    status: InvationStatus.pending,
  });

  return response.list
    .filter((item) => item.patient_id)
    .map<IInvite>((item) => ({
      relationshipId: item.id,
      patientId: item.patient_id!,
      patientName: "",
      inviteeEmail: item.invitee_email,
      permissionLevel: item.permission_level,
      createdAt: item.sent_at ?? "",
      invitedByUserId: item.inviter_user_id,
    }));
};

export const createCarePatient = async (
  payload: ICreatePatientBody,
) => {
  return createPatient({
    birth_date: payload.birth_date,
    avatar_url: null,
    name: payload.name,
  });
};

export const getPatientList = (params: TGetPatientsParams) =>
  request<
    IPaginationResponse<IPatient>,
    undefined,
    TGetPatientsParams
  >("/patients", { params });

export const getPatientDetail = (patientId: string) =>
  request<IDetailPatient>(`/patients/${patientId}`);

export const createPatient = (body: ICreatePatientBody) =>
  request<ICreatePatientResponse, ICreatePatientBody>("/patients", {
    method: "POST",
    body,
  });

export const updateCaregiverPermission = async (
  _relationshipId: string,
  _permissionLevel: PermissionLevel,
) => {
  throw new Error(
    "Swagger 目前沒有提供 updateCaregiverPermission API",
  );
};

export const removeCaregiver = async (_relationshipId: string) => {
  throw new Error(
    "Swagger 目前沒有提供 removeCaregiver API",
  );
};

export type CarePatientDetail = IRES_Patient | undefined;
export type CarePatientSummary = IRES_CarePatientSummary;
export type PatientHistory = IRES_History;
export type PatientEvent = IRES_Event;
