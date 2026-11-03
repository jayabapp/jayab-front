"use client";

import { MAP_MOVE_DEBOUNCE_MS } from "@features/map/constants/discovery-map";
import { propertyMapOptions } from "@features/properties/api/property.options";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { resolveLocale } from "@/i18n/config";
import { clampMapZoom } from "@features/properties/lib/bbox";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import type { PropertyFilters } from "@features/properties/lib/normalize-property-filters";

export type MapCamera = { bbox: string; zoom: number };

export const usePropertiesMap = (
  filters: PropertyFilters,
  camera: MapCamera | null,
  enabled = true,
) => {
  const locale = resolveLocale(useLocale());
  const wanted = camera ? `${camera.bbox}|${clampMapZoom(camera.zoom)}` : "";
  const debounced = useDebouncedValue(wanted, MAP_MOVE_DEBOUNCE_MS);
  const settled = debounced || wanted;
  const [bbox = "", zoom = "0"] = settled.split("|");

  const query = useQuery(
    propertyMapOptions(
      filters,
      { bbox, zoom: Number(zoom) },
      locale,
      enabled && settled !== "",
    ),
  );

  return { ...query, isSettling: wanted !== settled };
};
