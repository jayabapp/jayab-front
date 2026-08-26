"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { propertiesOptions } from "@features/properties/api/property.options";

import type { PropertyFilters } from "@features/properties/lib/normalize-property-filters";

export const useProperties = (filters: PropertyFilters, enabled = true) => {
  const debouncedQuery = useDebouncedValue(filters.q, 400);
  const query = useInfiniteQuery(
    { ...propertiesOptions({ ...filters, q: debouncedQuery }), enabled },
  );
  const properties = query.data?.pages.flatMap((page) => page?.data ?? []) ?? [];
  const meta = query.data?.pages.at(-1)?.meta;

  return {
    ...query,
    properties,
    meta,
    isDebouncing: filters.q !== debouncedQuery,
  };
};
