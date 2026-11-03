"use client";

import { useDiscoveryQueryReplace } from "@features/properties/hooks/useDiscoveryQueryReplace";
import { resetDiscoveryFilters } from "@features/properties/lib/discovery-filter-policy";
import { useCallback, useState } from "react";
import { extraDiscoveryFilters } from "@features/properties/lib/discovery-filter-policy";
import { useDiscoveryBaseline } from "@features/properties/context/DiscoveryContext";
import { countActiveFilters } from "@features/properties/lib/count-active-filters";
import { useDiscoveryQuery } from "@features/properties/context/DiscoveryContext";

import type { PropertyDiscoveryFilters } from "@/types/features/properties";

import queryBuilder from "@/helpers/queryBuilder";

export const usePropertyDiscoveryFilters = ({
  hiddenFilters = [],
}: {
  hiddenFilters?: string[];
} = {}) => {
  const baseline = useDiscoveryBaseline();
  const replaceQuery = useDiscoveryQueryReplace();
  const queries = useDiscoveryQuery() as PropertyDiscoveryFilters;
  const appliedKey = queryBuilder(queries);

  const [draft, setDraft] = useState<{
    key: string;
    filters: PropertyDiscoveryFilters;
  }>({ key: appliedKey, filters: queries });

  if (draft.key !== appliedKey) setDraft({ key: appliedKey, filters: queries });

  const setFilters = useCallback(
    (
      next:
        | PropertyDiscoveryFilters
        | ((current: PropertyDiscoveryFilters) => PropertyDiscoveryFilters),
    ) =>
      setDraft((current) => ({
        ...current,
        filters: typeof next === "function" ? next(current.filters) : next,
      })),
    [],
  );

  const applyFilters = useCallback(() => {
    const body: Record<string, unknown> = { ...draft.filters };
    delete body.categories;
    for (const key of hiddenFilters) delete body[key];
    replaceQuery(body);
  }, [draft.filters, hiddenFilters, replaceQuery]);

  const resetDraft = useCallback(
    () => setDraft({ key: appliedKey, filters: queries }),
    [appliedKey, queries],
  );

  const clearExtraFilters = useCallback(() => {
    const body = resetDiscoveryFilters(queries, baseline);
    setDraft((current) => ({
      ...current,
      filters: body as PropertyDiscoveryFilters,
    }));
    replaceQuery(body);
  }, [baseline, queries, replaceQuery]);

  return {
    queries,
    baseline,
    resetDraft,
    setFilters,
    applyFilters,
    clearExtraFilters,
    hasExtraFilters:
      countActiveFilters(
        extraDiscoveryFilters(queries, baseline),
        hiddenFilters,
      ) > 0,
    filters: draft.filters,
  };
};
