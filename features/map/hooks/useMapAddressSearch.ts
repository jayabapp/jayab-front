"use client";

import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { MapService } from "../api/map.service";
import { useQuery } from "@tanstack/react-query";
import { mapKeys } from "../api/map.keys";

export const useMapAddressSearch = (
  search: string,
  center: number[],
  enabled: boolean,
) => {
  const normalizedSearch = search.trim();
  const debouncedSearch = useDebouncedValue(normalizedSearch, 500);
  const query = useQuery({
    queryKey: mapKeys.search(debouncedSearch, center),
    queryFn: ({ signal }) =>
      MapService.searchAddresses({ center, search: debouncedSearch, signal }),
    enabled: enabled && debouncedSearch.length >= 3,
    staleTime: 60_000,
  });
  return {
    ...query,
    addresses: query.data ?? [],
    isDebouncing:
      enabled &&
      normalizedSearch.length >= 3 &&
      normalizedSearch !== debouncedSearch,
  };
};
