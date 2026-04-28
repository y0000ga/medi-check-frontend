// features/appConfig/mappers.ts

import {
  FieldValidationRule,
  FieldValidationRuleDto,
  ValidationConfig,
  ValidationConfigDto,
} from "./types";

const mapFieldValidationRuleDto = (
  dto: FieldValidationRuleDto,
): FieldValidationRule => ({
  type: dto.type,
  required: dto.required,
  minLength: dto.minLength,
  maxLength: dto.maxLength,
  trim: dto.trim,
  allowWhitespace: dto.allowWhitespace,
  allowedCharsPattern: dto.allowed_chars_pattern,
  format: dto.format,
  rules: dto.rules,
});

export const mapValidationConfigDto = (
  dto: ValidationConfigDto,
): ValidationConfig => ({
  version: dto.version,
  rules: Object.fromEntries(
    Object.entries(dto.rules).map(([key, value]) => [
      key,
      mapFieldValidationRuleDto(value),
    ]),
  ),
});
