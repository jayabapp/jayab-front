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

export const mergeOrderedSearchFilters = (
  selected: Record<string, unknown>,
  inferred: Record<string, unknown>,
): Record<string, unknown> => ({ ...selected, ...inferred, ...selected });

export type FilterChipOrderEntry = {
  id: string;
  queryKeys: readonly string[];
  active: boolean;
};

export const orderFilterChips = <T extends FilterChipOrderEntry>(
  chips: readonly T[],
  query: Record<string, unknown>,
): T[] => {
  const order = parseFilterOrder(
    typeof query[FILTER_ORDER_PARAM] === "string"
      ? (query[FILTER_ORDER_PARAM] as string)
      : undefined,
  );
  const positions = new Map(
    Object.keys(query).map((key, index) => [key, index]),
  );
  const firstPosition = (chip: T) =>
    Math.min(...chip.queryKeys.map((key) => positions.get(key) ?? Infinity));
  const rank = (chip: T) => {
    const ranked = chip.queryKeys
      .map((key) => order.indexOf(key))
      .filter((index) => index >= 0);
    return ranked.length ? Math.min(...ranked) : -1;
  };

  return chips
    .map((chip, index) => ({ chip, index }))
    .sort((left, right) => {
      if (left.chip.active !== right.chip.active)
        return left.chip.active ? -1 : 1;
      if (left.chip.active) {
        const rankDifference = rank(left.chip) - rank(right.chip);
        if (rankDifference !== 0) return rankDifference;
        const difference = firstPosition(left.chip) - firstPosition(right.chip);
        if (Number.isFinite(difference) && difference !== 0) return difference;
      }
      return left.index - right.index;
    })
    .map(({ chip }) => chip);
};
