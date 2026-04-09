import {
  DOSE_UNIT_LABELS,
  MEDICATION_DOSAGE_FORM,
} from "@/constants/medication";
import { IRES_Medication } from "@/types/api";
import { PermissionLevel } from "@/types/api/care-invitation";
import { DosageForm } from "@/types/common";
import { IEvent } from "@/types/schedule";
import dayjs from "dayjs";

export const evaluteStatus = ({
  intakenTime,
  scheduledTime,
}: Pick<IEvent, "scheduledTime" | "intakenTime">) => {
  const now = dayjs();
  const scheduledAt = dayjs(scheduledTime);
  const isIntaken = Boolean(intakenTime);
  const lastIntakeTime = scheduledAt.add(1, "hour");

  let isOperable = false;
  let isMissed = false;

  // 未到時間
  if (now.isBefore(scheduledAt)) {
  }
  // 已到時間，且仍在可服用時間內
  else if (
    now.isBefore(lastIntakeTime) ||
    now.isSame(lastIntakeTime)
  ) {
    isOperable = true;
  }
  // 已逾時
  else {
    isMissed = true;
  }

  return {
    isIntaken,
    isOperable,
    isMissed,
  };
};

export const evaluateDosageFormIcon = ({
  dosageForm,
}: {
  dosageForm: IRES_Medication["dosageForm"] | null;
}) => {
  let name = "local-hospital";
  let color = "#3C83F6";
  let backgroundColor = "#DBEAFE";
  switch (dosageForm) {
    case DosageForm.Spray:
      name = "air";
      color = "#FB923C";
      backgroundColor = "#FFEDD5";
      break;
    case DosageForm.Liquid:
      name = "water-drop";
      color = "#10B981";
      backgroundColor = "#D1FAE5";
      break;
    default:
      break;
  }

  return {
    name,
    color,
    backgroundColor,
  };
};

export const evaluateLabel = ({
  medicationDosageForm,
  doseUnit,
  amount,
}: Pick<IEvent, "medicationDosageForm" | "doseUnit" | "amount">) => {
  const list: string[] = [amount.toString()];

  if (doseUnit) {
    list.push(DOSE_UNIT_LABELS[doseUnit]);
  }

  if (!doseUnit && medicationDosageForm) {
    list.push(`單位${MEDICATION_DOSAGE_FORM[medicationDosageForm]}`);
  }

  if (!doseUnit && !medicationDosageForm) {
    list.push("單位");
  }

  return {
    label: list.join(" "),
    icon: evaluateDosageFormIcon({
      dosageForm: medicationDosageForm,
    }),
  };
};

export const createEnumOptions = <T extends Record<string, string>>(
  enumObj: T,
  label: Record<T[keyof T], string>,
) => {
  const values = Object.values(enumObj) as T[keyof T][];

  return values.map((value) => ({
    value,
    label: label[value],
  }));
};
