"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateReservationCaches } from "./reservation-invalidation";
import { reservationKeys } from "../api/reservation.keys";
import { ReserveService } from "@/api_services/reserve/reserve.service";

import type { ReserveListDto } from "@/api_services/reserve/reserve.interface";

const removeReservation = (value: unknown, id: number): unknown => {
  if (Array.isArray(value))
    return value
      .filter((item) => (item as ReserveListDto)?.id !== id)
      .map((item) => removeReservation(item, id));
  if (!value || typeof value !== "object" || value instanceof Date)
    return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      removeReservation(child, id),
    ]),
  );
};

export const useCancelReservation = (propertyId?: number) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ReserveService.cancelReserve,
    onMutate: async ({ propertyReserveId }) => {
      await client.cancelQueries({ queryKey: reservationKeys.all });
      const snapshots = client.getQueriesData({
        queryKey: reservationKeys.all,
      });
      client.setQueriesData({ queryKey: reservationKeys.all }, (data) =>
        removeReservation(data, Number(propertyReserveId)),
      );
      return { snapshots };
    },
    onError: (_error, _variables, context) =>
      context?.snapshots.forEach(([key, data]) =>
        client.setQueryData(key, data),
      ),
    onSuccess: () => invalidateReservationCaches(client, propertyId),
  });
};
