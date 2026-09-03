import type { PropertyFilters } from "@features/properties/lib/normalize-property-filters";

export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters: PropertyFilters) =>
    [...propertyKeys.lists(), filters] as const,
  count: (filters: PropertyFilters) =>
    [...propertyKeys.all, "count", filters] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (slug: string) => [...propertyKeys.details(), { slug }] as const,
  calendar: (id: number | string, range: string) =>
    [...propertyKeys.all, "calendar", { id: String(id), range }] as const,
  reservedDates: (id: number | string) =>
    [...propertyKeys.all, "reserved-dates", { id: String(id) }] as const,
  optionGroups: (groups: readonly string[]) =>
    [...propertyKeys.all, "option-groups", [...groups].sort()] as const,
};
