import { appApi } from "@/shared/api/appApi";
import {
  CreatePatientRequest,
  CreatePatientResponse,
  EditPatientRequest,
  EditPatientResponse,
  GetPatientsDto,
  IPatientDetailDto,
  TGetPatientDetailsResponse,
  TGetPatientsRequest,
  TGetPatientsResponse,
} from "./types";
import {
  mapCreatePatientDto,
  mapEditPatientDto,
  mapGetPatientDetailssResponseDto,
  mapGetPatientsRequestDto,
  mapGetPatientsResponseDto,
} from "./mappers";

export const patientApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    createPatient: builder.mutation<
      CreatePatientResponse,
      CreatePatientRequest
    >({
      query: (payload) => ({
        url: "/patients",
        method: "POST",
        body: mapCreatePatientDto(payload),
      }),
      transformResponse: (response: CreatePatientResponse) => {
        return response;
      },
      invalidatesTags: ["Patient"],
    }),
    editPatient: builder.mutation<EditPatientResponse, EditPatientRequest>({
      query: (payload) => ({
        url: `/patients/${payload.id}`,
        method: "PUT",
        body: mapEditPatientDto(payload),
      }),
      transformResponse: (response: CreatePatientResponse) => {
        return response;
      },
      invalidatesTags: ["Patient"],
    }),
    getPatients: builder.query<TGetPatientsResponse, TGetPatientsRequest>({
      query: (payload) => ({
        url: "/patients",
        method: "GET",
        params: mapGetPatientsRequestDto(payload),
      }),
      transformResponse: (response: GetPatientsDto) => {
        return mapGetPatientsResponseDto(response);
      },
      providesTags: ["Patient"],
    }),
    getPatientDetail: builder.query<TGetPatientDetailsResponse, { id: string }>(
      {
        query: (payload) => ({
          url: `/patients/${payload.id}`,
          method: "GET",
        }),
        transformResponse: (response: IPatientDetailDto) => {
          return mapGetPatientDetailssResponseDto(response);
        },
        providesTags: ["Patient"],
      },
    ),
  }),
});

export const {
  useCreatePatientMutation,
  useEditPatientMutation,
  useGetPatientsQuery,
  useGetPatientDetailQuery,
} = patientApi;
