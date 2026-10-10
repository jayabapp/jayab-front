import { resolveLocale } from "@/i18n/config";
import { formatNumber } from "@/helpers/intl/number";
import { useLocale } from "next-intl";

import Num2persian from "@/helpers/Num2Persian";

export const useAmountInWords = () => {
  const locale = resolveLocale(useLocale());
  return (value: number | string) =>
    locale === "fa" ? Num2persian(value) : formatNumber(value, locale);
};
