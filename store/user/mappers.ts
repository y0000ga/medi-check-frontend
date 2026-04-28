import { ApiUserResponse, CurrentUser } from "./types";

export const mapCurrentUserFromApi = (
  user: ApiUserResponse,
): CurrentUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatarUrl: user.avatar_url,
  isEmailVerified: user.is_email_verified,
  status: user.status,
  patientId: user.patient_id,
});
