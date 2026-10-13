import { localizeDigits } from "@/helpers/intl/digits";
import { resolveLocale } from "@/i18n/config";
import { useLocale } from "next-intl";

export const useLocalizeDigits = () => {
  const locale = resolveLocale(useLocale());
  return (value: number | string) => localizeDigits(String(value), locale);
};
