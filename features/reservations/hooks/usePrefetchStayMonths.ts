"use client";

import { propertyCalendarOptions } from "@features/properties/api/property.options";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { stayMonths } from "../lib/stay-months";

const PREFETCH_MONTHS = 2;

export const usePrefetchStayMonths = (propertyId: number) => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    stayMonths(0, PREFETCH_MONTHS).forEach((month) => {
      void queryClient.prefetchQuery(
        propertyCalendarOptions(propertyId, month),
      );
    });
  }, [propertyId, queryClient]);
};
