import { type DisplayLocale, localizeDigits } from "./digits";

const ARABIC_THOUSANDS = "٬";

export const formatNumber = (
  value: number | string | null | undefined,
  locale: DisplayLocale = "fa",
): string => {
  const text = value
    ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "0";
  return locale === "ar"
    ? localizeDigits(text.replace(/,/g, ARABIC_THOUSANDS), locale)
    : text;
};

export const formatTomanAmount = (
  value: number | string | null | undefined,
  unit: string,
  locale: DisplayLocale = "fa",
): string => `${formatNumber(value ?? 0, locale)} ${unit}`;

export const formatCalendarCellPriceFor = (
  value: number | null | undefined,
  locale: DisplayLocale = "fa",
): string => {
  if (!value || value <= 0) return "";
  return localizeDigits(`${Math.round(value / 1000)}`, locale);
};
