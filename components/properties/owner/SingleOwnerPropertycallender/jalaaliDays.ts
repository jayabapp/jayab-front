import { JalaaliDayDto } from "@/api_services/property/property.interface";

import moment from "moment-jalaali";

export const toJalaaliDays = (dates: string[]): JalaaliDayDto[] => {
  return dates
    .filter((date) => !!date)
    .map((date) => {
      const parsed = moment(date, "jYYYY/jMM/jD");
      return {
        day: Number(parsed.format("jD")),
        month: Number(parsed.format("jM")),
        year: Number(parsed.format("jYYYY")),
      };
    });
};
