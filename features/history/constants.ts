import { IntakeHistoryStatus } from "../schedule/types";

export const getStatusIcon = (status: IntakeHistoryStatus | null) => {
  switch (status) {
    case IntakeHistoryStatus.taken:
      return "checkmark-circle-outline";
    case IntakeHistoryStatus.missed:
      return "alert-circle-outline";
    case IntakeHistoryStatus.skipped:
      return "remove-circle-outline";
    case IntakeHistoryStatus.pending:
    default:
      return "time-outline";
  }
};

export const intakeHistoryStatusLabelMap: Record<IntakeHistoryStatus, string> =
  {
    [IntakeHistoryStatus.skipped]: "已略過",
    [IntakeHistoryStatus.pending]: "待確認",
    [IntakeHistoryStatus.taken]: "已服用",
    [IntakeHistoryStatus.missed]: "已逾時",
  };

export const INTAKE_HISTORY_STATUS_OPTIONS = Object.entries(
  intakeHistoryStatusLabelMap,
).map(([value, label]) => ({
  value,
  label,
})) as { value: IntakeHistoryStatus; label: string }[];

export const getStatusLabel = (status: IntakeHistoryStatus | null) => {
  switch (status) {
    case IntakeHistoryStatus.pending:
    case IntakeHistoryStatus.taken:
    case IntakeHistoryStatus.missed:
    case IntakeHistoryStatus.skipped:
      return intakeHistoryStatusLabelMap[status];
    default:
      return "未知";
  }
};
