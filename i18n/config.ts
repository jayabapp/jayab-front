export const supportedLocales = ["fa", "ar", "en"] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = "fa";
export const LOCALE_COOKIE = "jayab_locale";

export const isLocale = (value: unknown): value is Locale =>
  supportedLocales.some((locale) => locale === value);

export const parseEnabledLocales = (
  raw: string | undefined,
): readonly Locale[] => {
  const configured = (raw ?? "").split(",").map((value) => value.trim());
  return supportedLocales.filter(
    (locale) => locale === defaultLocale || configured.includes(locale),
  );
};

export const enabledLocales = parseEnabledLocales(
  process.env.NEXT_PUBLIC_ENABLED_LOCALES,
);

export const isEnabledLocale = (value: unknown): value is Locale =>
  isLocale(value) && enabledLocales.includes(value);

export const resolveLocale = (value: unknown): Locale =>
  isEnabledLocale(value) ? value : defaultLocale;

export const dirOf = (locale: Locale): "rtl" | "ltr" =>
  locale === "en" ? "ltr" : "rtl";

export const localeMeta = {
  fa: {
    name: "فارسی",
    lang: "fa-IR",
    formatLocale: "fa-IR",
    numberingSystem: "latn",
  },
  ar: {
    name: "العربية",
    lang: "ar",
    formatLocale: "ar",
    numberingSystem: "arab",
  },
  en: {
    name: "English",
    lang: "en",
    formatLocale: "en-US",
    numberingSystem: "latn",
  },
} as const;
