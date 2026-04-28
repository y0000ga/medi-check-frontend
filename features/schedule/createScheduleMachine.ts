import { assign, fromPromise, setup } from "xstate";
import {
  CreateScheduleRequest,
  CreateScheduleResponse,
  DoseUnit,
  ScheduleFormRequest,
} from "./types";
import { validateScheduleForm } from "./validators";
import { DosageForm } from "@/features/medication/types";
import dayjs from "dayjs";

export type SelectedSchedulePatient = {
  id: string;
  name: string;
};

export type SelectedScheduleMedication = {
  id: string;
  name: string;
  dosageForm: DosageForm;
  patientId: string;
  patientName: string;
};

export type CreateScheduleErrors = ReturnType<typeof validateScheduleForm> & {
  patient?: string;
  medication?: string;
};

export type CreateScheduleContext = {
  selectedPatient: SelectedSchedulePatient | null;
  selectedMedication: SelectedScheduleMedication | null;

  form: ScheduleFormRequest;

  errors: CreateScheduleErrors;
  createdScheduleId: string | null;

  createSchedule: (
    payload: CreateScheduleRequest,
  ) => Promise<CreateScheduleResponse>;
};

export type CreateScheduleMachineInput = {
  createSchedule: (
    payload: CreateScheduleRequest,
  ) => Promise<CreateScheduleResponse>;
};

export type CreateScheduleEvent =
  | {
      type: "SELECT_PATIENT";
      patient: SelectedSchedulePatient;
    }
  | {
      type: "SELECT_MEDICATION";
      medication: SelectedScheduleMedication;
    }
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

type SubmitCreateScheduleInput = {
  selectedMedication: SelectedScheduleMedication | null;
  form: ScheduleFormRequest;
  createSchedule: (
    payload: CreateScheduleRequest,
  ) => Promise<CreateScheduleResponse>;
};

const getInitialScheduleForm = (): ScheduleFormRequest => ({
  timezone: "Asia/Taipei",
  startDate: dayjs().format("YYYY-MM-DD"),
  timeSlots: ["13:30"],

  amount: 1,
  doseUnit: DoseUnit.Mg,

  /**
   * null = one-time
   */
  endType: null,

  frequencyUnit: null,
  interval: null,
  weekdays: [],

  untilDate: null,
  occurrenceCount: null,
});

export const createScheduleMachine = setup({
  types: {
    context: {} as CreateScheduleContext,
    input: {} as CreateScheduleMachineInput,
    events: {} as CreateScheduleEvent,
  },

  guards: {
    isScheduleFormValid: ({ context }) => {
      return Object.keys(validateScheduleForm(context.form)).length === 0;
    },
  },

  actions: {
    selectPatient: assign({
      selectedPatient: ({ event }) => {
        if (event.type !== "SELECT_PATIENT") return null;
        return event.patient;
      },

      /**
       * 換病人時，藥品必須重選。
       */
      selectedMedication: null,

      errors: ({ context }) => ({
        ...context.errors,
        patient: undefined,
        medication: undefined,
        form: undefined,
      }),
    }),

    selectMedication: assign({
      selectedMedication: ({ event }) => {
        if (event.type !== "SELECT_MEDICATION") return null;
        return event.medication;
      },

      errors: ({ context }) => ({
        ...context.errors,
        medication: undefined,
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

    validateScheduleForm: assign({
      errors: ({ context }) => ({
        ...context.errors,
        ...validateScheduleForm(context.form),
      }),
    }),

    assignCreatedScheduleId: assign({
      createdScheduleId: ({ event }) => {
        if (!("output" in event)) return null;
        return event.output.id;
      },
    }),

    assignSubmitError: assign({
      errors: ({ context }) => ({
        ...context.errors,
        form: "新增排程失敗，請稍後再試",
      }),
    }),

    reset: assign({
      selectedPatient: null,
      selectedMedication: null,
      form: getInitialScheduleForm(),
      errors: {},
      createdScheduleId: null,
    }),
  },

  actors: {
    submitCreateSchedule: fromPromise(
      async ({ input }: { input: SubmitCreateScheduleInput }) => {
        if (!input.selectedMedication) {
          throw new Error("Missing selected medication");
        }

        return input.createSchedule({
          medicationId: input.selectedMedication.id,
          ...input.form,
        });
      },
    ),
  },
}).createMachine({
  id: "createSchedule",

  initial: "selectPatient",

  context: ({ input }) => ({
    selectedPatient: null,
    selectedMedication: null,
    form: getInitialScheduleForm(),
    errors: {},
    createdScheduleId: null,
    createSchedule: input.createSchedule,
  }),

  states: {
    selectPatient: {
      on: {
        SELECT_PATIENT: {
          target: "selectMedication",
          actions: "selectPatient",
        },
      },
    },

    selectMedication: {
      on: {
        SELECT_MEDICATION: {
          target: "fillRule",
          actions: "selectMedication",
        },

        BACK: {
          target: "selectPatient",
        },
      },
    },

    fillRule: {
      on: {
        UPDATE_FORM: {
          actions: "updateForm",
        },

        BACK: {
          target: "selectMedication",
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
        src: "submitCreateSchedule",
        input: ({ context }) => ({
          selectedMedication: context.selectedMedication,
          form: context.form,
          createSchedule: context.createSchedule,
        }),
        onDone: {
          target: "success",
          actions: "assignCreatedScheduleId",
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
      target: ".selectPatient",
      actions: "reset",
    },
  },
});
