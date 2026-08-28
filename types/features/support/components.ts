import type { TicketDetails, TicketListItem, TicketReply, SupportTicketType } from "./api";

export type NewTicketFormProps = {
  dataKey: SupportTicketType;
};

export type SupportCardProps = {
  item: TicketListItem;
  type?: "complain";
};

export type TicketMessageProps = {
  item?: TicketDetails | TicketReply;
};

export type SupportTicketModuleProps = {
  ticketId: string;
};
