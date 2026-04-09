import {
  ICreateInvitationBody,
  ICreateInvitationResponse,
  IInvitation,
  IInvitationActionResponse,
  Role,
  TGetInvitationListParams,
} from "@/types/api/care-invitation";
import { request } from "./client";
import { IPaginationResponse } from "@/types/api/base";

export const createInvitation = async (
  role: Role,
  body: ICreateInvitationBody,
) => {
  return request<
    ICreateInvitationResponse,
    ICreateInvitationBody
  >(
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

export const revokeInvitation = (invitationId: string) =>
  request<IInvitationActionResponse>(
    `/care-invitations/${invitationId}/revoke`,
    { method: "POST" },
  );

export const declineInvitation = (invitationId: string) =>
  request<IInvitationActionResponse>(
    `/care-invitations/${invitationId}/decline`,
    { method: "POST" },
  );

export const acceptInvitation = (invitationId: string) =>
  request<IInvitationActionResponse>(
    `/care-invitations/${invitationId}/accept`,
    { method: "POST" },
  );
