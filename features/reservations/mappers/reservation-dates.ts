import moment from "moment-jalaali";

const JALALI_DATE = "jYYYY/jMM/jD";
const API_DATE = "YYYY-MM-DD";

export const jalaliDateToApiDate = (value: string) => {
  const parsed = moment(value, JALALI_DATE, true);
  if (!parsed.isValid()) throw new Error("Invalid Jalali reservation date");
  return parsed.format(API_DATE);
};

export const apiDateToJalaliDate = (value: string | Date) =>
  moment(value).format(JALALI_DATE);
