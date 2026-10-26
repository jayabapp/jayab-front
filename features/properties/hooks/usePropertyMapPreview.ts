"use client";

import { propertyMapPreviewOptions } from "@features/properties/api/property.options";
import { resolveLocale } from "@/i18n/config";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import type { PropertyListDto } from "@/api_services/property/property.interface";

export const usePropertyMapPreview = (
  id: number | null,
  loaded: readonly PropertyListDto[],
) => {
  const locale = resolveLocale(useLocale());
  const known = id === null ? undefined : loaded.find((item) => item.id === id);
  const query = useQuery(propertyMapPreviewOptions(id, locale, !known));
  return {
    property: known ?? query.data ?? null,
    isPending: id !== null && !known && query.isPending,
    isError: id !== null && !known && query.isError,
    retry: () => void query.refetch(),
  };
};
