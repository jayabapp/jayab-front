import type { JalaliFormatter } from "@/helpers/intl/jalali";

import moment from "moment-jalaali";

export const tripDateLabel = (
  checkin: string,
  checkout: string,
  separator: string,
  format: JalaliFormatter,
): string => {
  const first = moment(checkin);
  const last = moment(checkout);
  const crossesYear = first.jYear() !== last.jYear();
  const sameMonth = !crossesYear && first.jMonth() === last.jMonth();

  const startPattern = crossesYear
    ? "jD jMMMM jYYYY"
    : sameMonth
      ? "jD"
      : "jD jMMMM";
  const endPattern = crossesYear ? "jD jMMMM jYYYY" : "jD jMMMM";
  return `${format(checkin, startPattern)} ${separator} ${format(checkout, endPattern)}`;
};
