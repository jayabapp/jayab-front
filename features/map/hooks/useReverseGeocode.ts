"use client";

import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { MapService } from "../api/map.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { mapKeys } from "../api/map.keys";

export const useReverseGeocode = (
  longitude: number,
  latitude: number,
  enabled = true,
) => {
  const coordinates = useMemo(
    () => ({ latitude, longitude }),
    [latitude, longitude],
  );
  const debounced = useDebouncedValue(coordinates, 500);
  return useQuery({
    queryKey: mapKeys.reverse(debounced.longitude, debounced.latitude),
    queryFn: ({ signal }) =>
      MapService.reverseGeocode({ ...debounced, signal }),
    enabled: enabled && Boolean(debounced.longitude && debounced.latitude),
    staleTime: 60_000,
  });
};
