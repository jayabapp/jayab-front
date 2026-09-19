import moment from "moment-jalaali";

export const MAX_STAY_NIGHTS = 15;

const API_DATE = "YYYY-MM-DD";

export type StayRange = { end?: Date | null; start?: Date | null };
export type StayBlockReason = "past" | "reserved" | "too_long";
export type DayRangeState = "start" | "end" | "middle" | "idle";

export const toDayKey = (value: Date | string) =>
  moment(value).format(API_DATE);

export const startOfDay = (value: Date) =>
  moment(value).startOf("day").toDate();

export const nightsBetween = (start: Date, end: Date) =>
  moment(end).startOf("day").diff(moment(start).startOf("day"), "days");

export const reservedKeysFromDates = (
  dates?: ReadonlyArray<string | Date> | null,
) => new Set((dates ?? []).map((date) => moment.utc(date).format(API_DATE)));

export const lastSelectableCheckout = (
  start: Date,
  reserved: ReadonlySet<string>,
) => {
  for (let night = 1; night <= MAX_STAY_NIGHTS; night += 1) {
    const day = moment(start).add(night, "day");
    if (reserved.has(day.format(API_DATE))) return day.toDate();
  }
  return moment(start).add(MAX_STAY_NIGHTS, "day").toDate();
};

export const isDayDisabled = (
  day: Date,
  range: StayRange,
  reserved: ReadonlySet<string>,
  today: Date,
) => {
  if (day < today) return true;
  if (range.start && !range.end && day > range.start)
    return day > lastSelectableCheckout(range.start, reserved);
  return reserved.has(toDayKey(day));
};

export const selectDay = (
  day: Date,
  range: StayRange,
  reserved: ReadonlySet<string>,
  today: Date,
): { blocked?: StayBlockReason; range: StayRange } => {
  const picked = startOfDay(day);
  if (picked < today) return { blocked: "past", range };

  const startsNewStay = !range.start || !!range.end || picked <= range.start;
  if (startsNewStay) {
    if (reserved.has(toDayKey(picked))) return { blocked: "reserved", range };
    return { range: { end: null, start: picked } };
  }

  if (nightsBetween(range.start as Date, picked) > MAX_STAY_NIGHTS)
    return { blocked: "too_long", range };
  if (picked > lastSelectableCheckout(range.start as Date, reserved))
    return { blocked: "reserved", range };

  return { range: { end: picked, start: range.start } };
};

export const dayRangeState = (day: Date, range: StayRange): DayRangeState => {
  if (!range.start) return "idle";
  if (moment(day).isSame(range.start, "day")) return "start";
  if (!range.end) return "idle";
  if (moment(day).isSame(range.end, "day")) return "end";
  return day > range.start && day < range.end ? "middle" : "idle";
};

export const isCompleteRange = (
  range?: StayRange | null,
): range is { end: Date; start: Date } => !!range?.start && !!range?.end;
