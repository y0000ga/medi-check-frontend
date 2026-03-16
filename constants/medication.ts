import { DosageForm, DoseUnit } from "@/types/common"


export const MEDICATION_DOSAGE_FORM = {
    [DosageForm.Capsule]: '膠囊',
    [DosageForm.Softgel]: '軟膠囊',
    [DosageForm.Tablet]: '藥片',
    [DosageForm.Liquid]: '液體',
    [DosageForm.Powder]: '粉末',
    [DosageForm.Pill]: '藥丸',
    [DosageForm.Spray]: '噴霧'
}

export const DOSE_UNIT_LABELS = {
    [DoseUnit.Mg]: "毫克",
    [DoseUnit.Ml]: "毫升",
    [DoseUnit.Tablet]: "錠",
    [DoseUnit.Capsule]: "顆",
    [DoseUnit.Package]: "包",
    [DoseUnit.Drop]: "滴",
} as const;