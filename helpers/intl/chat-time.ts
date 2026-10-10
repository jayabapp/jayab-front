import { type DisplayLocale, localizeDigits } from "./digits";

const TEHRAN = "Asia/Tehran";

const parts = (
  date: Date,
  options: Intl.DateTimeFormatOptions,
  locale: string,
) =>
  Object.fromEntries(
    new Intl.DateTimeFormat(locale, { timeZone: TEHRAN, ...options })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );

export const formatTimestamp = (
  value: string | number | Date | null | undefined,
  locale: DisplayLocale = "fa",
  dayStyle: "2-digit" | "numeric" = "2-digit",
): string => {
  if (value === null || value === undefined || value === "") return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const time = parts(
    date,
    { hour: "2-digit", minute: "2-digit", hourCycle: "h23" },
    "en-US-u-nu-latn",
  );
  const day = parts(
    date,
    { year: "numeric", month: "2-digit", day: dayStyle },
    "en-US-u-ca-persian-nu-latn",
  );
  return localizeDigits(
    `${time.hour}:${time.minute} - ${day.year}/${day.month}/${day.day}`,
    locale,
  );
};
