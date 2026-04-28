import {
  Medication,
  MedicationDetail,
  MedicationFormValues,
  SaveMedicationPayload,
} from "./types";
import {
  CreateMedicationBodyApi,
  MedicationDetailApi,
  MedicationListItemApi,
  UpdateMedicationBodyApi,
} from "@/types/api/medication";

export const mapMedicationFromApi = (
  medication: MedicationListItemApi,
): Medication => ({
  id: medication.id,
  patientId: medication.patient_id,
  patientName: medication.patient_name,
  name: medication.name,
  dosageForm: medication.dosage_form,
});

export const mapMedicationDetailFromApi = (
  medication: MedicationDetailApi,
): MedicationDetail => ({
  ...mapMedicationFromApi(medication),
  note: medication.note,
  permissionLevel: medication.permission_level,
});

export const mapMedicationToFormValues = (
  medication: MedicationDetail,
): MedicationFormValues => ({
  id: medication.id,
  patientId: medication.patientId,
  patientName: medication.patientName,
  name: medication.name,
  dosageForm: medication.dosageForm,
  note: medication.note ?? "",
});

export const mapMedicationPayloadToCreateApi = (
  payload: SaveMedicationPayload,
): CreateMedicationBodyApi => ({
  name: payload.name,
  dosage_form: payload.dosageForm,
  note: payload.note,
});

export const mapMedicationPayloadToUpdateApi = (
  payload: Partial<SaveMedicationPayload>,
): UpdateMedicationBodyApi => {
  const body: UpdateMedicationBodyApi = {};

  if ("name" in payload) {
    body.name = payload.name ?? null;
  }

  if ("dosageForm" in payload) {
    body.dosage_form = payload.dosageForm ?? null;
  }

  if ("note" in payload) {
    body.note = payload.note ?? null;
  }

  return body;
};
