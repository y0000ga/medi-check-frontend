import { getValidationMessage } from "./messages";
import {
  FieldValidationResult,
  FieldValidationRule,
  FormValidationResult,
  ValidationRules,
} from "./types";

const isEmptyValue = (value: unknown) => {
  return value === undefined || value === null || value === "";
};

const hasWhitespace = (value: string) => {
  return /\s/.test(value);
};

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const isValidEmail = (value: string) => {
  return /^\S+@\S+\.\S+$/.test(value);
};

const pushError = (errors: string[], errorKeys: string[], errorKey: string) => {
  errorKeys.push(errorKey);
  errors.push(getValidationMessage(errorKey));
};

export const normalizeFieldValue = (
  value: unknown,
  rule: FieldValidationRule,
) => {
  if (rule.type !== "string") {
    return value;
  }

  if (typeof value !== "string") {
    return value;
  }

  if (rule.trim) {
    return value.trim();
  }

  return value;
};

export const validateField = (
  fieldName: string,
  value: unknown,
  rule?: FieldValidationRule,
): FieldValidationResult => {
  const errors: string[] = [];
  const errorKeys: string[] = [];

  if (!rule) {
    return {
      valid: true,
      value,
      errors,
      errorKeys,
    };
  }

  const normalizedValue = normalizeFieldValue(value, rule);

  if (rule.required && isEmptyValue(normalizedValue)) {
    pushError(errors, errorKeys, "validation.required");

    return {
      valid: false,
      value: normalizedValue,
      errors,
      errorKeys,
    };
  }

  /**
   * 非必填且空值：直接通過
   * 例如 avatar_url / note 沒填時，不應該再檢查 minLength / format。
   */
  if (!rule.required && isEmptyValue(normalizedValue)) {
    return {
      valid: true,
      value: normalizedValue,
      errors,
      errorKeys,
    };
  }

  if (rule.type === "string") {
    if (typeof normalizedValue !== "string") {
      pushError(errors, errorKeys, "validation.string");

      return {
        valid: false,
        value: normalizedValue,
        errors,
        errorKeys,
      };
    }

    if (
      typeof rule.minLength === "number" &&
      normalizedValue.length < rule.minLength
    ) {
      pushError(errors, errorKeys, "validation.minLength");
    }

    if (
      typeof rule.maxLength === "number" &&
      normalizedValue.length > rule.maxLength
    ) {
      pushError(errors, errorKeys, "validation.maxLength");
    }

    if (rule.allowWhitespace === false && hasWhitespace(normalizedValue)) {
      pushError(errors, errorKeys, "validation.noWhitespace");
    }

    if (rule.allowedCharsPattern) {
      const allowedCharsRegex = new RegExp(rule.allowedCharsPattern);

      if (!allowedCharsRegex.test(normalizedValue)) {
        pushError(errors, errorKeys, "validation.allowedChars");
      }
    }

    if (rule.format === "url" && !isValidUrl(normalizedValue)) {
      pushError(errors, errorKeys, "validation.url");
    }

    if (rule.format === "email" && !isValidEmail(normalizedValue)) {
      pushError(errors, errorKeys, "validation.email");
    }

    for (const customRule of rule.rules ?? []) {
      const customRegex = new RegExp(customRule.pattern);

      if (!customRegex.test(normalizedValue)) {
        pushError(errors, errorKeys, customRule.errorKey);
      }
    }
  }

  return {
    valid: errors.length === 0,
    value: normalizedValue,
    errors,
    errorKeys,
  };
};

export const validateFields = <TValues extends Record<string, unknown>>(
  values: TValues,
  rules: ValidationRules,
): FormValidationResult<TValues> => {
  const nextValues = { ...values };
  const errors: Partial<Record<keyof TValues, string>> = {};
  const errorKeys: Partial<Record<keyof TValues, string[]>> = {};

  for (const [fieldName, value] of Object.entries(values)) {
    const rule = rules[fieldName];

    const result = validateField(fieldName, value, rule);

    nextValues[fieldName as keyof TValues] =
      result.value as TValues[keyof TValues];

    if (!result.valid) {
      errors[fieldName as keyof TValues] = result.errors[0];
      errorKeys[fieldName as keyof TValues] = result.errorKeys;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    values: nextValues,
    errors,
    errorKeys,
  };
};
