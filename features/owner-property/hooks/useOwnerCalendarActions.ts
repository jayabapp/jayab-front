"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerPropertyKeys } from "../api/owner-property.keys";
import { PropertyService } from "@/api_services/property/property.service";
import { propertyKeys } from "@features/properties/api/property.keys";

export const useOwnerCalendarActions = (propertyId: string | number) => {
  const client = useQueryClient();
  const invalidate = async () =>
    Promise.all([
      client.invalidateQueries({
        queryKey: [...ownerPropertyKeys.all, "calendar", String(propertyId)],
      }),
      client.invalidateQueries({
        queryKey: ownerPropertyKeys.detail(propertyId),
      }),
      client.invalidateQueries({ queryKey: propertyKeys.all }),
    ]);
  return {
    note: useMutation({
      mutationFn: PropertyService.UpdateCallendarNote,
      onSuccess: invalidate,
    }),
    commission: useMutation({
      mutationFn: PropertyService.UpdateAdvisorCommission,
      onSuccess: invalidate,
    }),
    allDaysCommission: useMutation({
      mutationFn: PropertyService.UpdatePropertyAllDaysAdvisorCommission,
      onSuccess: invalidate,
    }),
  };
};
