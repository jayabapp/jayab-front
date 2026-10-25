"use client";

import { cancelPropertyDiscoveryQueries } from "@features/properties/api/property-discovery.cache";
import { planDiscoveryNavigation } from "@features/properties/lib/discovery-filters";
import { usePathname, useRouter } from "next/navigation";
import { useDiscoveryBaseline } from "@features/properties/context/DiscoveryContext";
import { FILTER_ORDER_PARAM } from "@features/properties/lib/filter-order";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";

export const useDiscoveryQueryReplace = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const baseline = useDiscoveryBaseline();
  const previousOrder =
    useQueryGet<Record<string, string>>()[FILTER_ORDER_PARAM];

  return useCallback(
    (body: Record<string, unknown>) => {
      const plan = planDiscoveryNavigation({
        baseline,
        intended: body,
        pathname,
        previousOrder,
      });
      cancelPropertyDiscoveryQueries(queryClient);
      const query = queryBuilder(plan.query);
      router.replace(query ? `${plan.path}?${query}` : plan.path);
    },
    [baseline, pathname, previousOrder, queryClient, router],
  );
};
