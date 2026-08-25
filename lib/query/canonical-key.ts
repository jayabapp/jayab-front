type QueryKeyValue = null | boolean | number | string | QueryKeyValue[] | { [key: string]: QueryKeyValue };

export const canonicalizeQueryKey = (value: unknown): QueryKeyValue => {
  if (value === null || typeof value === "boolean" || typeof value === "string") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : String(value);
  if (Array.isArray(value)) return value.map(canonicalizeQueryKey);

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, canonicalizeQueryKey(item)]),
    );
  }

  return String(value);
};
