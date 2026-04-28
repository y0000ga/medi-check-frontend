import { assign, fromPromise, setup } from "xstate";
import {
  MedicationFormErrors,
  MedicationFormField,
  MedicationFormUpdateValue,
  MedicationFormValue,
} from "./formTypes";
import { EditMedicationRequest, EditMedicationResponse } from "./types";

export type EditMedicationContext = {
  medicationId: string;
  patientName: string;

  form: MedicationFormValue;
  errors: MedicationFormErrors;

  updatedMedicationId: string | null;

  editMedication: (
    payload: EditMedicationRequest,
  ) => Promise<EditMedicationResponse>;
};

export type EditMedicationMachineInput = {
  medicationId: string;
  patientName: string;

  initialForm: MedicationFormValue;

  editMedication: (
    payload: EditMedicationRequest,
  ) => Promise<EditMedicationResponse>;
};

export type EditMedicationEvent =
  | {
      type: "UPDATE_FORM";
      field: MedicationFormField;
      value: MedicationFormUpdateValue;
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

type SubmitEditMedicationInput = {
  medicationId: string;
  form: MedicationFormValue;
  editMedication: (
    payload: EditMedicationRequest,
  ) => Promise<EditMedicationResponse>;
};

const getMedicationFormErrors = (
  form: MedicationFormValue,
): MedicationFormErrors => {
  const errors: MedicationFormErrors = {};

  if (!form.name.trim()) {
    errors.name = "請輸入藥品名稱";
  }

  if (!form.dosageForm) {
    errors.dosageForm = "請選擇劑型";
  }

  return errors;
};

export const editMedicationMachine = setup({
  types: {
    context: {} as EditMedicationContext,
    input: {} as EditMedicationMachineInput,
    events: {} as EditMedicationEvent,
  },

  guards: {
    isMedicationFormValid: ({ context }) => {
      return Object.keys(getMedicationFormErrors(context.form)).length === 0;
    },
  },

  actions: {
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

    assignUpdatedMedicationId: assign({
      updatedMedicationId: ({ context, event }) => {
        if (!("output" in event)) return context.medicationId;

        return event.output.medicationId || context.medicationId;
      },
    }),

    assignSubmitError: assign({
      errors: ({ context }) => ({
        ...context.errors,
        form: "更新藥品失敗，請稍後再試",
      }),
    }),

    reset: assign({
      form: ({ context }) => ({
        ...context.form,
      }),
      errors: {},
      updatedMedicationId: null,
    }),
  },

  actors: {
    submitEditMedication: fromPromise(
      async ({ input }: { input: SubmitEditMedicationInput }) => {
        if (!input.form.dosageForm) {
          throw new Error("Missing dosage form");
        }

        return input.editMedication({
          medicationId: input.medicationId,
          name: input.form.name.trim(),
          dosageForm: input.form.dosageForm,
          note: input.form.note.trim(),
        });
      },
    ),
  },
}).createMachine({
  id: "editMedication",

  initial: "fillMedication",

  context: ({ input }) => ({
    medicationId: input.medicationId,
    patientName: input.patientName,

    form: input.initialForm,
    errors: {},

    updatedMedicationId: null,

    editMedication: input.editMedication,
  }),

  states: {
    fillMedication: {
      on: {
        UPDATE_FORM: {
          actions: "updateForm",
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
        src: "submitEditMedication",
        input: ({ context }) => ({
          medicationId: context.medicationId,
          form: context.form,
          editMedication: context.editMedication,
        }),
        onDone: {
          target: "success",
          actions: "assignUpdatedMedicationId",
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
      target: ".fillMedication",
      actions: "reset",
    },
  },
});
