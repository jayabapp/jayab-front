export const FILTER_ORDER_PARAM = "filter_order";

export const UI_ONLY_FILTER_PARAMS: readonly string[] = [FILTER_ORDER_PARAM];

export const parseFilterOrder = (value?: string | null): string[] =>
  `${value ?? ""}`
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);

export const filterOrderRank = (
  order: readonly string[],
  key: string,
): number => {
  const index = order.indexOf(key);
  return index < 0 ? order.length : index;
};

/** Keep filters chosen before a search ahead of filters inferred by that search. */
export const mergeOrderedSearchFilters = (
  selected: Record<string, unknown>,
  inferred: Record<string, unknown>,
): Record<string, unknown> => ({ ...selected, ...inferred, ...selected });

export type FilterChipOrderEntry = {
  id: string;
  queryKeys: readonly string[];
  active: boolean;
};

/** Keep active chips in the order their query keys were added, then show idle chips. */
export const orderFilterChips = <T extends FilterChipOrderEntry>(
  chips: readonly T[],
  query: Record<string, unknown>,
): T[] => {
  const positions = new Map(Object.keys(query).map((key, index) => [key, index]));
  const firstPosition = (chip: T) =>
    Math.min(...chip.queryKeys.map((key) => positions.get(key) ?? Infinity));

  return chips
    .map((chip, index) => ({ chip, index }))
    .sort((left, right) => {
      if (left.chip.active !== right.chip.active)
        return left.chip.active ? -1 : 1;
      if (left.chip.active) {
        const difference = firstPosition(left.chip) - firstPosition(right.chip);
        if (Number.isFinite(difference) && difference !== 0) return difference;
      }
      return left.index - right.index;
    })
    .map(({ chip }) => chip);
};
