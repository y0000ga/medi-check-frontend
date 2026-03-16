export interface User {
  id: string
  email: string
  name: string
  passwordHash: string | null
  avatarUrl: string | null
  isEmailVerified: boolean
  status: "active" | "invited" | "disabled"
  createdAt: string
  updatedAt: string
}

export interface IDB_UserSession {
  id: string
  userId: User["id"]
  refreshTokenHash: string
  userAgent: string | null
  ipAddress: string | null
  expiresAt: string
  revokedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string | null
  expiresIn: number
  tokenType: "Bearer"
  user: Omit<User, "passwordHash">
}

export interface SignInResponse {
  session: AuthSession
  requiresEmailVerification: boolean
}

export interface Patient {
  id: string
  ownerUserId: string | null
  name: string
  birthDate: string | null
  avatarUrl: string | null
  note: string | null
  createdAt: string
  updatedAt: string
}

export interface CareRelationship {
  id: string
  caregiverUserId: string | null
  patientId: string
  inviteeEmail: string | null
  invitedByUserId: string | null
  permissionLevel: "read" | "write" | "admin"
  status: "active" | "invited" | "revoked"
  acceptedAt: string | null
  revokedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Medication {
  id: string
  patientId: string
  name: string
  dosageForm: "tablet" | "capsule" | "softgel" | "liquid" | "powder" | "pill" | "spray"
  memo: string | null
  createdAt: string
  updatedAt: string
}

export interface Schedule {
  id: string
  patientId: string
  medicationId: string
  timezone: string
  startAt: string
  timeSlots: string[]
  amount: number
  doseUnit: "mg" | "ml" | "tablet" | "capsule" | "package" | "drop" | null
  frequencyUnit: "day" | "week" | "month" | "year" | null
  interval: number | null
  weekdays: number[] | null
  endType: "never" | "until" | "count" | null
  untilDate: string | null
  occurrenceCount: number | null
  createdAt: string
  updatedAt: string
}

export interface History {
  id: string
  scheduleId: string
  scheduledTime: string
  intakenTime: string | null
  status: "pending" | "taken" | "missed"
  rate: number | null
  takenAmount: number | null
  memo: string | null
  feeling: string | null
  reason: string | null
  source: "manual" | "quickCheck" | "system"
  symptomTags: string[]
  medicationIdSnapshot: string
  medicationNameSnapshot: string
  medicationDosageFormSnapshot: string | null
  amountSnapshot: number
  doseUnitSnapshot: string | null
  createdAt: string
  updatedAt: string
}
