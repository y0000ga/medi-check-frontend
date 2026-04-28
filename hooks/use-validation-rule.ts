// src/validation/useValidationRule.ts

import { useGetValidationMetadataQuery } from '@/store/validation/api';
import { ValidationMetadata } from '@/store/validation/type';

export const defaultValidationMetadata: ValidationMetadata = {
  version: 'local-default',
  rules: {
    password: {
      type: 'string',
      required: true,
      minLength: 10,
      maxLength: 25,
      trim: false,
      allowWhitespace: false,
      rules: [
        {
          name: 'hasUppercase',
          type: 'pattern',
          pattern: '[A-Z]',
          errorKey: 'auth.password.requireUppercase',
        },
        {
          name: 'hasSpecialChar',
          type: 'pattern',
          pattern: '[^A-Za-z0-9]',
          errorKey: 'auth.password.requireSpecialChar',
        },
      ],
    },
    name: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 100,
      trim: true,
    },
    memo: {
      type: 'string',
      required: false,
      minLength: 0,
      maxLength: 500,
      trim: true,
    },
  },
};

export const useValidationRule = (ruleKey: string) => {
  const { data, isLoading, isError, refetch } = useGetValidationMetadataQuery();

  const metadata = data ?? defaultValidationMetadata;

  return {
    rule: metadata.rules[ruleKey],
    metadataVersion: metadata.version,
    isLoading,
    isError,
    refetch,
  };
};