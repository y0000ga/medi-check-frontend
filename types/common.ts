export enum Action {
  Info = "info",
  Create = "create",
  Edit = "edit"
}
export enum DoseUnit {
  Mg = 'mg',
  Ml = 'ml',
  Tablet = 'tablet',
  Capsule = 'capsule',
  Package = 'package',
  Drop = 'drop'
}

export enum FrequencyUnit {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year'
}

export enum Weekday {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}

export enum DosageForm {
  Tablet = 'tablet',
  Capsule = 'capsule',
  Softgel = 'softgel',
  Liquid = 'liquid',
  Powder = 'powder',
  Pill = 'pill',
  Spray = 'spray'
}

export enum UserStatus {
  active = 'active',
  invited = 'invited',
  disabled = 'disabled'
}