import { normalizePersianSearchText } from "@features/search/lib/normalize-persian-search-text";

import type { GetPropertiesPlusFilters } from "@/api_services/property/property.interface";

export type PropertyFilters = Partial<GetPropertiesPlusFilters>;

export const normalizePropertyFilters = (filters: PropertyFilters) => {
  const normalized = Object.entries(filters).reduce<Record<string, unknown>>(
    (result, [key, value]) => {
      if (value === undefined || value === null || value === "") return result;
      if (key === "q") {
        const query = normalizePersianSearchText(String(value));
        if (query) result.q = query;
        return result;
      }
      result[key] = value;
      return result;
    },
    {},
  );

  return Object.fromEntries(
    Object.entries(normalized).sort(([first], [second]) =>
      first.localeCompare(second),
    ),
  ) as PropertyFilters;
};
