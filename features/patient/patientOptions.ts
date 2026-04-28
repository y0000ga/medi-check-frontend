import { SortOrder } from "@/shared/api/types";
import { PatientsSortBy } from "./types";

export const getSortLabel = (value: PatientsSortBy) => {
  switch (value) {
    case PatientsSortBy.createdAt:
      return "建立時間";
    case PatientsSortBy.name:
      return "名稱";
    case PatientsSortBy.birthDate:
      return "生日";
    default:
      return "未知排序";
  }
};

export const patientSortOptions: {
  label: string;
  value: PatientsSortBy;
}[] = [
  { label: "建立時間", value: PatientsSortBy.createdAt },
  { label: "名稱", value: PatientsSortBy.name },
  { label: "生日", value: PatientsSortBy.birthDate },
];

export const getSortOrderLabel = (sortOrder: SortOrder) => {
  return sortOrder === SortOrder.asc ? "升冪" : "降冪";
};
