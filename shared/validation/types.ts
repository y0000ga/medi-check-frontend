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

export type ValidationRules = Record<string, FieldValidationRule>;

export type FieldValidationResult = {
  valid: boolean;
  value: unknown;
  errors: string[];
  errorKeys: string[];
};

export type FormValidationResult<TValues extends Record<string, unknown>> = {
  valid: boolean;
  values: TValues;
  errors: Partial<Record<keyof TValues, string>>;
  errorKeys: Partial<Record<keyof TValues, string[]>>;
};
