"use client";

import { cityTreeOptions } from "@features/cities/api/cities.options";
import { useQuery } from "@tanstack/react-query";
import { resolveLocale } from "@/i18n/config";
import { useLocale } from "next-intl";

/**
 * The province/city tree is a single long-lived cache entry shared by every city
 * picker on the page, so opening a second modal reuses the first response instead
 * of issuing a second request.
 */
export const useCityTree = (enabled = true) => {
  const locale = resolveLocale(useLocale());
  return useQuery({ ...cityTreeOptions(locale), enabled });
};
