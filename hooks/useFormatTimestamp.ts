import { formatTimestamp } from "@/helpers/intl/chat-time";
import { resolveLocale } from "@/i18n/config";
import { useLocale } from "next-intl";

export const useFormatTimestamp = () => {
  const locale = resolveLocale(useLocale());
  return (
    value: string | number | Date | null | undefined,
    dayStyle?: "2-digit" | "numeric",
  ) => formatTimestamp(value, locale, dayStyle);
};
