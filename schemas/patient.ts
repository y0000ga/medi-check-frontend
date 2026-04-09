import { ICreatePatientBody } from "@/types/api/patient";
import { ICreatePatientInput } from "@/types/schemas/patient";
import dayjs from "dayjs";

export const createPatientSchema = (
  input: ICreatePatientInput,
): ICreatePatientBody => {
  // name
  const normalizedName = input.name.trim();

  if (!normalizedName) {
    throw new Error("請先輸入病人姓名");
  }

  // TODO: 病人名稱長度限制

  // birth_date

  const normalizedBirthDate = input.birthDate?.trim() ?? "";
  const birthDateValue = dayjs(normalizedBirthDate);
  const isBirthDateValid =
    !normalizedBirthDate ||
    (/^\d{4}-\d{2}-\d{2}$/.test(normalizedBirthDate) &&
      birthDateValue.isValid() &&
      birthDateValue.format("YYYY-MM-DD") === normalizedBirthDate);

  if (!isBirthDateValid) {
    throw new Error("生日格式請使用 YYYY-MM-DD");
  }

  // email

  return {
    name: normalizedName,
    birth_date: normalizedBirthDate,
    avatar_url: null,
    email: input.email || null,
  };
};