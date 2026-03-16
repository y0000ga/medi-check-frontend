import dayjs from 'dayjs';

import { RES_SCHEDULES } from '@/constants/mock';
import { IDB_Schedule } from '@/types/db';
import { scheduleMatchesDate } from '@/utils/schedule';

import { request } from './client';

let mockSchedules = [...RES_SCHEDULES];

export async function fetchSchedules({
  patientId,
  date,
}: {
  patientId?: string;
  date?: string;
} = {}) {
  // return request<IDB_Schedule[]>(`/schedules?patientId=${patientId ?? ''}&date=${date ?? ''}`);
  const targetDate = date ? dayjs(date) : null;

  return mockSchedules.filter((schedule) => {
    if (patientId && schedule.patientId !== patientId) {
      return false;
    }

    if (targetDate && !scheduleMatchesDate(schedule, targetDate)) {
      return false;
    }

    return true;
  });
}

export async function fetchScheduleDetail(id: string) {
  // return request<IDB_Schedule>(`/schedules/${id}`);
  return mockSchedules.find((item) => item.id === id);
}

export async function createSchedule(payload: Omit<IDB_Schedule, 'id'>) {
  // return request<IDB_Schedule>('/schedules', {
  //   method: 'POST',
  //   body: JSON.stringify(payload),
  // });

  const createdSchedule: IDB_Schedule = {
    ...payload,
    id: dayjs().valueOf().toString(),
  };

  mockSchedules = [...mockSchedules, createdSchedule];

  return createdSchedule;
}

export async function updateSchedule(id: string, payload: Partial<IDB_Schedule>) {
  // return request<IDB_Schedule>(`/schedules/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(payload),
  // });

  const existingSchedule = mockSchedules.find((item) => item.id === id);

  if (!existingSchedule) {
    throw new Error('Schedule not found');
  }

  const updatedSchedule: IDB_Schedule = {
    ...existingSchedule,
    ...payload,
    id,
  };

  mockSchedules = mockSchedules.map((item) => item.id === id ? updatedSchedule : item);

  return updatedSchedule;
}

export async function deleteSchedule(id: string) {
  // return request<{ success: boolean }>(`/schedules/${id}`, {
  //   method: 'DELETE',
  // });

  mockSchedules = mockSchedules.filter((item) => item.id !== id);
}
