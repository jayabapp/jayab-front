"use client";

import type { UserSubscriptionFilters } from "@/types/features/user";
import { userSubscriptionsOptions } from "@features/user/api/user.options";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useUserSubscriptions = (filters: UserSubscriptionFilters) => {
  const query = useInfiniteQuery(userSubscriptionsOptions(filters));
  const subscriptions =
    query.data?.pages.flatMap((page) => page?.data ?? []) ?? [];
  return { ...query, subscriptions };
};
