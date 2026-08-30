"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchOwnerCalendarDays } from "@features/owner-property/lib/calendar-cache";
import { ownerPropertyKeys } from "@features/owner-property/api/owner-property.keys";
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

  const dayOf = (variables: {
    day?: number | string | null;
    month?: number | string | null;
    year?: number | string | null;
  }) => [
    {
      day: Number(variables?.day),
      month: Number(variables?.month),
      year: Number(variables?.year),
    },
  ];

  return {
    allDaysCommission: useMutation({
      mutationFn: PropertyService.UpdatePropertyAllDaysAdvisorCommission,
      onSuccess: invalidate,
    }),
    commission: useMutation({
      mutationFn: PropertyService.UpdateAdvisorCommission,
      onSuccess: async (_result, variables) => {
        patchOwnerCalendarDays(client, propertyId, dayOf(variables), {
          advisor_commission: Number(variables?.advisor_commission),
        });
        await invalidate();
      },
    }),
    note: useMutation({
      mutationFn: PropertyService.UpdateCallendarNote,
      onSuccess: async (_result, variables) => {
        patchOwnerCalendarDays(client, propertyId, dayOf(variables), {
          note: `${variables?.note ?? ""}`,
        });
        await invalidate();
      },
    }),
  };
};
