import { createApi } from "@reduxjs/toolkit/query/react";

import { apiBaseQuery } from "@/store/api/base-query";
import { ApiRequestError, request } from "@/store/api/client";
import { IPaginationResponse } from "@/store/api/type";
import {
  mapMedicationDetailFromApi,
  mapMedicationFromApi,
  mapMedicationPayloadToCreateApi,
  mapMedicationPayloadToUpdateApi,
} from "./mappers";
import {
  CreateMedicationResponseApi,
  GetAllMedicationsParamsApi,
  GetMedicationsParamsApi,
  MedicationDetailApi,
  MedicationListItemApi,
  UpdateMedicationResponseApi,
  Medication,
  MedicationDetail,
  SaveMedicationPayload,
} from "./types";

export const medicationApi = createApi({
  reducerPath: "medicationApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["Medication"],
  endpoints: (builder) => ({
    getMedications: builder.query<
      IPaginationResponse<Medication>,
      GetAllMedicationsParamsApi
    >({
      query: (params) => ({
        path: "/medications",
        params,
      }),
      transformResponse: (
        response: IPaginationResponse<MedicationListItemApi>,
      ) => ({
        ...response,
        list: response.list.map(mapMedicationFromApi),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.list.map((medication) => ({
                type: "Medication" as const,
                id: medication.id,
              })),
              { type: "Medication" as const, id: "LIST" },
            ]
          : [{ type: "Medication" as const, id: "LIST" }],
    }),
    getMedicationsByPatient: builder.query<
      IPaginationResponse<Medication>,
      {
        patientId: string;
        params: GetMedicationsParamsApi;
      }
    >({
      query: ({ patientId, params }) => ({
        path: `/patients/${patientId}/medications`,
        params,
      }),
      transformResponse: (
        response: IPaginationResponse<MedicationListItemApi>,
      ) => ({
        ...response,
        list: response.list.map(mapMedicationFromApi),
      }),
    }),
    getMedicationDetail: builder.query<MedicationDetail, string>({
      query: (medicationId) => ({
        path: `/medications/${medicationId}`,
      }),
      transformResponse: (response: MedicationDetailApi) =>
        mapMedicationDetailFromApi(response),
      providesTags: (_result, _error, medicationId) => [
        { type: "Medication", id: medicationId },
      ],
    }),
    createMedication: builder.mutation<
      MedicationDetail,
      SaveMedicationPayload
    >({
      queryFn: async (payload) => {
        try {
          const created = await request<CreateMedicationResponseApi>(
            `/patients/${payload.patientId}/medications`,
            {
              method: "POST",
              body: mapMedicationPayloadToCreateApi(payload),
            },
          );
          const detail = await request<MedicationDetailApi>(
            `/medications/${created.id}`,
          );

          return { data: mapMedicationDetailFromApi(detail) };
        } catch (error) {
          if (error instanceof ApiRequestError) {
            return {
              error: {
                status: error.statusCode,
                data: error.message,
              },
            };
          }

          return {
            error: {
              data:
                error instanceof Error
                  ? error.message
                  : "Request failed",
            },
          };
        }
      },
      async onQueryStarted(_payload, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          medicationApi.util.upsertQueryData(
            "getMedicationDetail",
            data.id,
            data,
          ),
        );
      },
      invalidatesTags: [{ type: "Medication", id: "LIST" }],
    }),
    updateMedication: builder.mutation<
      MedicationDetail,
      {
        id: string;
        changes: Partial<SaveMedicationPayload>;
      }
    >({
      queryFn: async ({ id, changes }) => {
        try {
          await request<UpdateMedicationResponseApi>(
            `/medications/${id}`,
            {
              method: "PATCH",
              body: mapMedicationPayloadToUpdateApi(changes),
            },
          );
          const detail = await request<MedicationDetailApi>(
            `/medications/${id}`,
          );

          return { data: mapMedicationDetailFromApi(detail) };
        } catch (error) {
          if (error instanceof ApiRequestError) {
            return {
              error: {
                status: error.statusCode,
                data: error.message,
              },
            };
          }

          return {
            error: {
              data:
                error instanceof Error
                  ? error.message
                  : "Request failed",
            },
          };
        }
      },
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          medicationApi.util.upsertQueryData(
            "getMedicationDetail",
            id,
            data,
          ),
        );
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: "Medication", id: arg.id },
        { type: "Medication", id: "LIST" },
      ],
    }),
    deleteMedication: builder.mutation<void, string>({
      query: (id) => ({
        path: `/medications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Medication", id },
        { type: "Medication", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateMedicationMutation,
  useDeleteMedicationMutation,
  useGetMedicationDetailQuery,
  useGetMedicationsByPatientQuery,
  useGetMedicationsQuery,
  useUpdateMedicationMutation,
} = medicationApi;
