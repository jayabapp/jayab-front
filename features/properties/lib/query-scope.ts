import { canonicalBbox, clampMapZoom } from "./bbox";
import { normalizePropertyFilters } from "./normalize-property-filters";
import { propertyKeys } from "../api/property.keys";

import type { PropertyFilters } from "./normalize-property-filters";
import type { Locale } from "@/i18n/config";

export type PropertyMapView = { bbox: string; zoom: number };

export const listQueryKey = (filters: PropertyFilters, locale: Locale) =>
  propertyKeys.list(normalizePropertyFilters({ ...filters, locale }));

export const mapQueryScope = (
  filters: PropertyFilters,
  view: PropertyMapView,
  locale: Locale,
) => ({
  bbox: canonicalBbox(view.bbox),
  zoom: clampMapZoom(view.zoom),
  filters: normalizePropertyFilters({
    ...filters,
    locale,
    bbox: undefined,
    page: undefined,
    per_page: undefined,
    sort_type: undefined,
  }),
});

export const mapQueryKey = (scope: ReturnType<typeof mapQueryScope>) =>
  propertyKeys.map(scope.filters, { bbox: scope.bbox ?? "", zoom: scope.zoom });

export const isSameMapSearch = (
  previousKey: readonly unknown[] | undefined,
  filters: PropertyFilters,
) => JSON.stringify(previousKey?.[2]) === JSON.stringify(filters);
