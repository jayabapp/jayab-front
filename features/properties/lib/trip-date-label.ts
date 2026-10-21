import type { JalaliFormatter } from "@/helpers/intl/jalali";

import moment from "moment-jalaali";

/** Repeat the month only when the selected dates span different Jalali months. */
export const tripDateLabel = (
  checkin: string,
  checkout: string,
  separator: string,
  format: JalaliFormatter,
): string => {
  const sameMonth =
    moment(checkin).format("jYYYY/jMM") ===
    moment(checkout).format("jYYYY/jMM");
  const start = format(checkin, sameMonth ? "jD" : "jD jMMMM");
  return `${start} ${separator} ${format(checkout, "jD jMMMM")}`;
};
