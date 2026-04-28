import { MedicationFormValues } from "@/store/medication";
import { Action, DosageForm, DoseUnit } from "@/types/common";

export const MEDICATION_DOSAGE_FORM = {
  [DosageForm.Capsule]: "Capsule",
  [DosageForm.Softgel]: "Softgel",
  [DosageForm.Tablet]: "Tablet",
  [DosageForm.Liquid]: "Liquid",
  [DosageForm.Powder]: "Powder",
  [DosageForm.Pill]: "Pill",
  [DosageForm.Spray]: "Spray",
};

export const DOSE_UNIT_LABELS = {
  [DoseUnit.Mg]: "mg",
  [DoseUnit.Ml]: "mL",
  [DoseUnit.Tablet]: "tablet",
  [DoseUnit.Capsule]: "capsule",
  [DoseUnit.Package]: "pack",
  [DoseUnit.Drop]: "drop",
} as const;

export const ACTION_TITLE: Record<Action, string> = {
  [Action.Create]: "Create Medication",
  [Action.Edit]: "Edit Medication",
  [Action.Info]: "Medication Detail",
};

export const ACTION_BUTTON: Record<Action, string> = {
  [Action.Create]: "Create",
  [Action.Edit]: "Save",
  [Action.Info]: "Delete Medication",
};

export const EMPTY_MEDICATION: MedicationFormValues = {
  id: "",
  patientName: "",
  patientId: "",
  name: "",
  dosageForm: DosageForm.Capsule,
  note: "",
};

export const CREATE_STEPS = [
  "Select patient",
  "Medication details",
] as const;
