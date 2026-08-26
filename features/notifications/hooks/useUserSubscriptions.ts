"use client";

import { userSubscriptionsOptions } from "@features/notifications/api/notification.options";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { SubscriptionFilters } from "@/types/features/notifications/api";

export const useUserSubscriptions = (filters: SubscriptionFilters) => {
  const query = useInfiniteQuery(userSubscriptionsOptions(filters));
  const subscriptions =
    query.data?.pages.flatMap((page) => page?.data ?? []) ?? [];
  return { ...query, subscriptions };
};
