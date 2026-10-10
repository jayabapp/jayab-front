import { resolveLocale } from "@/i18n/config";
import { formatNumber } from "@/helpers/intl/number";
import { useLocale } from "next-intl";

export const useFormatNumber = () => {
  const locale = resolveLocale(useLocale());
  return (value?: number | string | null) => formatNumber(value, locale);
};
