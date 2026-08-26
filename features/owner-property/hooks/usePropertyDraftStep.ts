"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerPropertyKeys } from "../api/owner-property.keys";
import { PropertyService } from "@/api_services/property/property.service";
import { propertyKeys } from "@features/properties/api/property.keys";

export type PropertyDraftStep =
  | "initials"
  | "location"
  | "media"
  | "bedroom"
  | "facility"
  | "price"
  | "assistants"
  | "terms"
  | "environment";

const stepMutations: Record<
  PropertyDraftStep,
  (variables: any) => Promise<unknown>
> = {
  initials: PropertyService.CreatePropertyStepOne,
  location: PropertyService.CreatePropertySetLocation,
  media: PropertyService.CreatePropertySetMdia,
  bedroom: PropertyService.CreatePropertySetBedroom,
  facility: PropertyService.CreatePropertySetFacility,
  price: PropertyService.CreatePropertySetPrice,
  assistants: PropertyService.CreatePropertySetAssistant,
  terms: PropertyService.CreatePropertySetTerms,
  environment: PropertyService.CreatePropertySetEnv,
};

export const usePropertyDraftStep = (
  step: PropertyDraftStep,
  propertyId: string | number,
  onSaved?: () => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stepMutations[step],
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ownerPropertyKeys.draft(propertyId),
        }),
        queryClient.invalidateQueries({
          queryKey: ownerPropertyKeys.detail(propertyId),
        }),
        queryClient.invalidateQueries({ queryKey: ownerPropertyKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: propertyKeys.all }),
      ]);
      onSaved?.();
    },
  });
};
