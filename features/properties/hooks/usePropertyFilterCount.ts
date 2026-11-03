"use client";

import { propertyCountOptions } from "@features/properties/api/property.options";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { PropertyFilterDraft } from "@/types/components/modules/property-search-filters";

import queryBuilder from "@/helpers/queryBuilder";

const COUNT_DEBOUNCE_MS = 500;

export const usePropertyFilterCount = (
  draft: PropertyFilterDraft,
  enabled = true,
) => {
  const serialized = queryBuilder({ ...draft, page: undefined });
  const debounced = useDebouncedValue(serialized, COUNT_DEBOUNCE_MS);

  const settled = useMemo(
    () => Object.fromEntries(new URLSearchParams(debounced)),
    [debounced],
  );

  const { data, isFetching, isError } = useQuery(
    propertyCountOptions(settled, enabled && serialized === debounced),
  );

  return {
    count: isError ? undefined : data,
    isStale: isFetching || serialized !== debounced,
  };
};
