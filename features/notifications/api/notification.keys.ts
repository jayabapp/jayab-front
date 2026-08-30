import type { NotificationFilters } from "@/types/features/notifications/api";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (filters: NotificationFilters = {}) =>
    [...notificationKeys.lists(), filters] as const,
  badge: () => [...notificationKeys.all, "badge"] as const,
};
