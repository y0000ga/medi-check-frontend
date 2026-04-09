import { create } from "zustand";

import {
  fetchMedications,
  fetchMedicationDetail,
  createMedication,
  updateMedication,
  deleteMedication,
} from "@/libs/api/medication";
import {
  IREQ_MedicationPayload,
  IRES_Medication,
} from "@/types/api";
import { DosageForm } from "@/types/common";

interface MedicationStore {
  medications: IRES_Medication[];
  selectedMedication: IRES_Medication | null;
  page: number;
  pageSize: number;
  totalSize: number;
  isLoading: boolean[];
  error: string | null;

  loadMedications: ({
    search,
    page,
    pageSize,
    sortBy,
    sortOrder,
    dosageForm,
  }: {
    search?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "desc" | "asc";
    dosageForm?: DosageForm | null;
  }) => Promise<void>;
  loadMedicationDetail: (id: string) => Promise<void>;
  addMedication: (
    payload: IREQ_MedicationPayload,
  ) => Promise<void>;
  editMedication: (
    id: string,
    payload: Partial<IREQ_MedicationPayload>,
  ) => Promise<void>;
  removeMedication: (id: string) => Promise<void>;
  clearError: () => void;
  addLoading: () => void;
  removeLoading: () => void;
}

export const useMedicationStore = create<MedicationStore>()(
  (set, get) => ({
    medications: [],
    selectedMedication: null,
    page: 1,
    pageSize: 20,
    totalSize: 0,
    isLoading: [],
    error: null,

    clearError: () => set({ error: null }),
    addLoading: () => {
      set((prev) => ({ isLoading: [...prev.isLoading, true] }));
    },
    removeLoading: () =>
      set((prev) => ({ isLoading: prev.isLoading.slice(0, -1) })),

    loadMedications: async ({
      search,
      page = 1,
      pageSize = 20,
      sortBy = "created_at",
      sortOrder = "desc",
      dosageForm = null,
    }) => {
      const { addLoading, clearError, removeLoading } = get();
      try {
        addLoading();
        clearError();
        const data = await fetchMedications({
          search,
          page,
          pageSize,
          sortBy,
          sortOrder,
          dosageForm,
        });
        set({
          medications: data.list,
          page: data.page,
          pageSize,
          totalSize: data.totalSize,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Load failed",
        });
      } finally {
        removeLoading();
      }
    },

    loadMedicationDetail: async (id) => {
      const { addLoading, clearError, removeLoading } = get();
      try {
        addLoading();
        clearError();
        const data = await fetchMedicationDetail(id);
        set({ selectedMedication: data });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Load failed",
        });
      } finally {
        removeLoading();
      }
    },

    addMedication: async (payload) => {
      const { addLoading, clearError, removeLoading } = get();
      try {
        addLoading();
        clearError();
        const created = await createMedication(payload);

        set((state) => ({
          medications: [...state.medications, created],
        }));
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Create failed",
        });
        throw error;
      } finally {
        removeLoading();
      }
    },

    editMedication: async (id, payload) => {
      const { addLoading, clearError, removeLoading } = get();
      try {
        addLoading();
        clearError();
        const updated = await updateMedication(id, payload);

        set((state) => ({
          medications: state.medications.map((item) =>
            item.id === id ? updated : item,
          ),
          selectedMedication:
            state.selectedMedication?.id === id
              ? updated
              : state.selectedMedication,
        }));
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Update failed",
        });
        throw error;
      } finally {
        removeLoading();
      }
    },

    removeMedication: async (id) => {
      const { addLoading, clearError, removeLoading } = get();

      try {
        addLoading();
        clearError();
        await deleteMedication(id);
        set((state) => {
          return {
            medications: state.medications.filter(
              (item) => item.id !== id,
            ),
            selectedMedication:
              state.selectedMedication?.id === id
                ? null
                : state.selectedMedication,
          };
        });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Delete failed",
        });
        throw error;
      } finally {
        removeLoading();
      }
    },
  }),
);
