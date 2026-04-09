import dayjs from "dayjs";

import { IRES_History } from "@/types/api";
import { IPaginationResponse } from "@/types/api/base";
import {
  IEditHistoryBody,
  IEditHistoryResponse,
  IHistory,
  IHistoryDetail,
  IQuickCheckHistoryBody,
  IQuickCheckHistoryResponse,
  TGetHistoriesParams,
} from "@/types/api/history";

import { getAccessiblePatientIds } from "./access";
import { request } from "./client";

const DEFAULT_PAGE_SIZE = 200;

const toHistoryResponse = (
  history: IHistory | IHistoryDetail,
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
  memo: "memo" in history ? history.memo : null,
  feeling:
    "feeling" in history && history.feeling != null
      ? String(history.feeling)
      : null,
  reason: null,
  source: history.source,
  symptomTags: [],
  medicationId: history.medication_id ?? "",
  medicationName: history.medication_name_snapshot,
  medicationDosageForm:
    "medication_dosage_form_snapshot" in history
      ? history.medication_dosage_form_snapshot
      : null,
  amount: history.amount_snapshot,
  doseUnit: history.dose_unit_snapshot,
});

export const getHistoryList = (params: TGetHistoriesParams) =>
  request<
    IPaginationResponse<IHistory>,
    undefined,
    TGetHistoriesParams
  >("/histories", { params });

export const getHistoryDetail = (historyId: string) =>
  request<IHistoryDetail>(`/histories/${historyId}`);

export const editHistory = (
  historyId: string,
  body: IEditHistoryBody,
) =>
  request<IEditHistoryResponse, IEditHistoryBody>(
    `/histories/${historyId}`,
    {
      method: "PATCH",
      body,
    },
  );

export const quickCheckHistory = (body: IQuickCheckHistoryBody) =>
  request<IQuickCheckHistoryResponse, IQuickCheckHistoryBody>(
    "/histories/quick-check",
    {
      method: "POST",
      body,
    },
  );

export const fetchHistories = async (date?: string) => {
  const patientIds = await getAccessiblePatientIds();
  if (!patientIds.length) {
    return [];
  }

  const targetDate = date ? dayjs(date) : dayjs();
  const params: TGetHistoriesParams = {
    patient_ids: patientIds,
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    sort_by: "scheduled_at",
    sort_order: "desc",
    from_date: targetDate.format("YYYY-MM-DD"),
    to_date: targetDate.format("YYYY-MM-DD"),
  };

  const response = await getHistoryList(params);
  return response.list.map(toHistoryResponse);
};

export const fetchHistoryDetail = async (id: string) => {
  const detail = await getHistoryDetail(id);
  return toHistoryResponse(detail);
};

export const updateHistory = async (
  id: string,
  payload: Partial<IRES_History>,
) => {
  const body: IEditHistoryBody = {};

  if ("intakenTime" in payload) {
    body.intake_at = payload.intakenTime ?? null;
  }
  if ("takenAmount" in payload) {
    body.taken_amount = payload.takenAmount ?? null;
  }
  if ("memo" in payload) {
    body.memo = payload.memo ?? null;
  }
  if ("feeling" in payload) {
    body.feeling = payload.feeling
      ? Number(payload.feeling) || null
      : null;
  }

  await editHistory(id, body);
  return fetchHistoryDetail(id);
};
