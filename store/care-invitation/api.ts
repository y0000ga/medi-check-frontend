import { apiBaseQuery } from "@/store/api/base-query";
import { IPaginationResponse } from "@/store/api/type";
import {
  ICreateInvitationBody,
  ICreateInvitationResponse,
  IInvitation,
  IInvitationActionResponse,
  Role,
  TGetInvitationListParams,
} from "@/store/care-invitation/type";
import { createApi } from "@reduxjs/toolkit/query/react";

export const careInvitationApi = createApi({
  reducerPath: "careInvitationApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["CareInvitation"],
  endpoints: (builder) => ({
    getInvitationList: builder.query<
      IPaginationResponse<IInvitation>,
      TGetInvitationListParams
    >({
      query: (params) => ({
        path: "/care-invitations",
        params,
      }),
      providesTags: ["CareInvitation"],
    }),
    createInvitation: builder.mutation<
      ICreateInvitationResponse,
      { role: Role; body: ICreateInvitationBody }
    >({
      query: ({ role, body }) => ({
        path: `/care-invitations/me/${role}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CareInvitation"],
    }),
    revokeInvitation: builder.mutation<
      IInvitationActionResponse,
      string
    >({
      query: (invitationId) => ({
        path: `/care-invitations/${invitationId}/revoke`,
        method: "POST",
      }),
      invalidatesTags: ["CareInvitation"],
    }),
    declineInvitation: builder.mutation<
      IInvitationActionResponse,
      string
    >({
      query: (invitationId) => ({
        path: `/care-invitations/${invitationId}/decline`,
        method: "POST",
      }),
      invalidatesTags: ["CareInvitation"],
    }),
    acceptInvitation: builder.mutation<
      IInvitationActionResponse,
      string
    >({
      query: (invitationId) => ({
        path: `/care-invitations/${invitationId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["CareInvitation"],
    }),
  }),
});

export const {
  useAcceptInvitationMutation,
  useCreateInvitationMutation,
  useDeclineInvitationMutation,
  useGetInvitationListQuery,
  useRevokeInvitationMutation,
} = careInvitationApi;
