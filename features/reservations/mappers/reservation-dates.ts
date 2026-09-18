import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

const JALALI_DATE = "jYYYY/jMM/jD";
const API_DATE = "YYYY-MM-DD";
const JALALI_DAY_MONTH = "jD jMMMM";
const JALALI_WEEKDAY_DAY_MONTH = "dddd، jD jMMMM";

export const jalaliDateToApiDate = (value: string) => {
  const parsed = moment(value, JALALI_DATE, true);
  if (!parsed.isValid()) throw new Error("Invalid Jalali reservation date");
  return parsed.format(API_DATE);
};

export const apiDateToJalaliDate = (value: string | Date) =>
  moment(value).format(JALALI_DATE);

export const formatJalaliDay = (value?: string | Date | null) =>
  value ? moment(value).format(JALALI_DAY_MONTH) : "";

export const formatJalaliWeekdayDay = (value?: string | Date | null) =>
  value ? moment(value).format(JALALI_WEEKDAY_DAY_MONTH) : "";
