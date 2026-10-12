"use client";

import { similarPropertiesOptions } from "@features/properties/api/property.options";
import { resolveLocale } from "@/i18n/config";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

export const useSimilarProperties = (id: number | string, enabled = true) => {
  const locale = resolveLocale(useLocale());
  return useQuery(similarPropertiesOptions(id, enabled, locale));
};
