"use client";

import { useEffect, useRef } from "react";
import { PropertyService } from "@/api_services/property/property.service";
import { useMutation } from "@tanstack/react-query";

export const useTrackPropertyView = (propertyId?: number | string) => {
  const trackedId = useRef<number | string | undefined>(undefined);
  const { mutate } = useMutation({
    mutationFn: PropertyService.updatePropertyView,
  });

  useEffect(() => {
    if (!propertyId || trackedId.current === propertyId) return;
    trackedId.current = propertyId;
    mutate({ propertyId, fingerprint: 1 });
  }, [mutate, propertyId]);
};
