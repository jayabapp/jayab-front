"use client";

import { useMemo, useSyncExternalStore } from "react";
import { resolveQueryCities } from "@features/cities/lib/city-selection";
import { useCityTree } from "@features/cities/hooks/useCityTree";
import { parseIdList } from "@features/cities/lib/city-selection";

import type { ChildCities } from "@/api_services/city/city.interface";

import isEmpty from "lodash/isEmpty";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export const useUrlCityWithRegions = (
  query: Record<string, string> | undefined,
): ChildCities | null => {
  const hydrated = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const cityIds = parseIdList(query?.cities);
  const hasSingleCity =
    cityIds.length === 1 && parseIdList(query?.provinces).length === 0;
  const cityId = hasSingleCity ? cityIds[0] : undefined;

  const { data: tree } = useCityTree(hasSingleCity);

  return useMemo(() => {
    if (!hydrated || !cityId) return null;
    const [city] = resolveQueryCities(tree, cityId);
    return city && !isEmpty(city.child) ? city : null;
  }, [cityId, hydrated, tree]);
};
