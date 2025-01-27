import { Meta } from "../chat/chat.interface";
import { Status } from "../property/property.interface";

export interface TicketsDto {
  data: TicketDatum[];
  meta: Meta;
}

export interface TicketDatum {
  id: number;
  title: string;
  message: string;
  status: Status;
  created_at: string;
}

export interface SingleTicketDto {
  id: number;
  user_id: number;
  title: string;
  message: string;
  status: number;
  created_at: string;
  type: string;
  replies: Reply[];
}

export interface Reply {
  id: number;
  message: string;
  admin: boolean;
  created_at: string;
}

export interface MetaDto {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number;
  next: number;
}

export interface AddTicket {
  title: string;
  message: string;
  type: "TICKET" | "SUGGESTION";
}
