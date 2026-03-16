import dayjs from 'dayjs';

import { deriveHistoriesByDate } from '@/constants/mock';
import { IRES_History } from '@/types/api';

import { request } from './client';

let mockHistories = deriveHistoriesByDate(dayjs());
const historyOverrides = new Map<string, IRES_History>();

const applyOverrides = (histories: IRES_History[]) =>
  histories.map((history) => historyOverrides.get(history.id) ?? history);

const findHistoryAcrossDates = (id: string) => {
  for (let offset = -30; offset <= 30; offset += 1) {
    const candidate = deriveHistoriesByDate(dayjs().add(offset, 'day')).find((item) => item.id === id);
    if (candidate) {
      return historyOverrides.get(id) ?? candidate;
    }
  }

  return historyOverrides.get(id);
};

export async function fetchHistories(date?: string) {
  // return request<IRES_History[]>(`/histories?date=${date ?? ''}`);
  const targetDate = date ? dayjs(date) : dayjs();
  mockHistories = applyOverrides(deriveHistoriesByDate(targetDate));
  return mockHistories;
}

export async function fetchHistoryDetail(id: string) {
  // return request<IRES_History>(`/histories/${id}`);
  const cached = mockHistories.find((item) => item.id === id);
  if (cached) {
    return historyOverrides.get(id) ?? cached;
  }

  return findHistoryAcrossDates(id);
}

export async function updateHistory(id: string, payload: Partial<IRES_History>) {
  // return request<IRES_History>(`/histories/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(payload),
  // });
  const existing = await fetchHistoryDetail(id);

  if (!existing) {
    throw new Error('History not found');
  }

  const updated: IRES_History = {
    ...existing,
    ...payload,
    id,
  };

  historyOverrides.set(id, updated);
  mockHistories = mockHistories.map((item) => item.id === id ? updated : item);

  return updated;
}
