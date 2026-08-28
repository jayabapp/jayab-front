import { infiniteQueryOptions, mutationOptions, queryOptions } from "@tanstack/react-query";
import { SupportService } from "@/api_services/support/support.service";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { supportKeys } from "./support.keys";
import { ApiError } from "@lib/api/api-error";

import type { CreateTicketInput, ReplyTicketInput } from "@/types/features/support/api";
import type { SupportTicketType } from "@/types/features/support/api";

export const supportTicketsOptions = (
  type: SupportTicketType,
  enabled = true,
) =>
  infiniteQueryOptions({
    queryKey: supportKeys.list(type),
    queryFn: async ({ pageParam, signal }) => {
      const response = await SupportService.getTickets({ page: pageParam, type, signal });
      if (!response) throw new ApiError("پاسخ فهرست تیکت‌ها معتبر نیست");
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, lastPage: totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled,
    staleTime: STALE_TIME.SHORT,
    gcTime: GC_TIME.DEFAULT,
  });

export const supportTicketOptions = (id: number | string) =>
  queryOptions({
    queryKey: supportKeys.detail(id),
    queryFn: async ({ signal }) => {
      const response = await SupportService.getSingleTicket({ id, signal });
      if (!response) throw new ApiError("پاسخ تیکت معتبر نیست");
      return response;
    },
    enabled: Boolean(id),
    staleTime: STALE_TIME.SHORT,
    gcTime: GC_TIME.DEFAULT,
  });

export const createSupportTicketMutationOptions = () =>
  mutationOptions({
    mutationKey: [...supportKeys.all, "create"],
    mutationFn: (input: CreateTicketInput) => SupportService.addTicket(input),
  });

export const replyToSupportTicketMutationOptions = (id: number | string) =>
  mutationOptions({
    mutationKey: [...supportKeys.detail(id), "reply"],
    mutationFn: (input: ReplyTicketInput) => SupportService.replyToTicket(input),
  });
