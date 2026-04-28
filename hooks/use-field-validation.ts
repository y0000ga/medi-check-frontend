import { useGetValidationMetadataQuery } from "@/store/validation/api";
import { ValidationRule } from "@/store/validation/type";
import { useMemo } from "react";
import { defaultValidationMetadata } from "./use-validation-rule";
import { validationMessages } from "@/constants/error";

const validateField = (
  value: unknown,
  rule?: ValidationRule,
): { valid: boolean; errorKeys: string[] } => {
  if (!rule) return { valid: true, errorKeys: [] };

  const errorKeys: string[] = [];

  if (
    rule.required &&
    (value === undefined || value === null || value === "")
  ) {
    errorKeys.push("validation.required");
    return { valid: false, errorKeys };
  }

  if (value === undefined || value === null) {
    return { valid: true, errorKeys };
  }

  if (rule.type === "string") {
    const stringValue = String(value);
    const normalizedValue = rule.trim
      ? stringValue.trim()
      : stringValue;

    if (
      rule.minLength !== undefined &&
      normalizedValue.length < rule.minLength
    ) {
      errorKeys.push("validation.minLength");
    }

    if (
      rule.maxLength !== undefined &&
      normalizedValue.length > rule.maxLength
    ) {
      errorKeys.push("validation.maxLength");
    }

    if (
      rule.allowWhitespace === false &&
      /\s/.test(normalizedValue)
    ) {
      errorKeys.push("validation.noWhitespace");
    }

    for (const patternRule of rule.rules ?? []) {
      const regex = new RegExp(patternRule.pattern);
      const matched = regex.test(normalizedValue);

      if (patternRule.type === "pattern" && !matched) {
        errorKeys.push(patternRule.errorKey);
      }

      if (patternRule.type === "patternNotMatch" && matched) {
        errorKeys.push(patternRule.errorKey);
      }
    }
  }

  return {
    valid: errorKeys.length === 0,
    errorKeys,
  };
};

export const useFieldValidation = (
  ruleKey: string,
  value: unknown,
) => {
  const { data, isLoading, isError, refetch } =
    useGetValidationMetadataQuery();

  const metadata = data ?? defaultValidationMetadata;
  const rule = metadata.rules[ruleKey];

  const result = useMemo(
    () => validateField(value, rule),
    [value, rule],
  );

  const message = result.errorKeys.length
    ? validationMessages[result.errorKeys[0]] || result.errorKeys[0]
    : undefined;

  return {
    rule,
    valid: result.valid,
    errorKeys: result.errorKeys,
    message,
    metadataVersion: metadata.version,
    isLoading,
    isError,
    refetch,
  };
};
