import { assign, fromPromise, setup } from "xstate";
import {
  EditScheduleRequest,
  EditScheduleResponse,
  ScheduleFormRequest,
} from "./types";
import { validateScheduleForm } from "./validators";
import { DosageForm } from "@/features/medication/types";

export type EditSchedulePatient = {
  id: string;
  name: string;
};

export type EditScheduleMedication = {
  id: string;
  name: string;
  dosageForm: DosageForm;
  patientId: string;
  patientName: string;
};

export type EditScheduleErrors = ReturnType<typeof validateScheduleForm>;

export type EditScheduleContext = {
  scheduleId: string;

  selectedPatient: EditSchedulePatient;
  selectedMedication: EditScheduleMedication;

  form: ScheduleFormRequest;
  errors: EditScheduleErrors;

  updatedScheduleId: string | null;

  editSchedule: (payload: EditScheduleRequest) => Promise<EditScheduleResponse>;
};

export type EditScheduleMachineInput = {
  scheduleId: string;

  selectedPatient: EditSchedulePatient;
  selectedMedication: EditScheduleMedication;

  initialForm: ScheduleFormRequest;

  editSchedule: (payload: EditScheduleRequest) => Promise<EditScheduleResponse>;
};

export type EditScheduleEvent =
  | {
      type: "UPDATE_FORM";
      field: keyof ScheduleFormRequest;
      value: ScheduleFormRequest[keyof ScheduleFormRequest];
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

type SubmitEditScheduleInput = {
  scheduleId: string;
  form: ScheduleFormRequest;
  editSchedule: (payload: EditScheduleRequest) => Promise<EditScheduleResponse>;
};

export const editScheduleMachine = setup({
  types: {
    context: {} as EditScheduleContext,
    input: {} as EditScheduleMachineInput,
    events: {} as EditScheduleEvent,
  },

  guards: {
    isScheduleFormValid: ({ context }) => {
      return Object.keys(validateScheduleForm(context.form)).length === 0;
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

    validateScheduleForm: assign({
      errors: ({ context }) => ({
        ...context.errors,
        ...validateScheduleForm(context.form),
      }),
    }),

    assignUpdatedScheduleId: assign({
      updatedScheduleId: ({ context, event }) => {
        if (!("output" in event)) return context.scheduleId;
        return event.output.scheduleId || context.scheduleId;
      },
    }),

    assignSubmitError: assign({
      errors: ({ context }) => ({
        ...context.errors,
        form: "更新排程失敗，請稍後再試",
      }),
    }),

    reset: assign({
      form: ({ context }) => context.form,
      errors: {},
      updatedScheduleId: null,
    }),
  },

  actors: {
    submitEditSchedule: fromPromise(
      async ({ input }: { input: SubmitEditScheduleInput }) => {
        return input.editSchedule({
          scheduleId: input.scheduleId,
          ...input.form,
        });
      },
    ),
  },
}).createMachine({
  id: "editSchedule",

  initial: "fillRule",

  context: ({ input }) => ({
    scheduleId: input.scheduleId,

    selectedPatient: input.selectedPatient,
    selectedMedication: input.selectedMedication,

    form: input.initialForm,
    errors: {},

    updatedScheduleId: null,

    editSchedule: input.editSchedule,
  }),

  states: {
    fillRule: {
      on: {
        UPDATE_FORM: {
          actions: "updateForm",
        },

        NEXT: [
          {
            target: "confirm",
            guard: "isScheduleFormValid",
          },
          {
            actions: "validateScheduleForm",
          },
        ],
      },
    },

    confirm: {
      on: {
        BACK: {
          target: "fillRule",
        },

        SUBMIT: {
          target: "submitting",
        },
      },
    },

    submitting: {
      invoke: {
        src: "submitEditSchedule",
        input: ({ context }) => ({
          scheduleId: context.scheduleId,
          form: context.form,
          editSchedule: context.editSchedule,
        }),
        onDone: {
          target: "success",
          actions: "assignUpdatedScheduleId",
        },
        onError: {
          target: "failure",
          actions: "assignSubmitError",
        },
      },
    },

    failure: {
      on: {
        BACK: {
          target: "fillRule",
        },

        RETRY: {
          target: "submitting",
        },
      },
    },

    success: {
      type: "final",
    },
  },

  on: {
    RESET: {
      target: ".fillRule",
      actions: "reset",
    },
  },
});
