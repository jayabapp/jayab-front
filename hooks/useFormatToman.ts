import { useLocale, useTranslations } from "next-intl";
import { resolveLocale } from "@/i18n/config";

import formatToman from "@/helpers/formatToman";

export const useFormatToman = () => {
  const unit = useTranslations("common")("toman");
  const locale = resolveLocale(useLocale());
  return (value?: number | string | null) => formatToman(value, unit, locale);
};
