import type { SupportTicketType } from "@/types/features/support/api";

export const supportKeys = {
  all: ["support"] as const,
  lists: () => [...supportKeys.all, "list"] as const,
  list: (type: SupportTicketType) => [...supportKeys.lists(), { type }] as const,
  details: () => [...supportKeys.all, "detail"] as const,
  detail: (id: number | string) => [...supportKeys.details(), String(id)] as const,
};
