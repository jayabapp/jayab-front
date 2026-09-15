"use client";

import { resolveQueryCities } from "@features/cities/lib/city-selection";
import { parseIdList } from "@features/cities/lib/city-selection";
import { useCityTree } from "@features/cities/hooks/useCityTree";
import { useMemo } from "react";

import type { ChildCities } from "@/api_services/city/city.interface";

import isEmpty from "lodash/isEmpty";

export const useUrlCityWithRegions = (
  query: Record<string, string> | undefined,
): ChildCities | null => {
  const cityIds = parseIdList(query?.cities);
  const hasSingleCity =
    cityIds.length === 1 && parseIdList(query?.provinces).length === 0;
  const cityId = hasSingleCity ? cityIds[0] : undefined;

  const { data: tree } = useCityTree(hasSingleCity);

  return useMemo(() => {
    if (!cityId) return null;
    const [city] = resolveQueryCities(tree, cityId);
    return city && !isEmpty(city.child) ? city : null;
  }, [cityId, tree]);
};
