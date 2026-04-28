import { DosageForm } from "./types";

export type MedicationFormValue = {
  name: string;
  dosageForm: DosageForm | null;
  note: string;
};

export type MedicationFormErrors = {
  name?: string;
  dosageForm?: string;
  note?: string;
  form?: string;
};

export type MedicationFormField = keyof MedicationFormValue;

export type MedicationFormUpdateValue = string | DosageForm | null;
