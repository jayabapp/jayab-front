import type { StayMonthRef } from "@/types/components/modules/property-booking";

import moment from "moment-jalaali";

export const STAY_MONTH_HORIZON = 12;

export const stayMonths = (offset: number, count: number): StayMonthRef[] =>
  Array.from({ length: count }, (_, index) => {
    const month = moment()
      .startOf("jMonth")
      .add(offset + index, "jMonth");
    return { month: month.jMonth() + 1, year: month.jYear() };
  });
