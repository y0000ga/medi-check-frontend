import { create } from 'zustand';

import {
    fetchMedications,
    fetchMedicationDetail,
    createMedication,
    updateMedication,
    deleteMedication,
} from '@/libs/api/medication';
import { IRES_Medication } from '@/types/api';

interface MedicationStore {
    medications: IRES_Medication[];
    selectedMedication: IRES_Medication | null;
    isLoading: boolean[];
    error: string | null;

    loadMedications: ({ search }: { search?: string }) => Promise<void>;
    loadMedicationDetail: (id: string) => Promise<void>;
    addMedication: (payload: Omit<IRES_Medication, 'id'>) => Promise<void>;
    editMedication: (id: string, payload: Partial<IRES_Medication>) => Promise<void>;
    removeMedication: (id: string) => Promise<void>;
    clearError: () => void;
    addLoading: () => void
    removeLoading: () => void
}

export const useMedicationStore = create<MedicationStore>()(
    (set, get) => ({
        medications: [],
        selectedMedication: null,
        isLoading: [],
        error: null,

        clearError: () => set({ error: null }),
        addLoading: () => { set(prev => ({ isLoading: [...prev.isLoading, true] })) },
        removeLoading: () => set(prev => ({ isLoading: prev.isLoading.slice(0, -1) })),

        loadMedications: async ({ search }: { search?: string }) => {
            const { addLoading, clearError, removeLoading } = get()
            try {
                addLoading()
                clearError()
                const data = await fetchMedications({ search });
                set({ medications: data });
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Load failed' });
            } finally {
                removeLoading()
            }
        },

        loadMedicationDetail: async (id) => {
            const { addLoading, clearError, removeLoading } = get()
            try {
                addLoading()
                clearError()
                const data = await fetchMedicationDetail(id);
                set({ selectedMedication: data });
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Load failed' });
            } finally {
                removeLoading()
            }
        },

        addMedication: async (payload) => {
            const { addLoading, clearError, removeLoading } = get()
            try {
                addLoading()
                clearError()
                const created = await createMedication(payload);

                set((state) => ({
                    medications: [...state.medications, created],
                }));
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Create failed' });
                throw error;
            } finally {
                removeLoading()
            }
        },

        editMedication: async (id, payload) => {
            const { addLoading, clearError, removeLoading } = get()
            try {
                addLoading()
                clearError()
                const updated = await updateMedication(id, payload);

                set((state) => ({
                    medications: state.medications.map((item) =>
                        item.id === id ? updated : item
                    ),
                    selectedMedication:
                        state.selectedMedication?.id === id ? updated : state.selectedMedication,
                }));
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Update failed' });
                throw error;
            } finally {
                removeLoading()
            }
        },

        removeMedication: async (id) => {
            const { addLoading, clearError, removeLoading } = get()

            try {
                addLoading()
                clearError()
                await deleteMedication(id);
                set((state) => {
                    return {

                        medications: state.medications.filter((item) => item.id !== id),
                        selectedMedication:
                            state.selectedMedication?.id === id ? null : state.selectedMedication,
                    }
                });
            } catch (error) {
                set({ error: error instanceof Error ? error.message : 'Delete failed' });
                throw error;
            } finally {
                removeLoading()
            }
        },
    }))


