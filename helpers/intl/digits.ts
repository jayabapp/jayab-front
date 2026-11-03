export type DisplayLocale = "fa" | "ar" | "en";

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";

export const normalizeDigits = (value: string): string =>
  value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const persian = PERSIAN.indexOf(digit);
    return String(persian >= 0 ? persian : ARABIC_INDIC.indexOf(digit));
  });

export const localizeDigits = (value: string, locale: DisplayLocale): string =>
  locale === "ar"
    ? value.replace(/\d/g, (digit) => ARABIC_INDIC[Number(digit)])
    : value;
