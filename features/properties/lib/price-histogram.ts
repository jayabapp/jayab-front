import { normalizePropertyFilters } from "./normalize-property-filters";
import { PRICE_RANGE } from "../constants/filter-ranges";

import type { PropertyFilters } from "./normalize-property-filters";

// A distribution describes the search before its price range is applied.
export const priceHistogramFilters = (filters: PropertyFilters) =>
  normalizePropertyFilters({
    ...filters,
    min_price: undefined,
    max_price: undefined,
    page: undefined,
    per_page: undefined,
    sort_type: undefined,
    count_only: undefined,
  });

export const priceSliderMaximum = (
  dataMaximum: number | null | undefined,
  filters: { min_price?: unknown; max_price?: unknown },
): number => {
  const values = [
    PRICE_RANGE.max,
    dataMaximum,
    filters.min_price,
    filters.max_price,
  ]
    .map(Number)
    .filter((value) => Number.isFinite(value) && value > 0);
  return Math.ceil(Math.max(...values) / PRICE_RANGE.step) * PRICE_RANGE.step;
};
