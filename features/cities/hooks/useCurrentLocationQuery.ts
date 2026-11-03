"use client";

import { currentLocationQuery } from "@features/cities/lib/location-label";
import { useCitiesStore } from "@/store";
import { usePathname } from "next/navigation";

import useQueryGet from "@/helpers/queryGet";

export const useCurrentLocationQuery = () => {
  const pathname = usePathname();
  const queries = useQueryGet<Record<string, string>>();
  const stored = useCitiesStore((state) => state.locationsData);
  return currentLocationQuery(queries, stored, pathname);
};
