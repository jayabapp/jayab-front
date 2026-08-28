"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupportTicketMutationOptions } from "@features/support/api/support.options";
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
