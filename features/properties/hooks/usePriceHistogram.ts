"use client";

import { priceHistogramFilters } from "@features/properties/lib/price-histogram";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { PropertyService } from "@/api_services/property/property.service";
import { hasUsableBbox } from "@features/properties/lib/bbox";
import { propertyKeys } from "@features/properties/api/property.keys";
import { useQuery } from "@tanstack/react-query";

import type { PropertyFilters } from "@features/properties/lib/normalize-property-filters";

export const usePriceHistogram = (filters: PropertyFilters) => {
  const serialized = JSON.stringify(priceHistogramFilters(filters));
  const debounced = useDebouncedValue(serialized, 400);
  const scope = JSON.parse(debounced) as PropertyFilters;
  const query = useQuery({
    queryKey: propertyKeys.priceHistogram(scope),
    queryFn: ({ signal }) => PropertyService.GetPriceHistogram(scope, signal),
    enabled: serialized === debounced && hasUsableBbox(scope),
    staleTime: 30_000,
  });
  return { ...query, isSettling: serialized !== debounced };
};
