import { useLocale, useTranslations } from "next-intl";
import { formatJalaliDisplay } from "@/helpers/intl/jalali";
import { resolveLocale } from "@/i18n/config";
import { useCallback } from "react";

import { type JalaliFormatter } from "@/helpers/intl/jalali";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const useJalaliFormat = (): JalaliFormatter => {
  const locale = resolveLocale(useLocale());
  const t = useTranslations("calendar");
  return useCallback<JalaliFormatter>(
    (value, pattern) =>
      formatJalaliDisplay(value, pattern, locale, {
        months: Array.from({ length: 12 }, (_, index) =>
          t(`jMonth${index + 1}` as "jMonth1"),
        ),
        weekdays: WEEKDAYS.map((day) => t(`inquiry${day}`)),
      }),
    [locale, t],
  );
};
