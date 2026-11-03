"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertyBadgeOptions } from "../api/owner-property.options";
import { ownerPropertyKeys } from "../api/owner-property.keys";
import { PropertyService } from "@/api_services/property/property.service";

export const usePropertyBadge = (id: string | number) => {
  const client = useQueryClient();
  const query = useQuery(propertyBadgeOptions(id));
  const request = useMutation({
    mutationFn: PropertyService.RequestSingleOwnerPropertyBadge,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ownerPropertyKeys.badge(id) }),
  });
  return { ...query, request };
};
