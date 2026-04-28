import { appApi } from "@/shared/api/appApi";
import {
  mapCreateMedicationRequestDto,
  mapCreateMedicationResponseDto,
  mapEditMedicationRequestDto,
  mapEditMedicationResponseDto,
  mapGetAllMedicationsRequestDto,
  mapGetMedicationsResponseDto,
  mapGetPatientMedicationsRequestDto,
  mapGetPatientMedicationsResponseDto,
  mapMedicationDetailDto,
} from "./mappers";
import {
  CreateMedicationRequest,
  CreateMedicationResponse,
  CreateMedicationResponseDto,
  EditMedicationRequest,
  EditMedicationResponse,
  EditMedicationResponseDto,
  GetAllMedicationsRequest,
  GetAllMedicationsResponse,
  GetMedicationDetailRequest,
  GetMedicationDetailResponse,
  GetMedicationsDto,
  GetPatientMedicationsRequest,
  GetPatientMedicationsResponse,
  MedicationDetailDto,
  RemoveMedicationRequest,
  RemoveMedicationResponse,
} from "./types";

export const medicationApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMedications: builder.query<
      GetAllMedicationsResponse,
      GetAllMedicationsRequest
    >({
      query: (payload) => ({
        url: "/medications",
        method: "GET",
        params: mapGetAllMedicationsRequestDto(payload),
      }),
      transformResponse: (response: GetMedicationsDto) => {
        return mapGetMedicationsResponseDto(response);
      },
      providesTags: ["Medication"],
    }),

    getPatientMedications: builder.query<
      GetPatientMedicationsResponse,
      GetPatientMedicationsRequest
    >({
      query: ({ patientId, ...payload }) => ({
        url: `/patients/${patientId}/medications`,
        method: "GET",
        params: mapGetPatientMedicationsRequestDto({
          patientId,
          ...payload,
        }),
      }),
      transformResponse: (response: GetMedicationsDto) => {
        return mapGetPatientMedicationsResponseDto(response);
      },
      providesTags: ["Medication"],
    }),

    createMedication: builder.mutation<
      CreateMedicationResponse,
      CreateMedicationRequest
    >({
      query: ({ patientId, ...payload }) => ({
        url: `/patients/${patientId}/medications`,
        method: "POST",
        body: mapCreateMedicationRequestDto({
          patientId,
          ...payload,
        }),
      }),
      transformResponse: (response: CreateMedicationResponseDto) => {
        return mapCreateMedicationResponseDto(response);
      },
      invalidatesTags: ["Medication"],
    }),

    getMedicationDetail: builder.query<
      GetMedicationDetailResponse,
      GetMedicationDetailRequest
    >({
      query: ({ medicationId }) => ({
        url: `/medications/${medicationId}`,
        method: "GET",
      }),
      transformResponse: (response: MedicationDetailDto) => {
        return mapMedicationDetailDto(response);
      },
      providesTags: ["Medication"],
    }),

    editMedication: builder.mutation<
      EditMedicationResponse,
      EditMedicationRequest
    >({
      query: ({ medicationId, ...payload }) => ({
        url: `/medications/${medicationId}`,
        method: "PATCH",
        body: mapEditMedicationRequestDto({
          medicationId,
          ...payload,
        }),
      }),
      transformResponse: (response: EditMedicationResponseDto) => {
        return mapEditMedicationResponseDto(response);
      },
      invalidatesTags: ["Medication"],
    }),

    removeMedication: builder.mutation<
      RemoveMedicationResponse,
      RemoveMedicationRequest
    >({
      query: ({ medicationId }) => ({
        url: `/medications/${medicationId}`,
        method: "DELETE",
      }),
      transformResponse: (response: RemoveMedicationResponse) => {
        return response;
      },
      invalidatesTags: ["Medication"],
    }),
  }),
});

export const {
  useGetAllMedicationsQuery,
  useGetPatientMedicationsQuery,
  useCreateMedicationMutation,
  useGetMedicationDetailQuery,
  useEditMedicationMutation,
  useRemoveMedicationMutation,
} = medicationApi;
