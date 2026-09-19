"use client";

import { clearReservationIdempotencyKey } from "../lib/idempotency";
import { getReservationIdempotencyKey } from "../lib/idempotency";
import { invalidateReservationCaches } from "./reservation-invalidation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import { useRef } from "react";

import type { CreateReserveDto } from "@/api_services/reserve/reserve.interface";

const DATES_UNAVAILABLE_ERROR = "RESERVE_DATES_UNAVAILABLE";

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
    onError: (error: { message_code?: string }, payload) => {
      if (error?.message_code === DATES_UNAVAILABLE_ERROR)
        void invalidateReservationCaches(client, payload.property_id);
    },
    onSuccess: (result, payload) =>
      invalidateReservationCaches(
        client,
        result?.reserve.property_id ?? payload.property_id,
      ),
  });
};
