"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationKeys } from "../api/reservation.keys";
import { ReserveService } from "@/api_services/reserve/reserve.service";

export const useOwnerContactRequest = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ReserveService.ownerMobileClick,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: reservationKeys.owners() }),
        client.invalidateQueries({
          queryKey: reservationKeys.ownerActiveCount(),
        }),
      ]);
    },
  });
};
