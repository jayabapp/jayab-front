import type { PropertyFilterDraft } from "@/types/components/modules/property-search-filters";

/**
 * Keys that are *not* filters even though they travel in the same object:
 * they change ordering or paging, not which properties match.
 */
const NON_FILTER_KEYS = new Set([
  "categories",
  "page",
  "per_page",
  "q",
  "sort_type",
]);

/**
 * Pairs of range bounds. They are counted as one filter, not two, because the
 * user thinks of "price" as a single decision — showing "۲ فیلتر فعال" after
 * dragging one slider would be wrong.
 */
const RANGE_PAIRS: readonly (readonly [string, string])[] = [
  ["min_price", "max_price"],
  ["min_building_area", "max_building_area"],
  ["min_commission", "max_commission"],
];

const RANGE_KEYS = new Set(RANGE_PAIRS.flatMap((pair) => [...pair]));

/** `checkin`/`checkout` are likewise one decision made in one picker. */
const DATE_KEYS = ["checkin", "checkout"] as const;

const hasValue = (value: unknown) =>
  value !== undefined && value !== null && value !== "" && value !== 0 && value !== "0";

/**
 * How many values a single filter key holds. Multi-select filters arrive either
 * as a comma-joined string (from the URL) or as an array (from the draft), so
 * both shapes have to yield the same number — the badge on a section header and
 * the badge on its chip are read side by side.
 */
export const countFilterValues = (
  filters: PropertyFilterDraft | undefined,
  key: string,
): number => {
  const value = filters?.[key];
  if (!hasValue(value)) return 0;
  if (Array.isArray(value)) return value.filter((entry) => hasValue(entry)).length;
  return `${value}`
    .split(",")
    .filter((entry) => hasValue(entry.trim())).length;
};

/** Total across several keys — what a section header badge shows. */
export const countFilterGroup = (
  filters: PropertyFilterDraft | undefined,
  keys: readonly string[],
): number =>
  keys.reduce((total, key) => total + countFilterValues(filters, key), 0);

/**
 * Every filter the user has actually chosen, counted the way a person would
 * count them: a range is one, a date span is one, and a multi-select counts
 * once per picked value.
 *
 * `hiddenFilters` are keys a host page pins (a landing page fixes its own city
 * or property type); they are not the visitor's choices, so they do not count
 * towards the badge or enable the reset button.
 */
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

  const dates = DATE_KEYS.some((key) => hasValue(filters[key])) ? 1 : 0;

  return plain + ranges + dates;
};
