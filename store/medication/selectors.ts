import { RootState } from "@/store";

export const selectMedicationListQuery = (state: RootState) =>
  state.medicationUi;
