"use client";

import { clearReservationIdempotencyKey } from "../lib/idempotency";
import { getReservationIdempotencyKey } from "../lib/idempotency";
import { invalidateReservationCaches } from "./reservation-invalidation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import { useRef } from "react";

import type { CreateReserveDto } from "@/api_services/reserve/reserve.interface";

export const useCreateReservation = () => {
  const client = useQueryClient();
  const inFlight = useRef(false);
  return useMutation({
    mutationFn: async (payload: CreateReserveDto) => {
      if (inFlight.current) throw new Error("RESERVATION_ALREADY_SUBMITTING");
      inFlight.current = true;
      try {
        const result = await ReserveService.createReserve(
          payload,
          getReservationIdempotencyKey(payload),
        );
        clearReservationIdempotencyKey(payload);
        return result;
      } finally {
        inFlight.current = false;
      }
    },
    onSuccess: (reservation, payload) =>
      invalidateReservationCaches(
        client,
        reservation?.property_id ?? payload.property_id,
      ),
  });
};
