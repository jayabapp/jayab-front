"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useOwnerProperty } from "@features/owner-property/hooks/useOwnerProperty";
import { PropertyService } from "@/api_services/property/property.service";
import { HomeService } from "@/api_services/home/home.service";

const getSafeRedirect = (value?: string) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" ||
      (url.protocol === "http:" && url.hostname === "localhost")
    )
      return url.toString();
  } catch {}
  return null;
};

export const usePhotoUpgradeCheckout = (propertyId?: number) => {
  const settings = useQuery({
    queryKey: ["photo-upgrade", "settings"],
    queryFn: HomeService.getSettings,
    enabled: Boolean(propertyId),
    staleTime: 5 * 60_000,
  });
  const property = useOwnerProperty(propertyId ?? "");
  const checkout = useMutation({
    mutationFn: async (
      payload: Parameters<typeof PropertyService.PayPropetySubscription>[0],
    ) => {
      const response = await PropertyService.PayPropetySubscription(payload);
      const destination = getSafeRedirect(response);
      if (!destination) throw new Error("INVALID_PAYMENT_REDIRECT_URL");
      return destination;
    },
    onSuccess: (destination) => window.location.assign(destination),
  });
  return {
    settings: settings.data,
    property: property.data,
    isPropertyPending: property.isPending,
    checkout,
  };
};
