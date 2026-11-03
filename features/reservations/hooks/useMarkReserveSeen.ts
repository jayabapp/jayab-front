"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationKeys } from "../api/reservation.keys";
import { ReserveService } from "@/api_services/reserve/reserve.service";

export const useMarkReserveSeen = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ReserveService.ownerMarkSeen,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: reservationKeys.owners() });
    },
  });
};
