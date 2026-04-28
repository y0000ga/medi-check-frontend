import { appApi } from "@/shared/api/appApi";
import {
  mapCareInvitationActionResponseDto,
  mapCreateCareInvitationRequestDto,
  mapCreateCareInvitationResponseDto,
  mapGetCareInvitationsRequestDto,
  mapGetCareInvitationsResponseDto,
} from "./mappers";
import {
  CareInvitationActionRequest,
  CareInvitationActionResponse,
  CareInvitationActionResponseDto,
  CreateCareInvitationRequest,
  CreateCareInvitationResponse,
  CreateCareInvitationResponseDto,
  GetCareInvitationsDto,
  GetCareInvitationsRequest,
  GetCareInvitationsResponse,
} from "./types";

export const careInvitationApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getCareInvitations: builder.query<
      GetCareInvitationsResponse,
      GetCareInvitationsRequest
    >({
      query: (payload) => ({
        url: "/care-invitations",
        method: "GET",
        params: mapGetCareInvitationsRequestDto(payload),
      }),
      transformResponse: (response: GetCareInvitationsDto) => {
        return mapGetCareInvitationsResponseDto(response);
      },
      providesTags: ["CareInvitation"],
    }),

    createCaregiverInvitation: builder.mutation<
      CreateCareInvitationResponse,
      CreateCareInvitationRequest
    >({
      query: (payload) => ({
        url: "/care-invitations/me/caregiver",
        method: "POST",
        body: mapCreateCareInvitationRequestDto(payload),
      }),
      transformResponse: (response: CreateCareInvitationResponseDto) => {
        return mapCreateCareInvitationResponseDto(response);
      },
      invalidatesTags: ["CareInvitation", "Patient"],
    }),

    createPatientInvitation: builder.mutation<
      CreateCareInvitationResponse,
      CreateCareInvitationRequest
    >({
      query: (payload) => ({
        url: "/care-invitations/me/patient",
        method: "POST",
        body: mapCreateCareInvitationRequestDto(payload),
      }),
      transformResponse: (response: CreateCareInvitationResponseDto) => {
        return mapCreateCareInvitationResponseDto(response);
      },
      invalidatesTags: ["CareInvitation", "CareRelationship", "Patient"],
    }),

    revokeCareInvitation: builder.mutation<
      CareInvitationActionResponse,
      CareInvitationActionRequest
    >({
      query: ({ invitationId }) => ({
        url: `/care-invitations/${invitationId}/revoke`,
        method: "POST",
      }),
      transformResponse: (response: CareInvitationActionResponseDto) => {
        return mapCareInvitationActionResponseDto(response);
      },
      invalidatesTags: ["CareInvitation", "CareRelationship", "Patient"],
    }),

    declineCareInvitation: builder.mutation<
      CareInvitationActionResponse,
      CareInvitationActionRequest
    >({
      query: ({ invitationId }) => ({
        url: `/care-invitations/${invitationId}/decline`,
        method: "POST",
      }),
      transformResponse: (response: CareInvitationActionResponseDto) => {
        return mapCareInvitationActionResponseDto(response);
      },
      invalidatesTags: ["CareInvitation", "CareRelationship", "Patient"],
    }),

    acceptCareInvitation: builder.mutation<
      CareInvitationActionResponse,
      CareInvitationActionRequest
    >({
      query: ({ invitationId }) => ({
        url: `/care-invitations/${invitationId}/accept`,
        method: "POST",
      }),
      transformResponse: (response: CareInvitationActionResponseDto) => {
        return mapCareInvitationActionResponseDto(response);
      },
      invalidatesTags: ["CareInvitation", "CareRelationship", "Patient"],
    }),
  }),
});

export const {
  useGetCareInvitationsQuery,
  useCreateCaregiverInvitationMutation,
  useCreatePatientInvitationMutation,
  useRevokeCareInvitationMutation,
  useDeclineCareInvitationMutation,
  useAcceptCareInvitationMutation,
} = careInvitationApi;
