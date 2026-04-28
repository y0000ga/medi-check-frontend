import { DoseUnit, FrequencyUnit, ScheduleEndType } from "../schedule/types";
import { DosageForm } from "./types";

export const getDosageFormIcon = (value?: DosageForm) => {
  switch (value) {
    case DosageForm.Tablet:
    case DosageForm.Pill:
      return "medical-outline";
    case DosageForm.Capsule:
    case DosageForm.Softgel:
      return "ellipse-outline";
    case DosageForm.Liquid:
      return "water-outline";
    case DosageForm.Powder:
      return "flask-outline";
    case DosageForm.Spray:
      return "sparkles-outline";
    default:
      return "medkit-outline";
  }
};

export const dosageFormLabelMap: Record<DosageForm, string> = {
  [DosageForm.Tablet]: "錠劑",
  [DosageForm.Capsule]: "膠囊",
  [DosageForm.Softgel]: "軟膠囊",
  [DosageForm.Pill]: "藥丸",

  [DosageForm.Liquid]: "液體",
  [DosageForm.Syrup]: "糖漿",
  [DosageForm.Suspension]: "懸浮液",
  [DosageForm.Drops]: "滴劑",

  [DosageForm.Powder]: "粉末",
  [DosageForm.Granule]: "顆粒",
  [DosageForm.Sachet]: "藥包",

  [DosageForm.Injection]: "注射劑",
  [DosageForm.Vial]: "小瓶針劑",
  [DosageForm.Ampoule]: "安瓿",

  [DosageForm.Inhaler]: "吸入劑",
  [DosageForm.Spray]: "噴劑",
  [DosageForm.NebulizerSolution]: "霧化液",

  [DosageForm.Cream]: "乳膏",
  [DosageForm.Ointment]: "軟膏",
  [DosageForm.Gel]: "凝膠",
  [DosageForm.Lotion]: "乳液",

  [DosageForm.Patch]: "貼片",
  [DosageForm.Suppository]: "栓劑",
  [DosageForm.EyeDrops]: "眼藥水",
  [DosageForm.EarDrops]: "耳滴劑",
  [DosageForm.NasalSpray]: "鼻噴劑",

  [DosageForm.Other]: "其他",
};

export const DOSAGE_FORM_OPTIONS = Object.entries(dosageFormLabelMap).map(
  ([value, label]) => ({
    value,
    label,
  }),
) as { value: DosageForm; label: string }[];

export const doseUnitLabelMap: Record<DoseUnit, string> = {
  [DoseUnit.Mcg]: "微克",
  [DoseUnit.Mg]: "毫克",
  [DoseUnit.G]: "公克",

  [DoseUnit.Ml]: "毫升",
  [DoseUnit.L]: "公升",
  [DoseUnit.Drop]: "滴",

  [DoseUnit.Tablet]: "錠",
  [DoseUnit.Capsule]: "顆膠囊",
  [DoseUnit.Pill]: "顆",
  [DoseUnit.Packet]: "包",
  [DoseUnit.Sachet]: "小包",
  [DoseUnit.Piece]: "個",

  [DoseUnit.Spray]: "噴",
  [DoseUnit.Puff]: "吸",
  [DoseUnit.Patch]: "片",
  [DoseUnit.Application]: "次塗抹",
  [DoseUnit.Suppository]: "顆栓劑",

  [DoseUnit.Tsp]: "茶匙",
  [DoseUnit.Tbsp]: "湯匙",
  [DoseUnit.Cup]: "杯",

  [DoseUnit.Unit]: "單位",
  [DoseUnit.Iu]: "國際單位",
  [DoseUnit.Meq]: "毫當量",
  [DoseUnit.Percent]: "%",

  [DoseUnit.Other]: "其他",
};

export const DOSE_UNIT_OPTIONS = Object.entries(doseUnitLabelMap).map(
  ([value, label]) => ({
    value,
    label,
  }),
) as { value: DoseUnit; label: string }[];

export const frequencyUnitOptions = [
  { label: "每天 / 每 N 天", value: FrequencyUnit.day },
  { label: "每週 / 每 N 週", value: FrequencyUnit.week },
  { label: "每月 / 每 N 月", value: FrequencyUnit.month },
  { label: "每年 / 每 N 年", value: FrequencyUnit.year },
];

export const endTypeOptions = [
  { label: "一次性排程", value: null },
  { label: "永不結束", value: ScheduleEndType.never },
  { label: "到指定日期", value: ScheduleEndType.until },
  { label: "指定次數", value: ScheduleEndType.counts },
];

export const getFrequencyUnitLabel = (value?: FrequencyUnit | null) => {
  switch (value) {
    case FrequencyUnit.day:
      return "天";
    case FrequencyUnit.week:
      return "週";
    case FrequencyUnit.month:
      return "月";
    case FrequencyUnit.year:
      return "年";
    default:
      return "未設定";
  }
};
