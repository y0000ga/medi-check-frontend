export const validationMessages: Record<string, string> = {
  "validation.required": "此欄位為必填",
  "validation.string": "欄位格式不正確",
  "validation.minLength": "輸入長度不足",
  "validation.maxLength": "輸入長度過長",
  "validation.noWhitespace": "不可包含空白",
  "validation.allowedChars": "包含不允許的字元",
  "validation.url": "URL 格式不正確",
  "validation.email": "Email 格式不正確",

  "auth.password.requireUppercase": "密碼需包含至少一個大寫英文字母",
  "auth.password.requireSpecialChar": "密碼需包含至少一個特殊符號",
};

export const getValidationMessage = (errorKey: string) => {
  return validationMessages[errorKey] ?? errorKey;
};
