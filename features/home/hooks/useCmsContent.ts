"use client";

import { cmsContentOptions } from "@features/home/api/home.options";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import type { Locale } from "@/i18n/config";

const LOCALIZED_KEYS = [
  "homeContent",
  "terms",
  "reportTitles",
  "max-reserve-content",
];

export const useCmsContent = (
  key: string,
  options?: { enabled?: boolean; locale?: Locale },
) => {
  const locale = useLocale();
  const query = useQuery({
    ...cmsContentOptions(
      key,
      options?.locale ?? (LOCALIZED_KEYS.includes(key) ? locale : "fa"),
    ),
    enabled: options?.enabled ?? true,
  });
  return { ...query, content: query.data };
};
