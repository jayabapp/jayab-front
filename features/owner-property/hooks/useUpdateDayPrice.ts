"use client";

import { patchOwnerCalendarDays } from "@features/owner-property/lib/calendar-cache";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerPropertyKeys } from "@features/owner-property/api/owner-property.keys";
import { PropertyService } from "@/api_services/property/property.service";
import { propertyKeys } from "@features/properties/api/property.keys";

export const useUpdateDayPrice = (propertyId: string | number) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: PropertyService.updatePropertyPriceOfManyDays,
    onSuccess: async (_result, variables) => {
      patchOwnerCalendarDays(client, propertyId, variables?.days ?? [], {
        discounted_price: Number(variables?.discounted_price || 0),
        price: Number(variables?.price ?? 0),
      });
      await Promise.all([
        client.invalidateQueries({
          queryKey: [...ownerPropertyKeys.all, "calendar", String(propertyId)],
        }),
        // Today's price is part of the owner detail card, so repricing today
        // has to refresh it as well.
        client.invalidateQueries({
          queryKey: ownerPropertyKeys.detail(propertyId),
        }),
        client.invalidateQueries({ queryKey: propertyKeys.all }),
      ]);
    },
  });
};
