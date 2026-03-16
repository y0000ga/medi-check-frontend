import dayjs from "dayjs";

import { PermissionLevel, RelationShipStatus } from "@/types/care";
import { DosageForm, DoseUnit, FrequencyUnit, UserStatus, Weekday } from "@/types/common";
import { HistorySource, HistoryStatus, ScheduleEndType } from "@/types/domain";
import {
    IDB_CareRelationship,
    IDB_History,
    IDB_Medication,
    IDB_Patient,
    IDB_Schedule,
    IDB_User,
    IRES_CarePatientSummary,
    IRES_CareRelationship,
    IRES_Event,
    IRES_History,
    IRES_Medication,
    IRES_Patient,
    IRES_User
} from "@/types/mock";

const NOW = dayjs();
const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Taipei";

const DB_USERS: IDB_User[] = [
    {
        id: "u1",
        email: "demo@medicheck.app",
        name: "Demo User",
        passwordHash: "demo1234",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Demo+User",
        isEmailVerified: true,
        status: UserStatus.active,
        createdAt: NOW.subtract(120, "day").toISOString(),
        updatedAt: NOW.subtract(2, "hour").toISOString(),
    },
    {
        id: "u2",
        email: "amy.chen@medicheck.app",
        name: "Amy Chen",
        passwordHash: "amy1234",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Amy+Chen",
        isEmailVerified: true,
        status: UserStatus.active,
        createdAt: NOW.subtract(90, "day").toISOString(),
        updatedAt: NOW.subtract(1, "day").toISOString(),
    },
    {
        id: "u3",
        email: "kevin.lin@medicheck.app",
        name: "Kevin Lin",
        passwordHash: "kevin1234",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Kevin+Lin",
        isEmailVerified: false,
        status: UserStatus.active,
        createdAt: NOW.subtract(45, "day").toISOString(),
        updatedAt: NOW.subtract(6, "day").toISOString(),
    },
    {
        id: "u4",
        email: "sophie.wang@medicheck.app",
        name: "Sophie Wang",
        passwordHash: null,
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Sophie+Wang",
        isEmailVerified: true,
        status: UserStatus.active,
        createdAt: NOW.subtract(30, "day").toISOString(),
        updatedAt: NOW.subtract(12, "hour").toISOString(),
    },
    {
        id: "u5",
        email: "invited.user@medicheck.app",
        name: "Invited User",
        passwordHash: null,
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Invited+User",
        isEmailVerified: false,
        status: UserStatus.invited,
        createdAt: NOW.subtract(7, "day").toISOString(),
        updatedAt: NOW.subtract(7, "day").toISOString(),
    },
    {
        id: "u6",
        email: "disabled.user@medicheck.app",
        name: "Disabled User",
        passwordHash: "disabled1234",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Disabled+User",
        isEmailVerified: true,
        status: UserStatus.disabled,
        createdAt: NOW.subtract(200, "day").toISOString(),
        updatedAt: NOW.subtract(40, "day").toISOString(),
    }
];

export const RES_USERS: IRES_User[] = DB_USERS.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    isEmailVerified: user.isEmailVerified,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
}));

export const DB_PATIENTS: IDB_Patient[] = [
    {
        id: "p0",
        ownerUserId: "u1",
        name: "Demo User",
        birthDate: "1992-06-18",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Demo+User+Patient",
        note: "Self-managed profile for the demo account.",
        createdAt: NOW.subtract(120, "day").toISOString(),
        updatedAt: NOW.subtract(2, "day").toISOString(),
    },
    {
        id: "p1",
        ownerUserId: null,
        name: "Lin Grandma",
        birthDate: "1948-10-12",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Lin+Grandma",
        note: "Needs gentle reminders and usually takes morning medication after breakfast.",
        createdAt: NOW.subtract(120, "day").toISOString(),
        updatedAt: NOW.subtract(2, "day").toISOString(),
    },
    {
        id: "p2",
        ownerUserId: "u2",
        name: "Amy Chen",
        birthDate: "1990-04-28",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Amy+Chen+Patient",
        note: "Tracks supplements and allergy medication.",
        createdAt: NOW.subtract(90, "day").toISOString(),
        updatedAt: NOW.subtract(1, "day").toISOString(),
    },
    {
        id: "p3",
        ownerUserId: "u3",
        name: "Kevin Lin",
        birthDate: "1987-09-15",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Kevin+Lin+Patient",
        note: "Needs recurring reminders for recovery medications.",
        createdAt: NOW.subtract(45, "day").toISOString(),
        updatedAt: NOW.subtract(6, "day").toISOString(),
    },
    {
        id: "p4",
        ownerUserId: null,
        name: "Uncle Wu",
        birthDate: "1956-01-19",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Uncle+Wu",
        note: "Family-managed profile without direct login access.",
        createdAt: NOW.subtract(18, "day").toISOString(),
        updatedAt: NOW.subtract(3, "day").toISOString(),
    },
];

export const RES_PATIENTS: IRES_Patient[] = DB_PATIENTS.map((patient) => ({
    id: patient.id,
    ownerUserId: patient.ownerUserId,
    name: patient.name,
    birthDate: patient.birthDate,
    avatarUrl: patient.avatarUrl,
    note: patient.note,
    createdAt: patient.createdAt,
    updatedAt: patient.updatedAt,
}));

export const DB_CARE_RELATIONSHIPS: IDB_CareRelationship[] = [
    {
        id: "care-01",
        caregiverUserId: "u1",
        patientId: "p1",
        inviteeEmail: "demo@medicheck.app",
        invitedByUserId: "u1",
        permissionLevel: PermissionLevel.admin,
        status: RelationShipStatus.active,
        acceptedAt: NOW.subtract(120, "day").toISOString(),
        revokedAt: null,
        createdAt: NOW.subtract(120, "day").toISOString(),
        updatedAt: NOW.subtract(2, "day").toISOString(),
    },
    {
        id: "care-02",
        caregiverUserId: "u1",
        patientId: "p2",
        inviteeEmail: "demo@medicheck.app",
        invitedByUserId: "u2",
        permissionLevel: PermissionLevel.admin,
        status: RelationShipStatus.active,
        acceptedAt: NOW.subtract(90, "day").toISOString(),
        revokedAt: null,
        createdAt: NOW.subtract(90, "day").toISOString(),
        updatedAt: NOW.subtract(1, "day").toISOString(),
    },
    {
        id: "care-03",
        caregiverUserId: "u2",
        patientId: "p1",
        inviteeEmail: "amy.chen@medicheck.app",
        invitedByUserId: "u1",
        permissionLevel: PermissionLevel.read,
        status: RelationShipStatus.active,
        acceptedAt: NOW.subtract(30, "day").toISOString(),
        revokedAt: null,
        createdAt: NOW.subtract(30, "day").toISOString(),
        updatedAt: NOW.subtract(7, "day").toISOString(),
    },
    {
        id: "care-05",
        caregiverUserId: "u3",
        patientId: "p3",
        inviteeEmail: "kevin.lin@medicheck.app",
        invitedByUserId: "u3",
        permissionLevel: PermissionLevel.admin,
        status: RelationShipStatus.active,
        acceptedAt: NOW.subtract(45, "day").toISOString(),
        revokedAt: null,
        createdAt: NOW.subtract(45, "day").toISOString(),
        updatedAt: NOW.subtract(6, "day").toISOString(),
    },
    {
        id: "care-06",
        caregiverUserId: null,
        patientId: "p4",
        inviteeEmail: "future.caregiver@medicheck.app",
        invitedByUserId: "u1",
        permissionLevel: PermissionLevel.read,
        status: RelationShipStatus.invited,
        acceptedAt: null,
        revokedAt: null,
        createdAt: NOW.subtract(5, "day").toISOString(),
        updatedAt: NOW.subtract(5, "day").toISOString(),
    },
];

export const RES_CARE_RELATIONSHIPS: IRES_CareRelationship[] = DB_CARE_RELATIONSHIPS.map((relationship) => ({
    id: relationship.id,
    caregiverUserId: relationship.caregiverUserId,
    patientId: relationship.patientId,
    inviteeEmail: relationship.inviteeEmail,
    invitedByUserId: relationship.invitedByUserId,
    permissionLevel: relationship.permissionLevel,
    status: relationship.status,
    acceptedAt: relationship.acceptedAt,
    revokedAt: relationship.revokedAt,
    createdAt: relationship.createdAt,
    updatedAt: relationship.updatedAt,
}));

const MEDICATION_SEEDS = [
    { id: "med-01", name: "Vitamin C", dosageForm: DosageForm.Softgel, memo: "Take after breakfast if stomach feels sensitive." },
    { id: "med-02", name: "Omega 3", dosageForm: DosageForm.Softgel, memo: "Keep with lunch box on office days." },
    { id: "med-03", name: "Pain Relief", dosageForm: DosageForm.Pill, memo: "Only use when headache or muscle soreness shows up." },
    { id: "med-04", name: "Eye Drops", dosageForm: DosageForm.Liquid, memo: "Remove contact lenses before using." },
    { id: "med-05", name: "Nasal Spray", dosageForm: DosageForm.Spray, memo: "Do not exceed the prescribed daily number of sprays." },
    { id: "med-06", name: "Cough Syrup", dosageForm: DosageForm.Liquid, memo: "Use the measuring cup stored in the top drawer." },
    { id: "med-07", name: "Calcium", dosageForm: DosageForm.Tablet, memo: "Prefer taking at night, away from iron supplement." },
    { id: "med-08", name: "Probiotic", dosageForm: DosageForm.Capsule, memo: "Keep refrigerated after opening." },
    { id: "med-09", name: "Protein Powder", dosageForm: DosageForm.Powder, memo: "Mix with 300ml of water after exercise." },
    { id: "med-10", name: "Vitamin D", dosageForm: DosageForm.Tablet, memo: "Take together with a meal that includes fat." },
    { id: "med-11", name: "Iron Supplement", dosageForm: DosageForm.Tablet, memo: "Avoid tea or coffee within one hour." },
    { id: "med-12", name: "Allergy Relief", dosageForm: DosageForm.Pill, memo: "May cause drowsiness on the first few doses." },
    { id: "med-13", name: "Sleep Aid", dosageForm: DosageForm.Capsule, memo: "Only take when already ready for bed." },
    { id: "med-14", name: "Digestive Enzyme", dosageForm: DosageForm.Capsule, memo: "Best taken right before heavier meals." },
    { id: "med-15", name: "Skin Ointment", dosageForm: DosageForm.Liquid, memo: "Apply only to the affected area after cleansing." },
    { id: "med-16", name: "B Complex", dosageForm: DosageForm.Tablet, memo: "Take in the morning to avoid sleep disruption." },
    { id: "med-17", name: "Electrolyte Mix", dosageForm: DosageForm.Powder, memo: "Use more often on days with intense outdoor activity." },
    { id: "med-18", name: "Cold Relief", dosageForm: DosageForm.Capsule, memo: "Stop once fever and sore throat have resolved." },
];

const MEDICATION_PATIENT_BY_INDEX: Partial<Record<number, IDB_Patient["id"]>> = {
    0: "p0",
    1: "p1",
    2: "p1",
    3: "p2",
    4: "p1",
    5: "p1",
    6: "p0",
    7: "p1",
    8: "p1",
    9: "p2",
    10: "p2",
    11: "p2",
    12: "p1",
    13: "p2",
    14: "p1",
    15: "p0",
    16: "p2",
    17: "p1",
};

export const DB_MEDICATIONS: IDB_Medication[] = MEDICATION_SEEDS.map((item, index) => ({
    ...item,
    patientId: MEDICATION_PATIENT_BY_INDEX[index] ?? "p1",
}));

export const RES_MEDICATIONS: IRES_Medication[] = DB_MEDICATIONS.map(({ id, patientId, name, dosageForm, memo }) => ({
    id,
    patientId,
    name,
    dosageForm,
    memo: memo ?? "",
}));

type ScheduleSeed = Omit<IDB_Schedule, "patientId" | "medicationId" | "timezone" | "id"> & { medicationIndex: number };

const SCHEDULE_SEEDS: ScheduleSeed[] = [
    {
        medicationIndex: 0,
        startAt: NOW.subtract(8, "day").hour(7).minute(30).second(0).millisecond(0).toISOString(),
        timeSlots: ["07:30", "21:00"],
        amount: 1,
        doseUnit: DoseUnit.Capsule,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.never,
        untilDate: null,
        occurrenceCount: null,
    },
    {
        medicationIndex: 1,
        startAt: NOW.subtract(8, "day").hour(8).minute(0).second(0).millisecond(0).toISOString(),
        timeSlots: ["08:00", "18:00"],
        amount: 2,
        doseUnit: DoseUnit.Capsule,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.never,
        untilDate: null,
        occurrenceCount: null,
    },
    {
        medicationIndex: 2,
        startAt: NOW.subtract(14, "day").hour(9).minute(0).second(0).millisecond(0).toISOString(),
        timeSlots: ["09:00", "14:00", "21:30"],
        amount: 1,
        doseUnit: DoseUnit.Tablet,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.never,
        untilDate: null,
        occurrenceCount: null,
    },
    {
        medicationIndex: 3,
        startAt: NOW.subtract(10, "day").hour(10).minute(30).second(0).millisecond(0).toISOString(),
        timeSlots: ["10:30", "22:00"],
        amount: 2,
        doseUnit: DoseUnit.Drop,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.never,
        untilDate: null,
        occurrenceCount: null,
    },
    {
        medicationIndex: 4,
        startAt: NOW.subtract(21, "day").hour(11).minute(0).second(0).millisecond(0).toISOString(),
        timeSlots: ["11:00"],
        amount: 1,
        doseUnit: DoseUnit.Drop,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.never,
        untilDate: null,
        occurrenceCount: null,
    },
    {
        medicationIndex: 5,
        startAt: NOW.subtract(5, "day").hour(12).minute(30).second(0).millisecond(0).toISOString(),
        timeSlots: ["12:30", "20:30"],
        amount: 10,
        doseUnit: DoseUnit.Ml,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.until,
        untilDate: NOW.add(5, "day").toISOString(),
        occurrenceCount: null,
    },
    {
        medicationIndex: 6,
        startAt: NOW.subtract(30, "day").hour(13).minute(0).second(0).millisecond(0).toISOString(),
        timeSlots: ["07:00"],
        amount: 1,
        doseUnit: DoseUnit.Tablet,
        frequencyUnit: FrequencyUnit.Week,
        interval: 1,
        weekdays: [Weekday.Mon, Weekday.Wed, Weekday.Fri],
        endType: ScheduleEndType.never,
        untilDate: null,
        occurrenceCount: null,
    },
    {
        medicationIndex: 7,
        startAt: NOW.subtract(12, "day").hour(14).minute(0).second(0).millisecond(0).toISOString(),
        timeSlots: ["14:00", "22:30"],
        amount: 1,
        doseUnit: DoseUnit.Capsule,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.never,
        untilDate: null,
        occurrenceCount: null,
    },
    {
        medicationIndex: 8,
        startAt: NOW.subtract(18, "day").hour(15).minute(0).second(0).millisecond(0).toISOString(),
        timeSlots: ["15:00"],
        amount: 1,
        doseUnit: DoseUnit.Package,
        frequencyUnit: FrequencyUnit.Day,
        interval: 2,
        weekdays: null,
        endType: ScheduleEndType.never,
        untilDate: null,
        occurrenceCount: null,
    },
    {
        medicationIndex: 9,
        startAt: NOW.subtract(9, "day").hour(16).minute(0).second(0).millisecond(0).toISOString(),
        timeSlots: ["08:00"],
        amount: 1,
        doseUnit: DoseUnit.Tablet,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.count,
        untilDate: null,
        occurrenceCount: 30,
    },
    {
        medicationIndex: 10,
        startAt: NOW.subtract(40, "day").hour(17).minute(30).second(0).millisecond(0).toISOString(),
        timeSlots: ["07:30", "19:30"],
        amount: 2,
        doseUnit: DoseUnit.Tablet,
        frequencyUnit: FrequencyUnit.Week,
        interval: 1,
        weekdays: [Weekday.Tue, Weekday.Thu],
        endType: ScheduleEndType.never,
        untilDate: null,
        occurrenceCount: null,
    },
    {
        medicationIndex: 11,
        startAt: NOW.subtract(4, "day").hour(18).minute(0).second(0).millisecond(0).toISOString(),
        timeSlots: ["18:00"],
        amount: 1,
        doseUnit: DoseUnit.Tablet,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.until,
        untilDate: NOW.add(10, "day").toISOString(),
        occurrenceCount: null,
    },
    {
        medicationIndex: 12,
        startAt: NOW.subtract(15, "day").hour(21).minute(30).second(0).millisecond(0).toISOString(),
        timeSlots: ["21:30"],
        amount: 1,
        doseUnit: DoseUnit.Capsule,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.never,
        untilDate: null,
        occurrenceCount: null,
    },
    {
        medicationIndex: 13,
        startAt: NOW.subtract(25, "day").hour(6).minute(45).second(0).millisecond(0).toISOString(),
        timeSlots: ["06:45", "18:45"],
        amount: 1,
        doseUnit: DoseUnit.Capsule,
        frequencyUnit: FrequencyUnit.Week,
        interval: 1,
        weekdays: [Weekday.Mon, Weekday.Sat],
        endType: ScheduleEndType.count,
        untilDate: null,
        occurrenceCount: 16,
    },
    {
        medicationIndex: 14,
        startAt: NOW.subtract(7, "day").hour(19).minute(0).second(0).millisecond(0).toISOString(),
        timeSlots: ["19:00", "23:00"],
        amount: 5,
        doseUnit: DoseUnit.Ml,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.never,
        untilDate: null,
        occurrenceCount: null,
    },
    {
        medicationIndex: 15,
        startAt: NOW.subtract(90, "day").hour(8).minute(15).second(0).millisecond(0).toISOString(),
        timeSlots: ["08:15"],
        amount: 1,
        doseUnit: DoseUnit.Tablet,
        frequencyUnit: FrequencyUnit.Month,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.until,
        untilDate: NOW.add(120, "day").toISOString(),
        occurrenceCount: null,
    },
    {
        medicationIndex: 16,
        startAt: NOW.subtract(11, "day").hour(11).minute(45).second(0).millisecond(0).toISOString(),
        timeSlots: ["11:45", "17:45"],
        amount: 1,
        doseUnit: DoseUnit.Package,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.never,
        untilDate: null,
        occurrenceCount: null,
    },
    {
        medicationIndex: 17,
        startAt: NOW.subtract(3, "day").hour(22).minute(0).second(0).millisecond(0).toISOString(),
        timeSlots: ["08:30", "22:00"],
        amount: 2,
        doseUnit: DoseUnit.Capsule,
        frequencyUnit: FrequencyUnit.Day,
        interval: 1,
        weekdays: null,
        endType: ScheduleEndType.until,
        untilDate: NOW.add(14, "day").toISOString(),
        occurrenceCount: null,
    },
];

export const RES_SCHEDULES: IDB_Schedule[] = SCHEDULE_SEEDS.map((seed, index) => ({
    id: `sch-${String(index + 1).padStart(2, "0")}`,
    patientId: DB_MEDICATIONS[seed.medicationIndex].patientId,
    medicationId: DB_MEDICATIONS[seed.medicationIndex].id,
    timezone: DEFAULT_TIMEZONE,
    startAt: seed.startAt,
    timeSlots: seed.timeSlots,
    amount: seed.amount,
    doseUnit: seed.doseUnit,
    frequencyUnit: seed.frequencyUnit,
    interval: seed.interval,
    weekdays: seed.weekdays,
    endType: seed.endType,
    untilDate: seed.untilDate,
    occurrenceCount: seed.occurrenceCount,
}));

const buildOccurrenceTime = (schedule: IDB_Schedule, targetDate: dayjs.Dayjs, timeSlot: string) => {
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

const isWithinEndCondition = (schedule: IDB_Schedule, targetDate: dayjs.Dayjs) => {
    if (!schedule.endType || schedule.endType === ScheduleEndType.never) {
        return true;
    }

    if (schedule.endType === ScheduleEndType.until) {
        return schedule.untilDate ? !targetDate.isAfter(dayjs(schedule.untilDate), "day") : true;
    }

    return true;
};

const occursOnDate = (schedule: IDB_Schedule, targetDate: dayjs.Dayjs) => {
    const startAt = dayjs(schedule.startAt);
    const targetDay = targetDate.startOf("day");
    const startDay = startAt.startOf("day");

    if (targetDay.isBefore(startDay)) {
        return false;
    }

    if (!isWithinEndCondition(schedule, targetDay)) {
        return false;
    }

    if (!schedule.frequencyUnit) {
        return targetDay.isSame(startDay, "day");
    }

    const interval = schedule.interval ?? 1;

    switch (schedule.frequencyUnit) {
        case FrequencyUnit.Day: {
            const diffDays = targetDay.diff(startDay, "day");
            return diffDays % interval === 0;
        }
        case FrequencyUnit.Week: {
            const weekdays = schedule.weekdays && schedule.weekdays.length > 0 ? schedule.weekdays : [startAt.day()];
            const diffDays = targetDay.diff(startDay, "day");
            const weekOffset = Math.floor(diffDays / 7);

            return weekdays.includes(targetDay.day()) && weekOffset % interval === 0;
        }
        case FrequencyUnit.Month: {
            const diffMonths = targetDay.startOf("month").diff(startDay.startOf("month"), "month");
            return targetDay.date() === startAt.date() && diffMonths % interval === 0;
        }
        case FrequencyUnit.Year: {
            const diffYears = targetDay.startOf("year").diff(startDay.startOf("year"), "year");
            return (
                targetDay.date() === startAt.date() &&
                targetDay.month() === startAt.month() &&
                diffYears % interval === 0
            );
        }
        default:
            return false;
    }
};

const countOccurrencesUntil = (schedule: IDB_Schedule, targetDate: dayjs.Dayjs) => {
    let count = 0;
    let cursor = dayjs(schedule.startAt).startOf("day");

    while (cursor.isBefore(targetDate, "day") || cursor.isSame(targetDate, "day")) {
        if (occursOnDate(schedule, cursor)) {
            count += 1;
        }

        cursor = cursor.add(1, "day");
    }

    return count;
};

const matchesCountLimit = (schedule: IDB_Schedule, targetDate: dayjs.Dayjs) => {
    if (schedule.endType !== ScheduleEndType.count || !schedule.occurrenceCount) {
        return true;
    }

    return countOccurrencesUntil(schedule, targetDate) <= schedule.occurrenceCount;
};

const historyOccurrence = (scheduleId: string, dateOffset: number) => {
    const schedule = RES_SCHEDULES.find((item) => item.id === scheduleId);
    if (!schedule) {
        throw new Error(`Unknown schedule ${scheduleId}`);
    }

    return buildOccurrenceTime(schedule, NOW.add(dateOffset, "day"), schedule.timeSlots[0] ?? "08:00");
};

const DB_HISTORY_SEEDS: Omit<IDB_History, "takenAmount" | "memo" | "feeling" | "reason" | "source" | "symptomTags">[] = [
    { id: "his-01", scheduleId: "sch-01", scheduledTime: historyOccurrence("sch-01", 0), intakenTime: dayjs(historyOccurrence("sch-01", 0)).add(12, "minute").toISOString(), status: HistoryStatus.taken, rate: 5, medicationIdSnapshot: "med-01", medicationNameSnapshot: "Vitamin C", medicationDosageFormSnapshot: DosageForm.Softgel, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Capsule },
    { id: "his-02", scheduleId: "sch-02", scheduledTime: historyOccurrence("sch-02", 0), intakenTime: dayjs(historyOccurrence("sch-02", 0)).add(25, "minute").toISOString(), status: HistoryStatus.taken, rate: 4, medicationIdSnapshot: "med-02", medicationNameSnapshot: "Omega 3", medicationDosageFormSnapshot: DosageForm.Softgel, amountSnapshot: 2, doseUnitSnapshot: DoseUnit.Capsule },
    { id: "his-03", scheduleId: "sch-03", scheduledTime: historyOccurrence("sch-03", -1), intakenTime: dayjs(historyOccurrence("sch-03", -1)).add(18, "minute").toISOString(), status: HistoryStatus.taken, rate: 5, medicationIdSnapshot: "med-03", medicationNameSnapshot: "Pain Relief", medicationDosageFormSnapshot: DosageForm.Pill, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Tablet },
    { id: "his-04", scheduleId: "sch-04", scheduledTime: historyOccurrence("sch-04", -1), intakenTime: dayjs(historyOccurrence("sch-04", -1)).add(7, "minute").toISOString(), status: HistoryStatus.taken, rate: 4, medicationIdSnapshot: "med-04", medicationNameSnapshot: "Eye Drops", medicationDosageFormSnapshot: DosageForm.Liquid, amountSnapshot: 2, doseUnitSnapshot: DoseUnit.Drop },
    { id: "his-05", scheduleId: "sch-05", scheduledTime: historyOccurrence("sch-05", -2), intakenTime: dayjs(historyOccurrence("sch-05", -2)).add(5, "minute").toISOString(), status: HistoryStatus.taken, rate: 3, medicationIdSnapshot: "med-05", medicationNameSnapshot: "Nasal Spray", medicationDosageFormSnapshot: DosageForm.Spray, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Drop },
    { id: "his-06", scheduleId: "sch-06", scheduledTime: historyOccurrence("sch-06", -2), intakenTime: dayjs(historyOccurrence("sch-06", -2)).add(14, "minute").toISOString(), status: HistoryStatus.taken, rate: 4, medicationIdSnapshot: "med-06", medicationNameSnapshot: "Cough Syrup", medicationDosageFormSnapshot: DosageForm.Liquid, amountSnapshot: 10, doseUnitSnapshot: DoseUnit.Ml },
    { id: "his-07", scheduleId: "sch-07", scheduledTime: historyOccurrence("sch-07", -3), intakenTime: dayjs(historyOccurrence("sch-07", -3)).add(35, "minute").toISOString(), status: HistoryStatus.taken, rate: 5, medicationIdSnapshot: "med-07", medicationNameSnapshot: "Calcium", medicationDosageFormSnapshot: DosageForm.Tablet, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Tablet },
    { id: "his-08", scheduleId: "sch-08", scheduledTime: historyOccurrence("sch-08", -3), intakenTime: dayjs(historyOccurrence("sch-08", -3)).add(20, "minute").toISOString(), status: HistoryStatus.taken, rate: 4, medicationIdSnapshot: "med-08", medicationNameSnapshot: "Probiotic", medicationDosageFormSnapshot: DosageForm.Capsule, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Capsule },
    { id: "his-09", scheduleId: "sch-09", scheduledTime: historyOccurrence("sch-09", -4), intakenTime: dayjs(historyOccurrence("sch-09", -4)).add(30, "minute").toISOString(), status: HistoryStatus.taken, rate: 5, medicationIdSnapshot: "med-09", medicationNameSnapshot: "Protein Powder", medicationDosageFormSnapshot: DosageForm.Powder, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Package },
    { id: "his-10", scheduleId: "sch-10", scheduledTime: historyOccurrence("sch-10", -4), intakenTime: dayjs(historyOccurrence("sch-10", -4)).add(11, "minute").toISOString(), status: HistoryStatus.taken, rate: 5, medicationIdSnapshot: "med-10", medicationNameSnapshot: "Vitamin D", medicationDosageFormSnapshot: DosageForm.Tablet, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Tablet },
    { id: "his-11", scheduleId: "sch-11", scheduledTime: historyOccurrence("sch-11", -5), intakenTime: dayjs(historyOccurrence("sch-11", -5)).add(8, "minute").toISOString(), status: HistoryStatus.taken, rate: 3, medicationIdSnapshot: "med-11", medicationNameSnapshot: "Iron Supplement", medicationDosageFormSnapshot: DosageForm.Tablet, amountSnapshot: 2, doseUnitSnapshot: DoseUnit.Tablet },
    { id: "his-12", scheduleId: "sch-12", scheduledTime: historyOccurrence("sch-12", -5), intakenTime: dayjs(historyOccurrence("sch-12", -5)).add(16, "minute").toISOString(), status: HistoryStatus.taken, rate: 4, medicationIdSnapshot: "med-12", medicationNameSnapshot: "Allergy Relief", medicationDosageFormSnapshot: DosageForm.Pill, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Tablet },
    { id: "his-13", scheduleId: "sch-13", scheduledTime: historyOccurrence("sch-13", -6), intakenTime: dayjs(historyOccurrence("sch-13", -6)).add(22, "minute").toISOString(), status: HistoryStatus.taken, rate: 4, medicationIdSnapshot: "med-13", medicationNameSnapshot: "Sleep Aid", medicationDosageFormSnapshot: DosageForm.Capsule, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Capsule },
    { id: "his-14", scheduleId: "sch-14", scheduledTime: historyOccurrence("sch-14", -6), intakenTime: dayjs(historyOccurrence("sch-14", -6)).add(10, "minute").toISOString(), status: HistoryStatus.taken, rate: 5, medicationIdSnapshot: "med-14", medicationNameSnapshot: "Digestive Enzyme", medicationDosageFormSnapshot: DosageForm.Capsule, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Capsule },
    { id: "his-15", scheduleId: "sch-15", scheduledTime: historyOccurrence("sch-15", -7), intakenTime: dayjs(historyOccurrence("sch-15", -7)).add(28, "minute").toISOString(), status: HistoryStatus.taken, rate: 3, medicationIdSnapshot: "med-15", medicationNameSnapshot: "Skin Ointment", medicationDosageFormSnapshot: DosageForm.Liquid, amountSnapshot: 5, doseUnitSnapshot: DoseUnit.Ml },
    { id: "his-16", scheduleId: "sch-16", scheduledTime: historyOccurrence("sch-16", -30), intakenTime: dayjs(historyOccurrence("sch-16", -30)).add(8, "minute").toISOString(), status: HistoryStatus.taken, rate: 5, medicationIdSnapshot: "med-16", medicationNameSnapshot: "B Complex", medicationDosageFormSnapshot: DosageForm.Tablet, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Tablet },
    { id: "his-17", scheduleId: "sch-17", scheduledTime: historyOccurrence("sch-17", -1), intakenTime: dayjs(historyOccurrence("sch-17", -1)).add(17, "minute").toISOString(), status: HistoryStatus.taken, rate: 4, medicationIdSnapshot: "med-17", medicationNameSnapshot: "Electrolyte Mix", medicationDosageFormSnapshot: DosageForm.Powder, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Package },
    { id: "his-18", scheduleId: "sch-18", scheduledTime: historyOccurrence("sch-18", 0), intakenTime: dayjs(historyOccurrence("sch-18", 0)).add(9, "minute").toISOString(), status: HistoryStatus.taken, rate: 3, medicationIdSnapshot: "med-18", medicationNameSnapshot: "Cold Relief", medicationDosageFormSnapshot: DosageForm.Capsule, amountSnapshot: 2, doseUnitSnapshot: DoseUnit.Capsule },
    { id: "his-19", scheduleId: "sch-01", scheduledTime: buildOccurrenceTime(RES_SCHEDULES[0], NOW, "21:00"), intakenTime: dayjs(buildOccurrenceTime(RES_SCHEDULES[0], NOW, "21:00")).add(6, "minute").toISOString(), status: HistoryStatus.taken, rate: 4, medicationIdSnapshot: "med-01", medicationNameSnapshot: "Vitamin C", medicationDosageFormSnapshot: DosageForm.Softgel, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Capsule },
    { id: "his-20", scheduleId: "sch-02", scheduledTime: buildOccurrenceTime(RES_SCHEDULES[1], NOW.subtract(1, "day"), "18:00"), intakenTime: dayjs(buildOccurrenceTime(RES_SCHEDULES[1], NOW.subtract(1, "day"), "18:00")).add(15, "minute").toISOString(), status: HistoryStatus.taken, rate: 4, medicationIdSnapshot: "med-02", medicationNameSnapshot: "Omega 3", medicationDosageFormSnapshot: DosageForm.Softgel, amountSnapshot: 2, doseUnitSnapshot: DoseUnit.Capsule },
    { id: "his-21", scheduleId: "sch-03", scheduledTime: buildOccurrenceTime(RES_SCHEDULES[2], NOW.subtract(2, "day"), "21:30"), intakenTime: dayjs(buildOccurrenceTime(RES_SCHEDULES[2], NOW.subtract(2, "day"), "21:30")).add(20, "minute").toISOString(), status: HistoryStatus.taken, rate: 3, medicationIdSnapshot: "med-03", medicationNameSnapshot: "Pain Relief", medicationDosageFormSnapshot: DosageForm.Pill, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Tablet },
    { id: "his-22", scheduleId: "sch-08", scheduledTime: buildOccurrenceTime(RES_SCHEDULES[7], NOW, "22:30"), intakenTime: null, status: HistoryStatus.missed, rate: null, medicationIdSnapshot: "med-08", medicationNameSnapshot: "Probiotic", medicationDosageFormSnapshot: DosageForm.Capsule, amountSnapshot: 1, doseUnitSnapshot: DoseUnit.Capsule },
];

const HISTORY_MEMO_BY_ID: Partial<Record<string, string>> = {
    "his-01": "No stomach discomfort after breakfast.",
    "his-03": "Took after lunch because pain started to build up.",
    "his-06": "Kept the bottle in the kitchen for easier access.",
    "his-13": "Took a little later than planned because of overtime.",
    "his-18": "Also drank warm water and rested right away.",
};

const HISTORY_FEELING_BY_ID: Partial<Record<string, string>> = {
    "his-01": "Felt normal and energetic through the morning.",
    "his-03": "Headache eased within about half an hour.",
    "his-06": "Throat felt less irritated before bedtime.",
    "his-13": "Sleep came faster than usual.",
    "his-18": "Body aches improved slightly after the dose.",
};

const HISTORY_REASON_BY_ID: Partial<Record<string, string>> = {
    "his-03": "Headache started after a long meeting, so the dose was taken a bit later.",
    "his-13": "Bedtime shifted because of overtime.",
    "his-22": "Missed the late-night dose after falling asleep on the couch.",
};

const HISTORY_SOURCE_BY_ID: Partial<Record<string, IDB_History["source"]>> = {
    "his-22": HistorySource.system,
};

const HISTORY_SYMPTOM_TAGS_BY_ID: Partial<Record<string, string[]>> = {
    "his-03": ["headache", "muscle tension"],
    "his-06": ["sore throat", "cough"],
    "his-13": ["insomnia"],
    "his-18": ["fever", "body aches"],
    "his-22": ["bloating"],
};

const DB_HISTORIES: IDB_History[] = DB_HISTORY_SEEDS.map((history) => ({
    ...history,
    takenAmount: history.status === HistoryStatus.taken ? history.amountSnapshot : null,
    memo: HISTORY_MEMO_BY_ID[history.id] ?? null,
    feeling: HISTORY_FEELING_BY_ID[history.id] ?? null,
    reason: HISTORY_REASON_BY_ID[history.id] ?? null,
    source: HISTORY_SOURCE_BY_ID[history.id] ?? (history.status === HistoryStatus.missed ? HistorySource.system : HistorySource.quickCheck),
    symptomTags: HISTORY_SYMPTOM_TAGS_BY_ID[history.id] ?? [],
}));

const toResolvedHistory = (history: IDB_History): IRES_History => {
    const schedule = RES_SCHEDULES.find((item) => item.id === history.scheduleId);
    const patient = schedule ? DB_PATIENTS.find((item) => item.id === schedule.patientId) : undefined;

    return {
        id: history.id,
        scheduleId: history.scheduleId,
        patientId: schedule?.patientId ?? "",
        patientName: patient?.name ?? "Unknown Patient",
        scheduledTime: history.scheduledTime,
        intakenTime: history.intakenTime,
        status: history.status,
        rate: history.rate,
        takenAmount: history.takenAmount,
        memo: history.memo,
        feeling: history.feeling,
        reason: history.reason,
        source: history.source,
        symptomTags: history.symptomTags,
        medicationId: history.medicationIdSnapshot,
        medicationName: history.medicationNameSnapshot,
        medicationDosageForm: history.medicationDosageFormSnapshot,
        amount: history.amountSnapshot,
        doseUnit: history.doseUnitSnapshot,
    };
};

export const RES_HISTORIES: IRES_History[] = DB_HISTORIES
    .map(toResolvedHistory)
    .sort((a, b) => dayjs(a.scheduledTime).isBefore(dayjs(b.scheduledTime)) ? 1 : -1);

export const RES_CARE_PATIENTS: IRES_CarePatientSummary[] = DB_CARE_RELATIONSHIPS
    .map((relationship) => {
        if (!relationship.caregiverUserId) {
            return null;
        }

        const patient = DB_PATIENTS.find((item) => item.id === relationship.patientId);

        if (!patient) {
            return null;
        }

        return {
            patientId: patient.id,
            caregiverUserId: relationship.caregiverUserId,
            relationshipId: relationship.id,
            permissionLevel: relationship.permissionLevel,
            relationshipStatus: relationship.status,
            patientName: patient.name,
            patientAvatarUrl: patient.avatarUrl,
            patientBirthDate: patient.birthDate,
            patientNote: patient.note,
            ownerUserId: patient.ownerUserId,
        };
    })
    .filter((item): item is IRES_CarePatientSummary => item !== null);

export const deriveEventsByDate = (targetDate: dayjs.Dayjs) => {
    const list: IRES_Event[] = [];

    for (const schedule of RES_SCHEDULES) {
        if (!occursOnDate(schedule, targetDate) || !matchesCountLimit(schedule, targetDate)) {
            continue;
        }

        const medication = DB_MEDICATIONS.find((item) => item.id === schedule.medicationId);
        const patient = DB_PATIENTS.find((item) => item.id === schedule.patientId);

        if (!medication || !patient) {
            continue;
        }

        for (const timeSlot of schedule.timeSlots) {
            const scheduledTime = buildOccurrenceTime(schedule, targetDate, timeSlot);
            const history = DB_HISTORIES.find((item) =>
                item.scheduleId === schedule.id && item.scheduledTime === scheduledTime
            );
            const isMissed = !history && dayjs(scheduledTime).add(1, "hour").isBefore(NOW);

            list.push({
                id: `${schedule.id}:${scheduledTime}`,
                scheduleId: schedule.id,
                patientId: schedule.patientId,
                patientName: patient.name,
                scheduledTime,
                amount: schedule.amount,
                doseUnit: schedule.doseUnit,
                medicationId: medication.id,
                medicationName: medication.name,
                medicationDosageForm: medication.dosageForm,
                historyId: history ? history.id : null,
                status: history ? history.status : isMissed ? HistoryStatus.missed : HistoryStatus.pending,
                intakenTime: history ? history.intakenTime : null,
                rate: history ? history.rate : null,
                takenAmount: history ? history.takenAmount : null,
                memo: history ? history.memo : null,
                feeling: history ? history.feeling : null,
                reason: history ? history.reason : null,
                source: history ? history.source : isMissed ? HistorySource.system : HistorySource.quickCheck,
                symptomTags: history ? history.symptomTags : [],
            });
        }
    }

    return list.sort((a, b) => dayjs(a.scheduledTime).isAfter(dayjs(b.scheduledTime)) ? 1 : -1);
};

export const RES_EVENTS: IRES_Event[] = deriveEventsByDate(NOW);

export const deriveEventsByDateForPatient = (patientId: IDB_Patient["id"], targetDate: dayjs.Dayjs) =>
    deriveEventsByDate(targetDate).filter((event) => {
        const schedule = RES_SCHEDULES.find((item) => item.id === event.scheduleId);
        return schedule?.patientId === patientId;
    });

export const deriveHistoriesByDate = (targetDate: dayjs.Dayjs) => {
    const events = deriveEventsByDate(targetDate);

    return events
        .filter((event) => event.status !== "pending")
        .map<IRES_History>((event) => ({
            id: event.historyId ?? `missed:${event.id}`,
            scheduleId: event.scheduleId,
            patientId: RES_SCHEDULES.find((item) => item.id === event.scheduleId)?.patientId ?? "",
            patientName: DB_PATIENTS.find((item) => item.id === RES_SCHEDULES.find((schedule) => schedule.id === event.scheduleId)?.patientId)?.name ?? "Unknown Patient",
            scheduledTime: event.scheduledTime,
            intakenTime: event.intakenTime ?? null,
            status: event.status,
            rate: event.rate ?? null,
            takenAmount: event.takenAmount ?? (event.status === HistoryStatus.taken ? event.amount : null),
            memo: event.memo ?? null,
            feeling: event.feeling ?? null,
            reason: event.reason ?? null,
            source: event.source ?? (event.status === HistoryStatus.missed ? HistorySource.system : HistorySource.quickCheck),
            symptomTags: event.symptomTags ?? [],
            medicationId: event.medicationId,
            medicationName: event.medicationName,
            medicationDosageForm: event.medicationDosageForm,
            amount: event.amount,
            doseUnit: event.doseUnit,
        }))
        .sort((a, b) => dayjs(a.scheduledTime).isBefore(dayjs(b.scheduledTime)) ? 1 : -1);
};

export const deriveHistoriesByDateForPatient = (patientId: IDB_Patient["id"], targetDate: dayjs.Dayjs) =>
    deriveHistoriesByDate(targetDate).filter((history) => {
        const schedule = RES_SCHEDULES.find((item) => item.id === history.scheduleId);
        return schedule?.patientId === patientId;
    });
