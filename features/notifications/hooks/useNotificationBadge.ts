"use client";

import { notificationBadgeOptions } from "@features/notifications/api/notification.options";
import { useQuery } from "@tanstack/react-query";

export const useNotificationBadge = (enabled = true) =>
  useQuery(notificationBadgeOptions(enabled));
