

import { HistoryDetail, HistoryDetailApi, HistoryItem, HistoryItemApi } from "./types";

export const mapHistoryItemFromApi = (
  history: HistoryItemApi,
): HistoryItem => ({
  id: history.id,
  patientId: history.patient_snapshot.id,
  patientName: history.patient_snapshot.name,
  medicationId: history.medication_snapshot.id,
  medicationName: history.medication_snapshot.name,
  medicationDosageForm: history.medication_snapshot.dosage_form,
  scheduleId: history.schedule_snapshot.id,
  scheduledTime: history.schedule_snapshot.scheduled_at,
  amount: history.schedule_snapshot.amount,
  doseUnit: history.schedule_snapshot.dose_unit,
  intakenTime: history.intake_at,
  status: history.status,
  source: history.source,
  takenAmount: history.taken_amount,
});

export const mapHistoryDetailFromApi = (
  history: HistoryDetailApi,
): HistoryDetail => ({
  ...mapHistoryItemFromApi(history),
  memo: history.memo,
  feeling: history.feeling != null ? Number(history.feeling) : null,
  rate: null,
  reason: null,
  symptomTags: [],
});
