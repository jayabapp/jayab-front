import { ownerPropertyKeys } from "./owner-property.keys";
import { PropertyService } from "@/api_services/property/property.service";
import { queryOptions } from "@tanstack/react-query";

export const ownerPropertiesOptions = () =>
  queryOptions({
    queryKey: ownerPropertyKeys.list(),
    queryFn: ({ signal }) => PropertyService.GetOwnerPropertiesList(signal),
    staleTime: 30_000,
  });

export const ownerPropertyOptions = (id: string | number) =>
  queryOptions({
    queryKey: ownerPropertyKeys.detail(id),
    queryFn: ({ signal }) =>
      PropertyService.GetSingleOwnerProperty({ property_id: id }, signal),
    enabled: Boolean(id),
    staleTime: 30_000,
  });

export const propertyDraftOptions = (id: string | number) =>
  queryOptions({
    queryKey: ownerPropertyKeys.draft(id),
    queryFn: ({ signal }) =>
      PropertyService.InitProperty({ property_id: id }, signal),
    enabled: Boolean(id),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

export const ownerCalendarOptions = (
  id: string | number,
  year: number | string,
  month: number | string,
) =>
  queryOptions({
    queryKey: ownerPropertyKeys.calendar(id, year, month),
    queryFn: ({ signal }) =>
      PropertyService.GetSingleOwnerPropertyCallendar(
        { property_id: id, year, month },
        signal,
      ),
    enabled: Boolean(id && year && month),
    staleTime: 30_000,
  });

export const propertyBadgeOptions = (id: string | number) =>
  queryOptions({
    queryKey: ownerPropertyKeys.badge(id),
    queryFn: ({ signal }) =>
      PropertyService.GetSingleOwnerPropertyBadgeStatus(
        { property_id: id },
        signal,
      ),
    enabled: Boolean(id),
  });

export const propertyAuthorizationOptions = (id: string | number) =>
  queryOptions({
    queryKey: ownerPropertyKeys.authorization(id),
    queryFn: ({ signal }) =>
      PropertyService.GetSingleOwnerPropertyAuthStatus(
        { property_id: id },
        signal,
      ),
    enabled: Boolean(id),
  });

export const propertyStatisticsOptions = (id: string | number) =>
  queryOptions({
    queryKey: ownerPropertyKeys.statistics(id),
    queryFn: ({ signal }) =>
      PropertyService.getPropertyStatistics({ propertyId: id }, signal),
    enabled: Boolean(id),
    staleTime: 30_000,
  });

export const ownerPriceLimitsOptions = (
  id: string | number,
  day: number | string,
  month: number | string,
  year: number | string,
) =>
  queryOptions({
    queryKey: ownerPropertyKeys.priceLimits(id, `${year}-${month}-${day}`),
    queryFn: ({ signal }) =>
      PropertyService.ownerPropertyPriceRangeLimits(
        { property_id: id, day, month, year },
        signal,
      ),
    enabled: Boolean(id && day && month && year),
    staleTime: 30_000,
  });
