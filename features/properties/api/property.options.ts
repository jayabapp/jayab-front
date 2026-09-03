import { infiniteQueryOptions, keepPreviousData, queryOptions } from "@tanstack/react-query";
import { normalizePropertyFilters } from "@features/properties/lib/normalize-property-filters";
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
    // Every filter change produces a new query key. Without this the grid falls
    // back to `isPending` and the whole result list is replaced by a skeleton,
    // which throws the user's scroll position away and reads as a page reload.
    // Keeping the previous page on screen — dimmed by the caller — is what the
    // rest of the app already does for navigation, and the same reasoning
    // applies inside a single page.
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

const COUNT_PAGE_SIZE = 1;

/**
 * How many properties the *draft* filters would match, without committing them.
 *
 * The sidebar stages its edits and only writes the URL when the user submits,
 * so until then there is nothing on screen telling them whether the combination
 * they are assembling has any results at all. This asks the list endpoint for a
 * single row and reads `meta.total` off it — the count the API already computes
 * for pagination — so the answer costs one small response rather than a page of
 * property payloads.
 *
 * Kept under its own key prefix: it must never be mistaken for, or evict, the
 * real list cache, whose entries hold the rows the grid renders.
 */
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
    // The previous count stays visible while the next one is in flight, so the
    // submit button never blanks out mid-decision.
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

