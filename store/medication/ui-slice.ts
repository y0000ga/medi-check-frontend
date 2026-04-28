import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { DosageForm } from "@/types/common";

import { MedicationListQueryState } from "./types";

const initialState: MedicationListQueryState = {
  search: "",
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  sortBy: "created_at",
  sortOrder: "desc",
  dosageForm: null,
};

const medicationUiSlice = createSlice({
  name: "medicationUi",
  initialState,
  reducers: {
    setMedicationSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setMedicationPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setMedicationSort(
      state,
      action: PayloadAction<{
        sortBy: string;
        sortOrder: "desc" | "asc";
      }>,
    ) {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.page = 1;
    },
    setMedicationDosageForm(
      state,
      action: PayloadAction<DosageForm | null>,
    ) {
      state.dosageForm = action.payload;
      state.page = 1;
    },
    resetMedicationListQuery() {
      return initialState;
    },
  },
});

export const {
  resetMedicationListQuery,
  setMedicationDosageForm,
  setMedicationPage,
  setMedicationSearch,
  setMedicationSort,
} = medicationUiSlice.actions;

export const medicationUiReducer = medicationUiSlice.reducer;
