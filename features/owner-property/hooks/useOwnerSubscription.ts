"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ownerPropertyKeys } from "../api/owner-property.keys";
import { PropertyService } from "@/api_services/property/property.service";

export const useOwnerSubscriptionPlans = (propertyId: string | number) =>
  useQuery({
    queryKey: ownerPropertyKeys.subscriptions(propertyId),
    queryFn: () =>
      PropertyService.GetPropertySubscriptionPlans({
        type: "PROPERTY",
        property_id: propertyId,
      }),
    enabled: Boolean(propertyId),
    staleTime: 60_000,
  });

export const usePayOwnerSubscription = () =>
  useMutation({ mutationFn: PropertyService.PayPropetySubscription });
