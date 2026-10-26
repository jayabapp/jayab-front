import { canonicalizeDiscoveryFilters } from "@features/properties/lib/discovery-filters";
import { normalizePersianSearchText } from "@features/search/lib/normalize-persian-search-text";
import { BBOX_PARAM, canonicalBbox } from "@features/properties/lib/bbox";
import { UI_ONLY_FILTER_PARAMS } from "@features/properties/lib/filter-order";

import type { GetPropertiesPlusFilters } from "@/api_services/property/property.interface";

export type PropertyFilters = Partial<GetPropertiesPlusFilters>;

export const normalizePropertyFilters = (filters: PropertyFilters) => {
  const normalized = Object.entries(
    canonicalizeDiscoveryFilters(filters as Record<string, unknown>),
  ).reduce<Record<string, unknown>>((result, [key, value]) => {
    if (value === undefined || value === null || value === "") return result;
    if (UI_ONLY_FILTER_PARAMS.includes(key)) return result;
    if (key === "q") {
      const query = normalizePersianSearchText(String(value));
      if (query) result.q = query;
      return result;
    }
    result[key] = key === BBOX_PARAM ? (canonicalBbox(value) ?? value) : value;
    return result;
  }, {});

  return Object.fromEntries(
    Object.entries(normalized).sort(([first], [second]) =>
      first.localeCompare(second),
    ),
  ) as PropertyFilters;
};
