import { useTranslations } from "next-intl";

import formatToman from "@/helpers/formatToman";

export const useFormatToman = () => {
  const unit = useTranslations("common")("toman");
  return (value?: number | string | null) => formatToman(value, unit);
};
