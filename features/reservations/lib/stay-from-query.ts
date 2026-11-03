import moment from "moment-jalaali";

export const stayFromQuery = (
  checkin?: string | null,
  checkout?: string | null,
): { start: Date; end: Date } | undefined => {
  if (!checkin || !checkout) return undefined;
  const start = moment(checkin);
  const end = moment(checkout);
  if (
    !start.isValid() ||
    !end.isValid() ||
    !end.isAfter(start) ||
    start.isBefore(moment().startOf("day"))
  )
    return undefined;
  return { start: start.toDate(), end: end.toDate() };
};

export const guestsFromQuery = (
  value?: string | null,
  maxCapacity?: number | null,
): string => {
  const guests = Number(value);
  if (!Number.isInteger(guests) || guests <= 0) return "";
  if (maxCapacity && guests > maxCapacity) return `${maxCapacity}+`;
  return `${guests}`;
};
