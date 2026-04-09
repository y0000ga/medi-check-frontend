import { TPaginationParams } from "./base";
import { PermissionLevel, Role } from "./care-invitation";

export interface ICareRelationship {
  id: string;
  caregiver_user_id: string;
  caregiver_name: string;
  created_by_user_id: string;
  patient_id: string;
  patient_name: string;
  permission_level: PermissionLevel;
}

export type TGetCareRelationshipParams = TPaginationParams & {
  permission_level?: PermissionLevel | null;
  direction?: Role | null;
};
