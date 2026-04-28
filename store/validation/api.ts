// src/services/validationApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ValidationMetadata } from './type';

export const validationApi = createApi({
  reducerPath: 'validationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
  }),
  endpoints: builder => ({
    getValidationMetadata: builder.query<ValidationMetadata, void>({
      query: () => '/app-config/validation',
      keepUnusedDataFor: 60 * 60 * 24,
    }),
  }),
});

export const {
  useGetValidationMetadataQuery,
} = validationApi;