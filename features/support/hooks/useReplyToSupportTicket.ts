"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SupportService } from "@/api_services/support/support.service";
import { supportKeys } from "@features/support/api/support.keys";

import type { TicketDetails } from "@/types/features/support/api";
import type { ReplyTicketInput } from "@/types/features/support/api";

export const useReplyToSupportTicket = (id: number | string) => {
  const queryClient = useQueryClient();
  const detailKey = supportKeys.detail(id);

  return useMutation({
    mutationFn: (input: ReplyTicketInput) =>
      SupportService.ReplySingleTicket(input),
    onMutate: async ({ message }) => {
      await queryClient.cancelQueries({ queryKey: detailKey });
      const previousTicket = queryClient.getQueryData<TicketDetails>(detailKey);
      queryClient.setQueryData<TicketDetails>(detailKey, (ticket) =>
        ticket
          ? {
              ...ticket,
              replies: [
                ...ticket.replies,
                {
                  id: -Date.now(),
                  message: message.trim(),
                  by_admin: false,
                  created_at: new Date().toISOString(),
                  isOptimistic: true,
                },
              ],
            }
          : ticket,
      );
      return { previousTicket };
    },
    onError: (_error, _input, context) => {
      if (context?.previousTicket) {
        queryClient.setQueryData(detailKey, context.previousTicket);
      }
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: detailKey }),
        queryClient.invalidateQueries({ queryKey: supportKeys.lists() }),
      ]);
    },
  });
};
