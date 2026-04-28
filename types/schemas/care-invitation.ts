import { PermissionLevel } from "../../store/care-invitation/type";

export interface ICreateInvitationInput {
  email: string;
  permission: PermissionLevel;
}
