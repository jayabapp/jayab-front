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
