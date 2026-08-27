"use client";

import { ownerReservationsOptions } from "../api/reservation.options";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { OwnerReservationFilters } from "../api/reservation.keys";

export const useOwnerReservations = (filters: OwnerReservationFilters = {}) => {
  const query = useInfiniteQuery(ownerReservationsOptions(filters));
  const reservations = Array.from(
    new Map(
      (query.data?.pages.flatMap((page) => page?.data ?? []) ?? []).map(
        (reservation) => [reservation.id, reservation],
      ),
    ).values(),
  );
  return { ...query, reservations };
};
