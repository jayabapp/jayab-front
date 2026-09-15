"use client";

import { cancelPropertyDiscoveryQueries } from "@features/properties/api/property-discovery.cache";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import queryBuilder from "@/helpers/queryBuilder";

export const useDiscoveryQueryReplace = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  return useCallback(
    (body: Record<string, unknown>) => {
      const next = { ...body };
      delete next.page;
      cancelPropertyDiscoveryQueries(queryClient);
      router.replace(`${pathname}?${queryBuilder(next)}`);
    },
    [pathname, queryClient, router],
  );
};
