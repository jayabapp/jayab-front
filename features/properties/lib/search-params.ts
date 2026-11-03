export const searchParamsToFilters = (
  searchParams: Record<string, string | string[] | undefined>,
): Record<string, string> =>
  Object.entries(searchParams).reduce<Record<string, string>>(
    (result, [key, value]) => {
      const resolved = Array.isArray(value) ? value[value.length - 1] : value;
      if (resolved !== undefined) result[key] = resolved;
      return result;
    },
    {},
  );
