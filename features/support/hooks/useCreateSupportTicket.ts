"use client";

import { createSupportTicketMutationOptions } from "@features/support/api/support.options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supportKeys } from "@features/support/api/support.keys";

export const useCreateSupportTicket = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...createSupportTicketMutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: supportKeys.lists() });
      onSuccess?.();
    },
  });
};
