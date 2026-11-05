"use client";

import { cityTreeOptions } from "@features/cities/api/cities.options";
import { resolveLocale } from "@/i18n/config";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import type { Locale } from "@/i18n/config";

export const useCityTree = (enabled = true, locale?: Locale) => {
  const readerLocale = resolveLocale(useLocale());
  return useQuery({ ...cityTreeOptions(locale ?? readerLocale), enabled });
};
