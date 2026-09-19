import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { normalizePropertyFilters } from "@features/properties/lib/normalize-property-filters";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { PropertyService } from "@/api_services/property/property.service";
import { propertyKeys } from "./property.keys";

import type { PropertyFilters } from "@features/properties/lib/normalize-property-filters";

const PAGE_SIZE = 30;

export const DISCOVERY_OPTION_GROUPS = [
  "PROPERTY_TYPE",
  "ENTERTAINMENT",
  "POOL_TYPE",
  "OWNERSHIP",
  "KITCHEN",
  "COOL_HEAT",
  "WELFARE",
  "PATTERN",
  "PARTY",
  "PET",
] as const;

export const propertyOptionGroupsOptions = (
  groups: readonly string[] = DISCOVERY_OPTION_GROUPS,
) =>
  queryOptions({
    queryKey: propertyKeys.optionGroups(groups),
    queryFn: ({ signal }) =>
      PropertyService.GetUserPropertyGroup(
        { group: [...groups] as any },
        signal,
      ),
    staleTime: STALE_TIME.LONG,
    gcTime: GC_TIME.LONG,
  });

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
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

const COUNT_PAGE_SIZE = 1;

export const propertyCountOptions = (
  filters: PropertyFilters,
  enabled = true,
) => {
  const normalized = normalizePropertyFilters({
    ...filters,
    page: undefined,
    per_page: undefined,
  });

  return queryOptions({
    queryKey: propertyKeys.count(normalized),
    queryFn: async ({ signal }) => {
      const result = await PropertyService.GetProperties(
        {
          ...normalized,
          page: 1,
          per_page: COUNT_PAGE_SIZE,
        } as Required<Pick<PropertyFilters, "page" | "per_page">> &
          PropertyFilters,
        signal,
        true,
      );
      return result?.meta?.total ?? 0;
    },
    enabled,
    placeholderData: keepPreviousData,
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

export type QuoteStay = {
  checkIn?: string | null;
  checkOut?: string | null;
  guests?: number | null;
};

export const propertyQuoteOptions = (id: number | string, stay: QuoteStay) => {
  const { checkIn, checkOut, guests } = stay;
  const isComplete = Boolean(id && checkIn && checkOut && guests && guests > 0);

  return queryOptions({
    queryKey: propertyKeys.quote(id, {
      checkIn: checkIn ?? "",
      checkOut: checkOut ?? "",
      guests: guests ?? 0,
    }),
    queryFn: ({ signal }) =>
      PropertyService.getPropertyQuote(
        {
          property_id: id,
          check_in: checkIn as string,
          check_out: checkOut as string,
          guests: guests as number,
        },
        signal,
      ),
    enabled: isComplete,
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME.SHORT,
  });
};
