"use client";

import { cmsContentOptions } from "@features/home/api/home.options";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

export const useCmsContent = (key: string, options?: { enabled?: boolean }) => {
  const locale = useLocale();
  const query = useQuery({
    ...cmsContentOptions(key, key === "homeContent" ? locale : "fa"),
    enabled: options?.enabled ?? true,
  });
  return { ...query, content: query.data };
};
