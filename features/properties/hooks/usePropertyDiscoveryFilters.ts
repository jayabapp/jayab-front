"use client";

import { useCallback, useMemo, useState } from "react";
import { cancelPropertyDiscoveryQueries } from "@features/properties/api/property-discovery.cache";
import { zero_filter_remove_keys } from "@/utils/constantss";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import type { PropertyDiscoveryFilters } from "@/types/features/properties";

import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";

const KEPT_ON_RESET = ["sort_type", "cities", "q"] as const;

export const usePropertyDiscoveryFilters = ({
  defaults,
  hiddenFilters = [],
}: {
  defaults?: Record<string, string>;
  hiddenFilters?: string[];
} = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const urlQueries = useQueryGet<Record<string, string>>();

  const queries = useMemo<PropertyDiscoveryFilters>(
    () => ({ ...defaults, ...urlQueries }),
    [defaults, urlQueries],
  );
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

  const replaceWith = useCallback(
    (body: Record<string, unknown>) => {
      cancelPropertyDiscoveryQueries(queryClient);
      router.replace(`${pathname}?${queryBuilder(body)}`);
    },
    [pathname, queryClient, router],
  );

  const applyFilters = useCallback(() => {
    const body: Record<string, unknown> = { ...draft.filters };
    delete body.categories;
    delete body.page;
    for (const key of hiddenFilters) delete body[key];
    for (const key of zero_filter_remove_keys) {
      if (body?.[key] === 0 || body?.[key] === "0") delete body[key];
    }
    replaceWith(body);
  }, [draft.filters, hiddenFilters, replaceWith]);

  const resetDraft = useCallback(
    () => setDraft({ key: appliedKey, filters: queries }),
    [appliedKey, queries],
  );

  const clearExtraFilters = useCallback(() => {
    const body: Record<string, unknown> = {};
    for (const key of KEPT_ON_RESET) {
      if (queries?.[key]) body[key] = queries[key];
    }
    replaceWith(body);
  }, [queries, replaceWith]);

  return {
    queries,
    resetDraft,
    setFilters,
    applyFilters,
    clearExtraFilters,
    filters: draft.filters,
  };
};
