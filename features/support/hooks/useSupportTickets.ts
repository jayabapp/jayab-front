"use client";

import { supportTicketsOptions } from "@features/support/api/support.options";
import type { SupportTicketType } from "@/types/features/support/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useSupportTickets = (type: SupportTicketType, enabled = true) => {
  const query = useInfiniteQuery(supportTicketsOptions(type, enabled));
  const tickets = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    ...query,
    tickets,
  };
};
