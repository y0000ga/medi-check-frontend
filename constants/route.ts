import { Action } from "@/types/common";
import type { Href } from "expo-router";

export const routes = {
  public: {
    signIn: "/sign-in" as Href,
    signUp: "/sign-up" as Href,
    forgotPassword: "/forgot-password" as Href,
    resetPassword: "/reset-password" as Href,
    resetPasswordWithEmail: (email: string) =>
      ({
        pathname: "/reset-password" as const,
        params: { email },
      }) as const,
  },
  protected: {
    home: "/(protected)/(tabs)" as Href,
    history: "/history" as Href,
    medication: "/medication" as Href,
    me: "/me" as Href,
    modal: {
      viewer: "/me/viewer" as Href,
      profile: "/me/profile" as Href,
      security: "/me/security" as Href,
      careNetwork: "/me/care-network" as Href,
      historyDetail: (id: string) =>
        ({
          pathname: "/history/[id]" as const,
          params: { id },
        }) as const,
      scheduleAction: (action: Action, id?: string) =>
        ({
          pathname: "/schedule/[action]" as const,
          params: id ? { action, id } : { action },
        }) as const,
      createSchedule: () =>
        ({
          pathname: "/schedule/[action]" as const,
          params: { action: Action.Create },
        }) as const,
      editSchedule: (id: string) =>
        ({
          pathname: "/schedule/[action]" as const,
          params: { action: Action.Edit, id },
        }) as const,
      infoSchedule: (id: string) =>
        ({
          pathname: "/schedule/[action]" as const,
          params: { action: Action.Info, id },
        }) as const,
      medicationAction: (action: Action, id?: string) =>
        ({
          pathname: "/medication/[action]" as const,
          params: id ? { action, id } : { action },
        }) as const,
      createMedication: () =>
        ({
          pathname: "/medication/[action]" as const,
          params: { action: Action.Create },
        }) as const,
      editMedication: (id: string) =>
        ({
          pathname: "/medication/[action]" as const,
          params: { action: Action.Edit, id },
        }) as const,
      infoMedication: (id: string) =>
        ({
          pathname: "/medication/[action]" as const,
          params: { action: Action.Info, id },
        }) as const,
    },
  },
} as const;
