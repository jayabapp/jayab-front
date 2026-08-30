"use client";

import { propertyDetailOptions } from "@features/properties/api/property.options";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const usePropertyDetailPrefetch = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (slug: string) => {
      if (!slug) return;
      void queryClient.prefetchQuery(propertyDetailOptions(slug));
    },
    [queryClient],
  );
};
