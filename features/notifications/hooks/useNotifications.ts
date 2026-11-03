"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsOptions } from "@features/notifications/api/notification.options";
import { notificationKeys } from "@features/notifications/api/notification.keys";
import { useEffect } from "react";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const query = useInfiniteQuery(notificationsOptions());
  const notifications =
    query.data?.pages.flatMap((page) => page?.data ?? []) ?? [];
  useEffect(() => {
    if (query.isSuccess) queryClient.setQueryData(notificationKeys.badge(), 0);
  }, [query.isSuccess, queryClient]);
  return { ...query, notifications };
};
