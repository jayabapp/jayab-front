import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { SupportService } from "@/api_services/support/support.service";
import { supportKeys } from "./support.keys";
import { ApiError } from "@lib/api/api-error";

import type { SupportTicketType } from "@/types/features/support/api";

export const supportTicketsOptions = (
  type: SupportTicketType,
  enabled = true,
) =>
  infiniteQueryOptions({
    queryKey: supportKeys.list(type),
    queryFn: async ({ pageParam, signal }) => {
      const response = await SupportService.GetTickets(
        { page: pageParam, type },
        signal,
      );
      if (!response) throw new ApiError("پاسخ فهرست تیکت‌ها معتبر نیست");
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, lastPage: totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled,
    staleTime: 30_000,
  });

export const supportTicketOptions = (id: number | string) =>
  queryOptions({
    queryKey: supportKeys.detail(id),
    queryFn: async ({ signal }) => {
      const response = await SupportService.GetSingleTicket({ id }, signal);
      if (!response) throw new ApiError("پاسخ تیکت معتبر نیست");
      return response;
    },
    enabled: Boolean(id),
    staleTime: 30_000,
  });
