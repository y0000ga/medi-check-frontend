import { DB_MEDICATIONS, RES_MEDICATIONS } from "@/constants/mock";
import { request } from "./client";

import dayjs from "dayjs";
import { IRES_Medication } from "@/types/api";

let mockMedications: IRES_Medication[] = RES_MEDICATIONS.map(
  (item) => ({
    ...item,
    patientId:
      DB_MEDICATIONS.find((medication) => medication.id === item.id)
        ?.patientId ?? "",
  }),
);

export const fetchMedications = async ({
  search,
}: {
  search?: string;
}) => {
  const searchParams = new URLSearchParams();
  search && searchParams.append("search", search);
  // return request<IMedication[]>(`/medications?${searchParams.toString()}`);

  return mockMedications.filter((item) => {
    const keyword = search?.trim().toLowerCase();
    const isExistedSearch = keyword
      ? item.name.toLowerCase().includes(keyword) ||
        item.memo.toLowerCase().includes(keyword)
      : true;
    return isExistedSearch;
  });
};

export const fetchMedicationDetail = async (id: string) => {
  // return request<IMedication>(`/medications/${id}`);
  return mockMedications.find((item) => item.id === id);
};

export const fetchMedicationPatientMap = async () => {
  return DB_MEDICATIONS.map((item) => ({
    medicationId: item.id,
    patientId: item.patientId,
  }));
};

export const fetchMedicationsByPatient = async (
  patientId: string,
) => {
  const patientMap = await fetchMedicationPatientMap();
  const targetMedicationIds = patientMap
    .filter((item) => item.patientId === patientId)
    .map((item) => item.medicationId);

  return mockMedications.filter((item) =>
    targetMedicationIds.includes(item.id),
  );
};

export const createMedication = async (
  payload: Omit<IRES_Medication, "id">,
) => {
  // return request<IMedication>('/medications', {
  //   method: 'POST',
  //   body: JSON.stringify(payload),
  // });

  const createdMedication = {
    ...payload,
    memo: payload.memo ?? "",
    id: dayjs().toString(),
  };
  mockMedications = [...mockMedications, createdMedication];
  return createdMedication;
};

export const updateMedication = async (
  id: string,
  payload: Partial<IRES_Medication>,
) => {
  // return request<IMedication>(`/medications/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(payload),
  // });

  const existedMedication = mockMedications.find(
    (item) => item.id === id,
  );

  if (!existedMedication) {
    throw new Error("Medication not found");
  }

  const updatedMedication = {
    ...existedMedication,
    ...payload,
    id,
  } as IRES_Medication;
  mockMedications = mockMedications.map((item) =>
    item.id === id ? updatedMedication : item,
  );

  return updatedMedication;
};

export const deleteMedication = async (id: string) => {
  // return request<{ success: boolean }>(`/medications/${id}`, {
  //   method: 'DELETE',
  // });

  mockMedications = mockMedications.filter((item) => item.id !== id);
};
