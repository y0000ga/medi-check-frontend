import { create } from "zustand";

import {
  fetchCarePatients,
  fetchOwnedPatient,
} from "@/libs/api/patient";
import { IRES_CarePatientSummary, IRES_Patient } from "@/types/api";

export type ViewerMode = "self" | "caregiver";

interface ViewerStore {
  mode: ViewerMode;
  ownPatient: IRES_Patient | null;
  carePatients: IRES_CarePatientSummary[];
  selectedPatientId: string | null;
  isLoading: boolean;
  error: string | null;

  canUseCaregiverView: () => boolean;
  hydrateForUser: (userId: string) => Promise<void>;
  setMode: (mode: ViewerMode) => void;
  selectPatient: (patientId: string | null) => void;
  clear: () => void;
}

export const useViewerStore = create<ViewerStore>()((set, get) => ({
  mode: "self",
  ownPatient: null,
  carePatients: [],
  selectedPatientId: null,
  isLoading: false,
  error: null,

  canUseCaregiverView: () => get().carePatients.length > 0,

  hydrateForUser: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const [ownPatient, carePatients] = await Promise.all([
        fetchOwnedPatient(userId),
        fetchCarePatients(userId),
      ]);

      set((state) => {
        const hasCarePatients = carePatients.length > 0;
        const nextMode =
          state.mode === "caregiver" && !hasCarePatients
            ? "self"
            : !ownPatient && hasCarePatients
              ? "caregiver"
              : state.mode;

        const nextSelectedPatientId =
          nextMode === "self"
            ? (ownPatient?.id ?? null)
            : state.selectedPatientId &&
                carePatients.some(
                  (item) =>
                    item.patientId === state.selectedPatientId,
                )
              ? state.selectedPatientId
              : null;

        return {
          ownPatient: ownPatient ?? null,
          carePatients,
          mode: nextMode,
          selectedPatientId: nextSelectedPatientId,
          isLoading: false,
          error: null,
        };
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Load viewer context failed",
      });
    }
  },

  setMode: (mode) =>
    set((state) => ({
      mode,
      selectedPatientId:
        mode === "self"
          ? (state.ownPatient?.id ?? null)
          : state.selectedPatientId,
    })),

  selectPatient: (patientId) => set({ selectedPatientId: patientId }),

  clear: () =>
    set({
      mode: "self",
      ownPatient: null,
      carePatients: [],
      selectedPatientId: null,
      isLoading: false,
      error: null,
    }),
}));
