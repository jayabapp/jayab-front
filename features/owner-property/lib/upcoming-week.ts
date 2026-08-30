import { WeekDays } from "@/utils/constantss";

import moment from "moment-jalaali";

export const upcomingWeekDays = () => {
  const today = moment().day();
  return Array.from({ length: 7 }, (_, offset) => {
    const index = (today + offset) % 7;
    return WeekDays.find((day) => day?.id == index);
  });
};
