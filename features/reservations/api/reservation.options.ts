import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { type OwnerReservationFilters } from "./reservation.keys";
import { reservationKeys } from "./reservation.keys";
import { ReserveService } from "@/api_services/reserve/reserve.service";

const OWNER_PAGE_SIZE = 20;
const OWNER_POLL_INTERVAL = 30 * 60_000;

export const userReservationsOptions = (type: string) =>
  queryOptions({
    queryKey: reservationKeys.user(type),
    queryFn: ({ signal }) => ReserveService.userReserves({ type }, signal),
    staleTime: 30_000,
  });

export const ownerReservationsOptions = (
  filters: OwnerReservationFilters = {},
  autoRefresh = false,
) =>
  infiniteQueryOptions({
    queryKey: reservationKeys.owner(filters),
    queryFn: ({ pageParam, signal }) =>
      ReserveService.ownerReserves({ cursor: pageParam, ...filters }, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const items = lastPage?.data ?? [];
      if (items.length < OWNER_PAGE_SIZE) return undefined;
      return items.at(-1)?.id;
    },
    refetchInterval: autoRefresh ? OWNER_POLL_INTERVAL : false,
    staleTime: 30_000,
  });

export const activeReservationOptions = () =>
  queryOptions({
    queryKey: reservationKeys.active(),
    queryFn: ({ signal }) => ReserveService.activeReserve(signal),
    staleTime: 15_000,
  });

export const ownerActiveReservationCountOptions = (enabled = true) =>
  queryOptions({
    queryKey: reservationKeys.ownerActiveCount(),
    queryFn: ({ signal }) => ReserveService.ownerActiveReserveCount(signal),
    enabled,
    staleTime: 30_000,
  });
