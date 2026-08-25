"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SupportService } from "@/api_services/support/support.service";
import { supportKeys } from "@features/support/api/support.keys";

import type { CreateTicketInput } from "@/types/features/support/api";

export const useCreateSupportTicket = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => SupportService.AddTicket(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: supportKeys.lists() });
      onSuccess?.();
    },
  });
};
