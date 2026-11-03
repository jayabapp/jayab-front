import { type DisplayLocale, localizeDigits } from "./digits";

import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

export type JalaliLabels = {
  months: readonly string[];
  weekdays: readonly string[];
};

type JalaliInput = string | number | Date | null | undefined;

export type JalaliFormatter = (value: JalaliInput, pattern: string) => string;

export const formatJalaliDisplay = (
  value: JalaliInput,
  pattern: string,
  locale: DisplayLocale,
  labels?: JalaliLabels,
): string => {
  if (locale === "fa" || !labels) return moment(value).format(pattern);
  const date = moment(value).locale("en");
  const literal = (text: string) => `[${text}]`;
  const withNames = (locale === "en" ? pattern.replace(/،/g, ",") : pattern)
    .replace(/jMMMM/g, () => literal(labels.months[date.jMonth()] ?? ""))
    .replace(/dddd/g, () => literal(labels.weekdays[date.day()] ?? ""))
    .replace(/ddd/g, () => literal(labels.weekdays[date.day()] ?? ""));
  return localizeDigits(date.format(withNames), locale);
};
