import { ICreateInvitationBody } from "@/types/api/care-invitation";
import { ICreateInvitationInput } from "@/types/schemas/care-invitation";

export const createInvtationSchema = (
  input: ICreateInvitationInput,
): ICreateInvitationBody => {
  if (!input.email) {
    throw new Error("未輸入受邀請者 Email");
  }

  return {
    invitee_email: input.email,
    permission_level: input.permission,
  };
};
