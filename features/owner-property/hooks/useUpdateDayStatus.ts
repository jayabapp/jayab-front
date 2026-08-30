"use client";

import { patchOwnerCalendarDays } from "@features/owner-property/lib/calendar-cache";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerPropertyKeys } from "@features/owner-property/api/owner-property.keys";
import { PropertyService } from "@/api_services/property/property.service";
import { propertyKeys } from "@features/properties/api/property.keys";

export const useUpdateDayStatus = (propertyId: string | number) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: PropertyService.updatePropertyStatusOfManyDays,
    onSuccess: async (_result, variables) => {
      patchOwnerCalendarDays(client, propertyId, variables?.days ?? [], {
        is_reserved: variables?.is_reserved,
      });
      await Promise.all([
        client.invalidateQueries({
          queryKey: [...ownerPropertyKeys.all, "calendar", String(propertyId)],
        }),
        client.invalidateQueries({
          queryKey: ownerPropertyKeys.detail(propertyId),
        }),
        client.invalidateQueries({
          queryKey: propertyKeys.reservedDates(propertyId),
        }),
        client.invalidateQueries({
          queryKey: [
            ...propertyKeys.all,
            "calendar",
            { id: String(propertyId) },
          ],
        }),
      ]);
    },
  });
};
