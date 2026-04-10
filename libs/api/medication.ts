import { IREQ_MedicationPayload } from "@/types/api";
import { IPaginationResponse } from "@/types/api/base";
import {
  ICreateMedicationBody,
  ICreateMedicationResponse,
  IEditMedicationBody,
  IEditMedicationResponse,
  IMedication,
  IMedicationDetail,
  TGetAllMedicationsParams,
  TGetMedicationsParams,
} from "@/types/api/medication";

import { request } from "./client";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";

export const getMedicationList = (
  patientId: string,
  params: TGetMedicationsParams,
) =>
  request<
    IPaginationResponse<IMedication>,
    undefined,
    TGetMedicationsParams
  >(`/patients/${patientId}/medications`, { params });

export const getAllMedications = (params: TGetAllMedicationsParams) =>
  request<
    IPaginationResponse<IMedication>,
    undefined,
    TGetAllMedicationsParams
  >("/medications", { params });

export const getMedicationDetail = (medicationId: string) =>
  request<IMedicationDetail>(`/medications/${medicationId}`);

export const createMedicationForPatient = (
  patientId: string,
  body: ICreateMedicationBody,
) =>
  request<ICreateMedicationResponse, ICreateMedicationBody>(
    `/patients/${patientId}/medications`,
    {
      method: "POST",
      body,
    },
  );

export const editMedication = (
  medicationId: string,
  body: IEditMedicationBody,
) =>
  request<IEditMedicationResponse, IEditMedicationBody>(
    `/medications/${medicationId}`,
    {
      method: "PATCH",
      body,
    },
  );

export const removeMedication = (medicationId: string) =>
  request<null>(`/medications/${medicationId}`, {
    method: "DELETE",
  });

export const fetchMedications = async ({
  search,
  page = 1,
  pageSize = 20,
  sortBy = "created_at",
  sortOrder = "desc",
  dosageForm,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "desc" | "asc";
  dosageForm?: TGetAllMedicationsParams["dosage_form"];
}) => {
  const response = await getAllMedications({
    // patient_ids: patientIds,
    page,
    page_size: pageSize,
    sort_by: sortBy,
    sort_order: sortOrder,
    dosage_form: dosageForm ?? null,
    search: search?.trim() || null,
  });

  return response;
};

export const fetchMedicationDetail = async (id: string) => {
  const detail = await getMedicationDetail(id);
  return detail;
};

export const fetchMedicationPatientMap = async () => {
  const medications = await fetchMedications({});
  return medications.list.map((item) => ({
    medicationId: item.id,
    patientId: item.patient_id,
  }));
};

export const fetchMedicationsByPatient = async (
  patientId: string,
  search?: string,
) => {
  const response = await getMedicationList(patientId, {
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    sort_by: "created_at",
    sort_order: "desc",
    search: search?.trim() || null,
  });

  return response;
};

export const createMedication = async (
  payload: IREQ_MedicationPayload,
) => {
  const created = await createMedicationForPatient(
    payload.patientId,
    {
      name: payload.name,
      dosage_form: payload.dosageForm,
      note: payload.memo,
    },
  );

  return fetchMedicationDetail(created.id);
};

export const updateMedication = async (
  id: string,
  payload: Partial<IREQ_MedicationPayload>,
) => {
  const body: IEditMedicationBody = {};

  if ("name" in payload) {
    body.name = payload.name ?? null;
  }
  if ("dosageForm" in payload) {
    body.dosage_form = payload.dosageForm ?? null;
  }
  if ("memo" in payload) {
    body.note = payload.memo ?? null;
  }

  await editMedication(id, body);
  return fetchMedicationDetail(id);
};

export const deleteMedication = async (id: string) => {
  await removeMedication(id);
};
