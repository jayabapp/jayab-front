import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { normalizePropertyFilters } from "@features/properties/lib/normalize-property-filters";
import { PropertyService } from "@/api_services/property/property.service";
import { propertyKeys } from "./property.keys";

import type { PropertyFilters } from "@features/properties/lib/normalize-property-filters";

const PAGE_SIZE = 30;

export const propertiesOptions = (filters: PropertyFilters) => {
  const normalized = normalizePropertyFilters(filters);
  const requestedPage = normalized.page ? Number(normalized.page) : undefined;

  return infiniteQueryOptions({
    queryKey: propertyKeys.list(normalized),
    queryFn: ({ pageParam, signal }) =>
      PropertyService.GetProperties(
        {
          ...normalized,
          page: requestedPage ?? pageParam,
          per_page: Number(normalized.per_page) || PAGE_SIZE,
        } as Required<Pick<PropertyFilters, "page" | "per_page">> &
          PropertyFilters,
        signal,
      ),
    initialPageParam: requestedPage ?? 1,
    getNextPageParam: (lastPage) => {
      if (requestedPage || !lastPage?.meta?.next) return undefined;
      return lastPage.meta.next;
    },
    staleTime: 30_000,
  });
};

export const propertyDetailOptions = (slug: string) =>
  queryOptions({
    queryKey: propertyKeys.detail(slug),
    queryFn: ({ signal }) =>
      PropertyService.GetSinglePropertyWithSlug(
        { Property_slug: slug },
        signal,
      ),
    enabled: Boolean(slug),
    staleTime: 60_000,
  });

export const reservedDatesOptions = (id: number | string) =>
  queryOptions({
    queryKey: propertyKeys.reservedDates(id),
    queryFn: ({ signal }) =>
      PropertyService.propertyReservedDates({ post_id: id }, signal),
    enabled: Boolean(id),
    staleTime: 60_000,
  });

export const propertyCalendarOptions = (
  id: number | string,
  range: { month: number; year: number },
) =>
  queryOptions({
    queryKey: propertyKeys.calendar(id, `${range.year}-${range.month}`),
    queryFn: ({ signal }) =>
      PropertyService.GetSingleUserPropertyCallendar(
        { property_id: id, month: range.month, year: range.year },
        signal,
      ),
    enabled: Boolean(id && range.month && range.year),
    staleTime: 60_000,
  });

export const propertyBookmarksOptions = () =>
  queryOptions({
    queryKey: propertyKeys.bookmarks(),
    queryFn: ({ signal }) => PropertyService.getBookMarks(signal),
    staleTime: 30_000,
  });
