import type { Translate } from "@/types/i18n";

import moment from "moment-jalaali";

// Index = moment().day() (0 = Sunday); the Jalali week starts on Saturday.
const WEEK_DAYS = [
  { id: 6, key: "calendar.inquirySat" },
  { id: 0, key: "calendar.inquirySun" },
  { id: 1, key: "calendar.inquiryMon" },
  { id: 2, key: "calendar.inquiryTue" },
  { id: 3, key: "calendar.inquiryWed" },
  { id: 4, key: "calendar.inquiryThu" },
  { id: 5, key: "calendar.inquiryFri" },
];

export const upcomingWeekDays = (t: Translate) => {
  const today = moment().day();
  return Array.from({ length: 7 }, (_, offset) => {
    const index = (today + offset) % 7;
    const day = WEEK_DAYS.find((entry) => entry.id == index);
    return day ? { id: day.id, title: t(day.key) } : undefined;
  });
};
