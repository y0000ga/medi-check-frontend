import {
  PermissionLevel,
} from "../api/care-invitation";

export interface ICreateInvitationInput {
  email: string;
  permission: PermissionLevel;
}
