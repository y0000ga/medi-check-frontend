export const colors = {
  light: {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceMuted: "#F1F5F9",

    text: "#0F172A",
    textMuted: "#64748B",
    placeholder: "#94A3B8",

    primary: "#2563EB",
    primaryPressed: "#1D4ED8",
    primarySoft: "#DBEAFE",

    border: "#CBD5E1",
    borderMuted: "#E2E8F0",

    error: "#DC2626",
    errorSoft: "#FEE2E2",

    success: "#16A34A",
    warning: "#D97706",

    disabledBackground: "#F1F5F9",
    disabledText: "#94A3B8",
  },

  dark: {
    background: "#020617",
    surface: "#0F172A",
    surfaceMuted: "#1E293B",

    text: "#F8FAFC",
    textMuted: "#94A3B8",
    placeholder: "#64748B",

    primary: "#60A5FA",
    primaryPressed: "#3B82F6",
    primarySoft: "#1E3A8A",

    border: "#334155",
    borderMuted: "#1E293B",

    error: "#F87171",
    errorSoft: "#7F1D1D",

    success: "#4ADE80",
    warning: "#FBBF24",

    disabledBackground: "#1E293B",
    disabledText: "#64748B",
  },
};

export type AppColorTheme = typeof colors.light;
