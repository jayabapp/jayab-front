import type { SubPaymentsDto } from "@/api_services/user/user.interface";

export type UserNotification = {
  id: number;
  title: string;
  body?: string | null;
  data?: {
    event_id?: string | number;
    event_type?: string;
    [key: string]: unknown;
  } | null;
  created_at: string;
};

export type CursorPage<T> = { data: T[] };

export type NotificationFilters = { perPage?: number };

export type SubscriptionFilters = {
  from?: string | number | Date;
  to?: string | number | Date;
  perPage?: number;
};

export type SubscriptionPage = CursorPage<SubPaymentsDto>;
