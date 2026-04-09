import { PermissionLevel, RelationShipStatus } from "./care";
import {
  DosageForm,
  DoseUnit,
  FrequencyUnit,
  UserStatus,
  Weekday,
} from "./common";
import {
  HistorySource,
  HistoryStatus,
  ScheduleEndType,
} from "./domain";

export interface IDB_User {
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

export interface IDB_Patient {
  id: string;
  ownerUserId: IDB_User["id"] | null;
  name: string;
  birthDate: string | null;
  avatarUrl: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IDB_CareRelationship {
  id: string;
  caregiverUserId: IDB_User["id"] | null;
  patientId: IDB_Patient["id"];
  inviteeEmail: IDB_User["email"] | null;
  invitedByUserId: IDB_User["id"] | null;
  permissionLevel: PermissionLevel;
  status: RelationShipStatus;
  acceptedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IDB_Medication {
  id: string;
  patientId: IDB_Patient["id"];
  name: string;
  dosageForm: DosageForm;
  memo: string | null;
}

export interface IDB_Schedule {
  id: string;
  patientId: IDB_Patient["id"];
  medicationId: IDB_Medication["id"];
  timezone: string;
  startAt: string;
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

export interface IDB_History {
  id: string;
  scheduleId: IDB_Schedule["id"];
  scheduledTime: string;
  intakenTime: string | null;
  status: HistoryStatus;
  rate: number | null;
  takenAmount: number | null;
  memo: string | null;
  feeling: string | null;
  reason: string | null;
  source: HistorySource;
  symptomTags: string[];
  medicationIdSnapshot: IDB_Medication["id"];
  medicationNameSnapshot: IDB_Medication["name"];
  medicationDosageFormSnapshot: IDB_Medication["dosageForm"] | null;
  amountSnapshot: IDB_Schedule["amount"];
  doseUnitSnapshot: IDB_Schedule["doseUnit"];
}
