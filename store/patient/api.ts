import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { apiBaseQuery } from "@/store/api/base-query";
import { request } from "@/store/api/client";
import { IPaginationResponse } from "@/store/api/type";
import { ApiUserResponse } from "@/store/user/types";
import {
  IInvitation,
  InvationStatus,
  InvitationDirection,
  PermissionLevel,
  Role,
} from "@/store/care-invitation/type";
import { getCareRelationships } from "@/store/care-relationship/api";
import {
  ICreatePatientBody,
  ICreatePatientResponse,
  IDetailPatient,
  IPatient,
  IPatientOption,
  TGetPatientOptionsParams,
  TGetPatientsParams,
} from "@/store/patient/type";
import { IInvite, RelationShipStatus } from "@/types/care";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ICareRelationship } from "../care-relationship/type";

export interface CarePatientDetail {
  id: string;
  ownerUserId: string | null;
  name: string;
  birthDate: string | null;
  avatarUrl: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CarePatientSummary {
  patientId: string;
  caregiverUserId: string;
  relationshipId: string;
  permissionLevel: PermissionLevel;
  relationshipStatus: RelationShipStatus;
  patientName: string;
  patientAvatarUrl: string | null;
  patientBirthDate: string | null;
  patientNote: string | null;
  ownerUserId: string | null;
}

const toPatientResponse = (
  patient: IPatient | IDetailPatient,
): CarePatientDetail => ({
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
): CarePatientSummary => ({
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

export const fetchOwnedPatient = async (_userId: string) => {
  const me = await request<ApiUserResponse>("/users/me");
  if (!me.patient_id) {
    return undefined;
  }

  const patient = await request<IDetailPatient>(`/patients/${me.patient_id}`);
  return toPatientResponse(patient);
};

export const fetchPatientOptions = async (
  params?: Partial<TGetPatientOptionsParams>,
) => {
  const response = await request<
    { list: IPatientOption[] },
    undefined,
    Partial<TGetPatientOptionsParams>
  >("/patients/options", { params });
  return response.list.map(toPatientPickerOption);
};

export const fetchCarePatients = async (_caregiverUserId: string) => {
  const [options, response, ownPatient] = await Promise.all([
    request<{ list: IPatientOption[] }>("/patients/options"),
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
  const patient = await request<IDetailPatient>(`/patients/${patientId}`);
  return toPatientResponse(patient);
};

export interface CareTeamMember {
  relationshipId: string;
  caregiverUserId: string;
  caregiverName: string;
  caregiverEmail: string;
  caregiverAvatarUrl: string | null;
  permissionLevel: PermissionLevel;
  status: RelationShipStatus;
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

export const fetchCareManagementPatients = async (
  _userId: string,
) => {
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
  const response = await request<
    IPaginationResponse<IInvitation>,
    undefined,
    {
      page: number;
      page_size: number;
      sort_by: string;
      sort_order: string;
      direction: InvitationDirection;
      status: InvationStatus;
    }
  >("/care-invitations", {
    params: {
      page: 1,
      page_size: DEFAULT_PAGE_SIZE,
      sort_by: "sent_at",
      sort_order: "desc",
      direction: InvitationDirection.received,
      status: InvationStatus.pending,
    },
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
) =>
  request<ICreatePatientResponse, ICreatePatientBody>("/patients", {
    method: "POST",
    body: {
      birth_date: payload.birth_date,
      avatar_url: null,
      name: payload.name,
    },
  });

export const updateCaregiverPermission = async (
  _relationshipId: string,
  _permissionLevel: PermissionLevel,
) => {
  throw new Error(
    "Swagger still does not define updateCaregiverPermission API",
  );
};

export const removeCaregiver = async (_relationshipId: string) => {
  throw new Error(
    "Swagger still does not define removeCaregiver API",
  );
};

export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["Patient"],
  endpoints: (builder) => ({
    getPatientList: builder.query<
      IPaginationResponse<IPatient>,
      TGetPatientsParams
    >({
      query: (params) => ({
        path: "/patients",
        params,
      }),
      providesTags: ["Patient"],
    }),
    getPatientOptions: builder.query<
      { list: PatientPickerOption[] },
      Partial<TGetPatientOptionsParams> | void
    >({
      query: (params) => ({
        path: "/patients/options",
        params,
      }),
      transformResponse: (response: { list: IPatientOption[] }) => ({
        list: response.list.map(toPatientPickerOption),
      }),
      providesTags: ["Patient"],
    }),
    getPatientDetail: builder.query<IDetailPatient, string>({
      query: (patientId) => ({
        path: `/patients/${patientId}`,
      }),
      providesTags: (_result, _error, id) => [
        { type: "Patient", id },
      ],
    }),
    createPatient: builder.mutation<
      ICreatePatientResponse,
      ICreatePatientBody
    >({
      query: (body) => ({
        path: "/patients",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Patient"],
    }),
  }),
});

export const {
  useCreatePatientMutation,
  useGetPatientDetailQuery,
  useGetPatientListQuery,
  useGetPatientOptionsQuery,
} = patientApi;
