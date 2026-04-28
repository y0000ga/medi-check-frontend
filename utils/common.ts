export const formatDateToYYYYMMDD = (value: Date | string) => {
  if (!value) return "未設定";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.toString();
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
};

export const parseDate = (value?: string | null) => {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return new Date();
  }

  return date;
};

export const formatTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${min}`;
};

export const formatTimeSlot = (value: string) => {
  if (/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value)) {
    return value.slice(0, 5);
  }

  return value;
};

export const formatTimeSlots = (values: string[]) => {
  if (!values.length) return "未設定";
  return values.map(formatTimeSlot).join("、");
};

export const formatScheduledTime = (value: string | Date) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.toString();
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};
