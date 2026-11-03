"use client";

import { supportTicketOptions } from "@features/support/api/support.options";
import { supportKeys } from "@features/support/api/support.keys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";


export const useSupportTicket = (id: number | string) => {
  const queryClient = useQueryClient();
  const query = useQuery(supportTicketOptions(id));
  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: supportKeys.detail(id) }),
    [id, queryClient],
  );
  return {
    ...query,
    ticket: query.data,
    refresh,
  };
};
