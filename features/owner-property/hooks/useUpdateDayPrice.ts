"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerPropertyKeys } from "../api/owner-property.keys";
import { PropertyService } from "@/api_services/property/property.service";
import { propertyKeys } from "@features/properties/api/property.keys";

export const useUpdateDayPrice = (propertyId: string | number) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: PropertyService.updatePropertyPriceOfManyDays,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({
          queryKey: [...ownerPropertyKeys.all, "calendar", String(propertyId)],
        }),
        client.invalidateQueries({ queryKey: propertyKeys.all }),
      ]);
    },
  });
};
