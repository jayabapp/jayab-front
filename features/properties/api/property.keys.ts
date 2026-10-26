import type { PropertyFilters } from "@features/properties/lib/normalize-property-filters";
import type { Locale } from "@/i18n/config";

export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters: PropertyFilters) =>
    [...propertyKeys.lists(), filters] as const,
  count: (filters: PropertyFilters) =>
    [...propertyKeys.all, "count", filters] as const,
  map: (filters: PropertyFilters, view: { bbox: string; zoom: number }) =>
    [...propertyKeys.all, "map", filters, view] as const,
  mapPreview: (id: number | string, locale: Locale = "fa") =>
    [...propertyKeys.all, "map-preview", { id: String(id) }, locale] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (slug: string, locale: Locale = "fa") =>
    [...propertyKeys.details(), { slug }, locale] as const,
  similar: (id: number | string, locale: Locale = "fa") =>
    [...propertyKeys.all, "similar", { id: String(id) }, locale] as const,
  calendar: (id: number | string, range: string) =>
    [...propertyKeys.all, "calendar", { id: String(id), range }] as const,
  reservedDates: (id: number | string) =>
    [...propertyKeys.all, "reserved-dates", { id: String(id) }] as const,
  quotes: (id: number | string) =>
    [...propertyKeys.all, "quote", { id: String(id) }] as const,
  quote: (
    id: number | string,
    stay: { checkIn: string; checkOut: string; guests: number },
  ) => [...propertyKeys.quotes(id), stay] as const,
  optionGroups: (groups: readonly string[]) =>
    [...propertyKeys.all, "option-groups", [...groups].sort()] as const,
};
