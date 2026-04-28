import { PermissionLevel, RelationShipStatus } from "./care";
import {
  DosageForm,
  DoseUnit,
  FrequencyUnit,
  UserStatus,
  Weekday,
} from "./common";
import {
  HistoryStatus,
  ScheduleEndType,
} from "./domain";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PatientRecord {
  id: string;
  ownerUserId: UserRecord["id"] | null;
  name: string;
  birthDate: string | null;
  avatarUrl: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CareRelationshipRecord {
  id: string;
  caregiverUserId: UserRecord["id"] | null;
  patientId: PatientRecord["id"];
  inviteeEmail: UserRecord["email"] | null;
  invitedByUserId: UserRecord["id"] | null;
  permissionLevel: PermissionLevel;
  status: RelationShipStatus;
  acceptedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationRecord {
  id: string;
  patientId: PatientRecord["id"];
  name: string;
  dosageForm: DosageForm;
  memo: string | null;
}

export interface ScheduleRecord {
  id: string;
  patientId: PatientRecord["id"];
  medicationId: MedicationRecord["id"];
  timezone: string;
  startDate: string;
  timeSlots: string[];
  amount: number;
  doseUnit: DoseUnit | null;
  frequencyUnit: FrequencyUnit | null;
  interval: number | null;
  weekdays: Weekday[] | null;
  endType: ScheduleEndType | null;
  untilDate: string | null;
  occurrenceCount: number | null;
}

export interface HistoryRecord {
  id: string;
  scheduleId: ScheduleRecord["id"];
  scheduledTime: string;
  intakenTime: string | null;
  status: HistoryStatus;
  rate: number | null;
  takenAmount: number | null;
  memo: string | null;
  feeling: string | null;
  reason: string | null;
  symptomTags: string[];
  medicationIdSnapshot: MedicationRecord["id"];
  medicationNameSnapshot: MedicationRecord["name"];
  medicationDosageFormSnapshot: MedicationRecord["dosageForm"];
  amountSnapshot: ScheduleRecord["amount"];
  doseUnitSnapshot: ScheduleRecord["doseUnit"];
}


export enum HistorySource {
  manual="manual",
  sytstem="system",
  quickCheck="quickCheck"
}