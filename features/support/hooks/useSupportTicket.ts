"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supportTicketOptions } from "@features/support/api/support.options";
import { SupportService } from "@/api_services/support/support.service";
import { supportKeys } from "@features/support/api/support.keys";
import { useCallback } from "react";

import type { ReplyTicketInput } from "@/types/features/support/api";

export const useSupportTicket = (id: number | string) => {
  const queryClient = useQueryClient();
  const query = useQuery(supportTicketOptions(id));
  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: supportKeys.detail(id) }),
    [id, queryClient],
  );
  const replyMutation = useMutation({
    mutationFn: (input: ReplyTicketInput) =>
      SupportService.ReplySingleTicket(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: supportKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: supportKeys.lists() });
    },
  });

  return {
    ...query,
    refresh,
    reply: replyMutation.mutate,
    replyAsync: replyMutation.mutateAsync,
    isReplyPending: replyMutation.isPending,
  };
};
