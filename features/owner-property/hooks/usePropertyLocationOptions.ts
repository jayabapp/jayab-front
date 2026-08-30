"use client";

import { useCityTree } from "@features/cities/hooks/useCityTree";
import { useMemo } from "react";

export const usePropertyLocationOptions = (
  provinceId?: string | number | null,
  cityId?: string | number | null,
) => {
  const { data: provinces, isLoading } = useCityTree();

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
