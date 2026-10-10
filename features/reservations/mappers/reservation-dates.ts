import type { JalaliFormatter } from "@/helpers/intl/jalali";

import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

const JALALI_DATE = "jYYYY/jMM/jD";
const API_DATE = "YYYY-MM-DD";
const JALALI_DAY_MONTH = "jD jMMMM";
const JALALI_WEEKDAY_DAY_MONTH = "dddd، jD jMMMM";

const { jDaysInMonth } = moment as unknown as {
  jDaysInMonth: (year: number, zeroBasedMonth: number) => number;
};

export const jalaliDateToApiDate = (value: string) => {
  const parsed = moment(value, JALALI_DATE, true);
  const [year, month, day] = value.split("/").map(Number);
  const existsInCalendar =
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= jDaysInMonth(year, month - 1);
  if (!parsed.isValid() || !existsInCalendar)
    throw new Error("Invalid Jalali reservation date");
  return parsed.format(API_DATE);
};

export const apiDateToJalaliDate = (value: string | Date) =>
  moment(value).format(JALALI_DATE);

const persian: JalaliFormatter = (value, pattern) =>
  moment(value).format(pattern);

export const formatJalaliDay = (
  value?: string | Date | null,
  format: JalaliFormatter = persian,
) => (value ? format(value, JALALI_DAY_MONTH) : "");

export const formatJalaliWeekday = (
  value?: string | Date | null,
  format: JalaliFormatter = persian,
) => (value ? format(value, "dddd") : "");

export const formatJalaliWeekdayDay = (
  value?: string | Date | null,
  format: JalaliFormatter = persian,
) => (value ? format(value, JALALI_WEEKDAY_DAY_MONTH) : "");
