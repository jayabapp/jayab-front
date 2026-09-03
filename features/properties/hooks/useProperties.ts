"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { propertiesOptions } from "@features/properties/api/property.options";
import { useMemo } from "react";

import type { PropertyFilters } from "@features/properties/lib/normalize-property-filters";
import type { PropertyListDto } from "@/api_services/property/property.interface";

export const useProperties = (filters: PropertyFilters, enabled = true) => {
  const debouncedQuery = useDebouncedValue(filters.q, 400);
  const query = useInfiniteQuery(
    { ...propertiesOptions({ ...filters, q: debouncedQuery }), enabled },
  );
  const properties = useMemo(() => {
    const uniqueProperties = new Map<number, PropertyListDto>();

    query.data?.pages.forEach((page) => {
      page?.data?.forEach((property) => {
        if (!uniqueProperties.has(property.id))
          uniqueProperties.set(property.id, property);
      });
    });

    return [...uniqueProperties.values()];
  }, [query.data]);
  const meta = query.data?.pages.at(-1)?.meta;

  return {
    ...query,
    properties,
    meta,
    isDebouncing: filters.q !== debouncedQuery,
  };
};
