"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerPropertyKeys } from "../api/owner-property.keys";
import { PropertyService } from "@/api_services/property/property.service";
import { propertyKeys } from "@features/properties/api/property.keys";

export const useDeleteOwnerProperty = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: PropertyService.deleteProperty,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ownerPropertyKeys.lists() }),
        client.invalidateQueries({ queryKey: propertyKeys.lists() }),
      ]);
    },
  });
};
