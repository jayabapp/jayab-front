import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { notificationKeys } from "./notification.keys";
import { UserService } from "@/api_services/user/user.service";

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
      return lastPage.data[lastPage.data.length - 1]?.id;
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
