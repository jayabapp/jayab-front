"use client";

import type { ReserveListDto } from "@/types/features/reservations";
import { useCancelReservation } from "@features/reservations/hooks/useCancelReservation";
import { useState } from "react";

export const useCancelReservationFlow = () => {
  const [selected, setSelected] = useState<ReserveListDto | null>(null);
  const { mutate, isPending } = useCancelReservation(selected?.property_id);
  return {
    close: () => setSelected(null),
    confirm: () => {
      if (!selected || isPending) return;
      mutate(
        { propertyReserveId: selected.id },
        { onSuccess: () => setSelected(null) },
      );
    },
    isPending,
    select: setSelected,
    selected,
  };
};
