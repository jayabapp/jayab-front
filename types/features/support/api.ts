import type { Status } from "@/api_services/property/property.interface";

export type SupportTicketType = "SUGGESTION" | "TICKET";

export type TicketReply = {
  id: number;
  message: string;
  by_admin: boolean;
  created_at: string;
  title?: string;
};

export type TicketListItem = {
  id: number;
  title: string;
  message: string;
  status: Status;
  created_at: string;
};

export type TicketDetails = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  status: number;
  created_at: string;
  type: string;
  by_admin?: boolean;
  replies: TicketReply[];
};

export type PaginationMeta = {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
};

export type TicketListResponse = {
  data: TicketListItem[];
  meta: PaginationMeta;
};

export type CreateTicketInput = {
  title: string;
  message: string;
  type: SupportTicketType;
};

export type ReplyTicketInput = {
  id: number | string;
  message: string;
};
