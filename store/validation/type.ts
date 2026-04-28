export type ValidationPatternRule = {
  name: string;
  type: 'pattern' | 'patternNotMatch';
  pattern: string;
  errorKey: string;
};

export type ValidationRule = {
  type: 'string';
  required: boolean;
  minLength?: number;
  maxLength?: number;
  trim?: boolean;
  nullable?: boolean;
  format?: 'email' | 'url';
  allowWhitespace?: boolean;
  rules?: ValidationPatternRule[];
};

export type ValidationMetadata = {
  version: string;
  rules: Record<string, ValidationRule>;
};