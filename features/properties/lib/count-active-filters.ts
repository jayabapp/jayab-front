import type { PropertyFilterDraft } from "@/types/components/modules/property-search-filters";

import { NON_FILTER_KEYS } from "./discovery-filter-policy";

const RANGE_PAIRS: readonly (readonly [string, string])[] = [
  ["min_price", "max_price"],
  ["min_building_area", "max_building_area"],
  ["min_commission", "max_commission"],
];

const RANGE_KEYS = new Set(RANGE_PAIRS.flatMap((pair) => [...pair]));

const DATE_KEYS = ["checkin", "checkout"] as const;

const hasValue = (value: unknown) =>
  value !== undefined &&
  value !== null &&
  value !== "" &&
  value !== 0 &&
  value !== "0";

const ZERO_IS_A_CHOICE = new Set(["has_pool"]);

// One checkbox that stands for a list of option ids ("2,3"), so it counts once.
const SINGLE_TOGGLE_KEYS = new Set(["party", "pet"]);

export const countFilterValues = (
  filters: PropertyFilterDraft | undefined,
  key: string,
): number => {
  const value = filters?.[key];
  if (ZERO_IS_A_CHOICE.has(key) && (value === 0 || value === "0")) return 1;
  if (!hasValue(value)) return 0;
  if (SINGLE_TOGGLE_KEYS.has(key)) return 1;
  if (Array.isArray(value))
    return value.filter((entry) => hasValue(entry)).length;
  return `${value}`.split(",").filter((entry) => hasValue(entry.trim())).length;
};

export const countFilterGroup = (
  filters: PropertyFilterDraft | undefined,
  keys: readonly string[],
): number =>
  keys.reduce((total, key) => total + countFilterValues(filters, key), 0);

export const countActiveFilters = (
  filters: PropertyFilterDraft | undefined,
  hiddenFilters: readonly string[] = [],
): number => {
  if (!filters) return 0;
  const hidden = new Set(hiddenFilters);

  const plain = Object.keys(filters)
    .filter(
      (key) =>
        !NON_FILTER_KEYS.has(key) &&
        !RANGE_KEYS.has(key) &&
        !DATE_KEYS.includes(key as (typeof DATE_KEYS)[number]) &&
        !hidden.has(key),
    )
    .reduce((total, key) => total + countFilterValues(filters, key), 0);

  const ranges = RANGE_PAIRS.filter(
    ([lower, higher]) =>
      !hidden.has(lower) &&
      !hidden.has(higher) &&
      (hasValue(filters[lower]) || hasValue(filters[higher])),
  ).length;

  const dates = DATE_KEYS.some(
    (key) => !hidden.has(key) && hasValue(filters[key]),
  )
    ? 1
    : 0;

  return plain + ranges + dates;
};
