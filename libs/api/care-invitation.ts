import {
  ICreateInvitationBody,
  IInvitation,
  Role,
  TGetInvitationListParams,
} from "@/types/api/care-invitation";
import { request } from "./client";
import { IPaginationResponse } from "@/types/api/base";

export const createInvitation = async (
  role: Role,
  body: ICreateInvitationBody,
) => {
  return request<{ id: string }, ICreateInvitationBody>(
    `/care-invitations/me/${role}`,
    { method: "POST", body },
  );
};

export const getInvitationList = async (
  params: TGetInvitationListParams,
) => {
  return request<
    IPaginationResponse<IInvitation>,
    undefined,
    TGetInvitationListParams
  >("/care-invitations", { params });
};
