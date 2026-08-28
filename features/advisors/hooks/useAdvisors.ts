"use client";

import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { useInfiniteQuery } from "@tanstack/react-query";
import { advisorsOptions } from "../api/advisor.options";

import type { AdvisorFilters } from "../api/advisor.keys";

export const useAdvisors = (filters: AdvisorFilters) => {
  const debouncedQuery = useDebouncedValue(filters.q?.trim(), 400);
  const query = useInfiniteQuery(
    advisorsOptions({ ...filters, q: debouncedQuery }),
  );
  const advisors = Array.from(
    new Map(
      (query.data?.pages.flat() ?? []).map((advisor) => [advisor.id, advisor]),
    ).values(),
  );
  return {
    ...query,
    advisors,
    isDebouncing: filters.q?.trim() !== debouncedQuery,
  };
};
