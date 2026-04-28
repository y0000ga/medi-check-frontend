// features/appConfig/types.ts

export type ValidationRuleItemDto = {
  name: string;
  pattern: string;
  errorKey: string;
};

export type FieldValidationRuleDto = {
  type: "string";
  required: boolean;
  minLength?: number;
  maxLength?: number;
  trim?: boolean;
  allowWhitespace?: boolean;
  allowed_chars_pattern?: string;
  format?: "url" | "email";
  rules?: ValidationRuleItemDto[];
};

export type ValidationConfigDto = {
  version: string;
  rules: Record<string, FieldValidationRuleDto>;
};

export type ValidationRuleItem = {
  name: string;
  pattern: string;
  errorKey: string;
};

export type FieldValidationRule = {
  type: "string";
  required: boolean;
  minLength?: number;
  maxLength?: number;
  trim?: boolean;
  allowWhitespace?: boolean;
  allowedCharsPattern?: string;
  format?: "url" | "email";
  rules?: ValidationRuleItem[];
};

export type ValidationConfig = {
  version: string;
  rules: Record<string, FieldValidationRule>;
};
