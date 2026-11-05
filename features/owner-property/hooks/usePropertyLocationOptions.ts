"use client";

import { useCityTree } from "@features/cities/hooks/useCityTree";
import { useMemo } from "react";

import type { Locale } from "@/i18n/config";

export const usePropertyLocationOptions = (
  provinceId?: string | number | null,
  cityId?: string | number | null,
  locale?: Locale,
) => {
  const { data: provinces, isLoading } = useCityTree(true, locale);

  const cities = useMemo(
    () =>
      provinces?.find((province) => province?.id == provinceId)?.child ?? [],
    [provinces, provinceId],
  );

  const regions = useMemo(
    () => cities?.find((city) => city?.id == cityId)?.child ?? [],
    [cities, cityId],
  );

  return { cities, isLoading, provinces: provinces ?? [], regions };
};
