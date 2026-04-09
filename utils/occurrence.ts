import dayjs from "dayjs";

import {
  IRES_History,
  IRES_Medication,
  IRES_Event,
} from "@/types/api";
import { IDB_Schedule } from "@/types/db";
import { HistorySource, HistoryStatus } from "@/types/domain";
import { scheduleMatchesDate } from "@/utils/schedule";

const buildOccurrenceTime = (
  schedule: IDB_Schedule,
  targetDate: dayjs.Dayjs,
  timeSlot: string,
) => {
  const [hourText, minuteText] = timeSlot.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  return targetDate
    .hour(Number.isFinite(hour) ? hour : 0)
    .minute(Number.isFinite(minute) ? minute : 0)
    .second(0)
    .millisecond(0)
    .toISOString();
};

export const deriveEventsFromClientData = ({
  schedules,
  medications,
  histories,
  targetDate,
  now = dayjs(),
}: {
  schedules: IDB_Schedule[];
  medications: IRES_Medication[];
  histories: IRES_History[];
  targetDate: dayjs.Dayjs;
  now?: dayjs.Dayjs;
}) => {
  const list: IRES_Event[] = [];

  for (const schedule of schedules) {
    if (!scheduleMatchesDate(schedule, targetDate)) {
      continue;
    }

    const medication = medications.find(
      (item) => item.id === schedule.medicationId,
    );
    if (!medication) {
      continue;
    }

    for (const timeSlot of schedule.timeSlots) {
      const scheduledTime = buildOccurrenceTime(
        schedule,
        targetDate,
        timeSlot,
      );
      const history = histories.find(
        (item) =>
          item.scheduleId === schedule.id &&
          item.scheduledTime === scheduledTime,
      );
      const isMissed =
        !history && dayjs(scheduledTime).add(1, "hour").isBefore(now);

      list.push({
        id: `${schedule.id}:${scheduledTime}`,
        scheduleId: schedule.id,
        patientId: schedule.patientId,
        patientName: history?.patientName ?? "",
        scheduledTime,
        amount: schedule.amount,
        doseUnit: schedule.doseUnit,
        medicationId: medication.id,
        medicationName: medication.name,
        medicationDosageForm: medication.dosageForm,
        historyId: history ? history.id : null,
        status: history
          ? history.status
          : isMissed
            ? HistoryStatus.missed
            : HistoryStatus.pending,
        intakenTime: history ? history.intakenTime : null,
        rate: history ? history.rate : null,
        takenAmount: history ? history.takenAmount : null,
        memo: history ? history.memo : null,
        feeling: history ? history.feeling : null,
        reason: history ? history.reason : null,
        source: history
          ? history.source
          : isMissed
            ? HistorySource.system
            : HistorySource.quickCheck,
        symptomTags: history ? history.symptomTags : [],
      });
    }
  }

  return list.sort((a, b) =>
    dayjs(a.scheduledTime).isAfter(dayjs(b.scheduledTime)) ? 1 : -1,
  );
};
