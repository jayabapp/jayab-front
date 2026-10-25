import { FILTER_ORDER_PARAM, parseFilterOrder } from "./filter-order";
import { zero_filter_remove_keys } from "@/utils/constantss";
import { countFilterValues } from "./count-active-filters";
import { comparableValue } from "./discovery-filter-policy";
import { NON_FILTER_KEYS } from "./discovery-filter-policy";

type Filters = Record<string, unknown>;

export const PREMIUM_FILTER_KEY = "has_blue_tick";
const LEGACY_PREMIUM_KEY = "is_premium";

export const SEARCH_PATH = "/rooms";

const BASELINE_IGNORED_KEYS: ReadonlySet<string> = new Set([
  FILTER_ORDER_PARAM,
  "categories",
  "page",
  "per_page",
  "locale",
  "sort_type",
  "q",
]);

const isOn = (value: unknown) =>
  value !== undefined &&
  value !== null &&
  value !== "" &&
  value !== 0 &&
  value !== "0" &&
  value !== false;

export const canonicalizeDiscoveryFilters = <T extends Filters>(
  filters: T,
): T => {
  if (!(LEGACY_PREMIUM_KEY in filters)) return filters;
  const hasExplicit = PREMIUM_FILTER_KEY in filters;
  const entries: [string, unknown][] = [];
  for (const [key, value] of Object.entries(filters)) {
    if (key !== LEGACY_PREMIUM_KEY) {
      entries.push([key, value]);
    } else if (!hasExplicit && isOn(value)) {
      entries.push([PREMIUM_FILTER_KEY, "1"]);
    }
  }
  return Object.fromEntries(entries) as T;
};

export const baselineConflicts = (
  baseline: Record<string, string>,
  intended: Filters,
): string[] =>
  Object.keys(baseline).filter(
    (key) =>
      !BASELINE_IGNORED_KEYS.has(key) &&
      (intended[key] === undefined ||
        comparableValue(intended[key]) !== comparableValue(baseline[key])),
  );

export const withoutBaseline = (
  baseline: Record<string, string>,
  intended: Filters,
): Filters =>
  Object.fromEntries(
    Object.entries(intended).filter(
      ([key, value]) =>
        baseline[key] === undefined ||
        BASELINE_IGNORED_KEYS.has(key) ||
        comparableValue(value) !== comparableValue(baseline[key]),
    ),
  );

export const nextFilterOrder = (
  previous: string | undefined,
  filters: Filters,
): string[] => {
  const active = Object.keys(filters).filter(
    (key) => !NON_FILTER_KEYS.has(key) && countFilterValues(filters, key) > 0,
  );
  const activeSet = new Set(active);
  const kept = parseFilterOrder(previous).filter((key) => activeSet.has(key));
  const keptSet = new Set(kept);
  return [...kept, ...active.filter((key) => !keptSet.has(key))];
};

type NavigationPlan = { path: string; query: Filters };

export const planDiscoveryNavigation = ({
  baseline,
  intended,
  pathname,
  previousOrder,
}: {
  intended: Filters;
  pathname: string;
  previousOrder?: string;
  baseline: Record<string, string>;
}): NavigationPlan => {
  const filters = canonicalizeDiscoveryFilters({ ...intended });
  delete filters.page;
  delete filters[FILTER_ORDER_PARAM];
  for (const key of zero_filter_remove_keys) {
    if (filters[key] === 0 || filters[key] === "0") delete filters[key];
  }

  const leavesLanding = baselineConflicts(baseline, filters).length > 0;
  const query = leavesLanding ? filters : withoutBaseline(baseline, filters);
  const order = nextFilterOrder(previousOrder, query);

  return {
    path: leavesLanding ? SEARCH_PATH : pathname,
    query: order.length
      ? { ...query, [FILTER_ORDER_PARAM]: order.join(",") }
      : query,
  };
};
