import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { notificationKeys, userKeys } from "./notification.keys";
import { UserService } from "@/api_services/user/user.service";

import type { SubscriptionFilters } from "@/types/features/notifications/api";
import type { NotificationFilters } from "@/types/features/notifications/api";

const DEFAULT_PAGE_SIZE = 20;

export const notificationsOptions = (filters: NotificationFilters = {}) => {
  const perPage = filters.perPage ?? DEFAULT_PAGE_SIZE;
  return infiniteQueryOptions({
    queryKey: notificationKeys.list({ perPage }),
    queryFn: ({ pageParam, signal }) =>
      UserService.userNotifs({ cursor: pageParam, perPage }, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.data.length < perPage) return undefined;
      return lastPage.data.at(-1)?.id;
    },
    staleTime: 30_000,
  });
};

export const notificationBadgeOptions = (enabled = true) =>
  queryOptions({
    queryKey: notificationKeys.badge(),
    queryFn: ({ signal }) => UserService.userNotifBadge(signal),
    enabled,
    staleTime: 30_000,
  });

export const userSubscriptionsOptions = (filters: SubscriptionFilters) => {
  const perPage = filters.perPage ?? DEFAULT_PAGE_SIZE;
  const keyFilters = {
    from: filters.from ? new Date(filters.from).toISOString() : undefined,
    to: filters.to ? new Date(filters.to).toISOString() : undefined,
  };

  return infiniteQueryOptions({
    queryKey: userKeys.subscriptionList(keyFilters),
    queryFn: ({ pageParam, signal }) =>
      UserService.getUserSubscriptions(
        { ...filters, cursor: pageParam },
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.data.length < perPage) return undefined;
      return lastPage.data.at(-1)?.id;
    },
    staleTime: 30_000,
  });
};
