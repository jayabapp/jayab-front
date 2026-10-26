import { UI_ONLY_FILTER_PARAMS } from "./filter-order";
import { BBOX_PARAM } from "./bbox";

export const DESTINATION_FILTER_KEYS = [
  "cities",
  "provinces",
  "province_id",
] as const;

const SEARCH_CONTEXT_KEYS = [
  ...DESTINATION_FILTER_KEYS,
  BBOX_PARAM,
  "sort_type",
  "q",
] as const;

export const NON_FILTER_KEYS: ReadonlySet<string> = new Set([
  ...SEARCH_CONTEXT_KEYS,
  ...UI_ONLY_FILTER_PARAMS,
  "categories",
  "page",
  "per_page",
  "locale",
]);

type Filters = Record<string, unknown>;

export const comparableValue = (value: unknown) =>
  `${value ?? ""}`
    .split(",")
    .map((entry) => entry.trim())
    .sort()
    .join(",");

export const extraDiscoveryFilters = (
  filters: Filters,
  defaults: Filters = {},
): Filters =>
  Object.fromEntries(
    Object.entries(filters).filter(
      ([key, value]) =>
        defaults[key] === undefined ||
        comparableValue(value) !== comparableValue(defaults[key]),
    ),
  );

export const resetDiscoveryFilters = (
  applied: Filters,
  defaults: Filters = {},
): Filters => {
  const body = { ...defaults };
  for (const key of SEARCH_CONTEXT_KEYS) {
    if (applied[key] !== undefined) body[key] = applied[key];
  }
  delete body.page;
  delete body.per_page;
  for (const key of UI_ONLY_FILTER_PARAMS) delete body[key];
  return body;
};

const DESTINATION_ANSWER_KEYS = [
  ...DESTINATION_FILTER_KEYS,
  "regions",
] as const;

export const withMapArea = (filters: Filters, bbox: string): Filters => {
  const next: Filters = { ...filters, [BBOX_PARAM]: bbox };
  for (const key of DESTINATION_ANSWER_KEYS) delete next[key];
  delete next.page;
  return next;
};

export const withoutMapArea = (filters: Filters): Filters => {
  const next = { ...filters };
  delete next[BBOX_PARAM];
  delete next.page;
  return next;
};
