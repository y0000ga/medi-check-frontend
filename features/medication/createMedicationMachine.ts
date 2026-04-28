import { assign, fromPromise, setup } from "xstate";
import {
  CreateMedicationRequest,
  CreateMedicationResponse,
  DosageForm,
} from "./types";

export type SelectedPatient = {
  id: string;
  name: string;
};

export type CreateMedicationForm = {
  name: string;
  dosageForm: DosageForm | null;
  note: string;
};

export type CreateMedicationErrors = {
  patient?: string;
  name?: string;
  dosageForm?: string;
  note?: string;
  form?: string;
};

export type CreateMedicationContext = {
  selectedPatient: SelectedPatient | null;
  form: CreateMedicationForm;
  errors: CreateMedicationErrors;
  createdMedicationId: string | null;
  createMedication: (
    payload: CreateMedicationRequest,
  ) => Promise<CreateMedicationResponse>;
};

export type CreateMedicationMachineInput = {
  createMedication: (
    payload: CreateMedicationRequest,
  ) => Promise<CreateMedicationResponse>;
};

export type CreateMedicationEvent =
  | {
      type: "SELECT_PATIENT";
      patient: SelectedPatient;
    }
  | {
      type: "UPDATE_FORM";
      field: keyof CreateMedicationForm;
      value: string | DosageForm | null;
    }
  | {
      type: "NEXT";
    }
  | {
      type: "BACK";
    }
  | {
      type: "SUBMIT";
    }
  | {
      type: "RETRY";
    }
  | {
      type: "RESET";
    };

type SubmitMedicationInput = {
  selectedPatient: SelectedPatient | null;
  form: CreateMedicationForm;
  createMedication: (
    payload: CreateMedicationRequest,
  ) => Promise<CreateMedicationResponse>;
};

const getMedicationFormErrors = (
  form: CreateMedicationForm,
): CreateMedicationErrors => {
  const errors: CreateMedicationErrors = {};

  if (!form.name.trim()) {
    errors.name = "請輸入藥品名稱";
  }

  if (!form.dosageForm) {
    errors.dosageForm = "請選擇劑型";
  }

  return errors;
};

export const createMedicationMachine = setup({
  types: {
    context: {} as CreateMedicationContext,
    input: {} as CreateMedicationMachineInput,
    events: {} as CreateMedicationEvent,
  },

  guards: {
    isMedicationFormValid: ({ context }) => {
      return Object.keys(getMedicationFormErrors(context.form)).length === 0;
    },
  },

  actions: {
    selectPatient: assign({
      selectedPatient: ({ event }) => {
        if (event.type !== "SELECT_PATIENT") return null;
        return event.patient;
      },
      errors: ({ context }) => ({
        ...context.errors,
        patient: undefined,
        form: undefined,
      }),
    }),

    updateForm: assign({
      form: ({ context, event }) => {
        if (event.type !== "UPDATE_FORM") return context.form;

        return {
          ...context.form,
          [event.field]: event.value,
        };
      },

      errors: ({ context, event }) => {
        if (event.type !== "UPDATE_FORM") return context.errors;

        return {
          ...context.errors,
          [event.field]: undefined,
          form: undefined,
        };
      },
    }),

    validateMedicationForm: assign({
      errors: ({ context }) => ({
        ...context.errors,
        ...getMedicationFormErrors(context.form),
      }),
    }),

    assignCreatedMedicationId: assign({
      createdMedicationId: ({ event }) => {
        if (!("output" in event)) return null;
        return event.output.id;
      },
    }),

    assignSubmitError: assign({
      errors: ({ context }) => ({
        ...context.errors,
        form: "新增藥品失敗，請稍後再試",
      }),
    }),

    reset: assign({
      selectedPatient: null,
      form: {
        name: "",
        dosageForm: null,
        note: "",
      },
      errors: {},
      createdMedicationId: null,
    }),
  },

  actors: {
    submitMedication: fromPromise(
      async ({ input }: { input: SubmitMedicationInput }) => {
        if (!input.selectedPatient) {
          throw new Error("Missing selected patient");
        }

        if (!input.form.dosageForm) {
          throw new Error("Missing dosage form");
        }

        return input.createMedication({
          patientId: input.selectedPatient.id,
          name: input.form.name.trim(),
          dosageForm: input.form.dosageForm,
          note: input.form.note.trim(),
        });
      },
    ),
  },
}).createMachine({
  id: "createMedication",

  initial: "selectPatient",

  context: ({ input }) => ({
    selectedPatient: null,
    form: {
      name: "",
      dosageForm: null,
      note: "",
    },
    errors: {},
    createdMedicationId: null,
    createMedication: input.createMedication,
  }),

  states: {
    selectPatient: {
      on: {
        SELECT_PATIENT: {
          target: "fillMedication",
          actions: "selectPatient",
        },
      },
    },

    fillMedication: {
      on: {
        UPDATE_FORM: {
          actions: "updateForm",
        },

        BACK: {
          target: "selectPatient",
        },

        NEXT: [
          {
            target: "confirm",
            guard: "isMedicationFormValid",
          },
          {
            actions: "validateMedicationForm",
          },
        ],
      },
    },

    confirm: {
      on: {
        BACK: {
          target: "fillMedication",
        },

        SUBMIT: {
          target: "submitting",
        },
      },
    },

    submitting: {
      invoke: {
        src: "submitMedication",
        input: ({ context }) => ({
          selectedPatient: context.selectedPatient,
          form: context.form,
          createMedication: context.createMedication,
        }),
        onDone: {
          target: "success",
          actions: "assignCreatedMedicationId",
        },
        onError: {
          target: "failure",
          actions: "assignSubmitError",
        },
      },
    },

    failure: {
      on: {
        RETRY: {
          target: "submitting",
        },

        BACK: {
          target: "fillMedication",
        },
      },
    },

    success: {
      type: "final",
    },
  },

  on: {
    RESET: {
      target: ".selectPatient",
      actions: "reset",
    },
  },
});
