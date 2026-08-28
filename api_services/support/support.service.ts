import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import type {
  CreateTicketInput,
  PaginationMeta,
  ReplyTicketInput,
  TicketDetails,
  TicketListItem,
} from "@/types/features/support/api";

export class SupportService {
  static async getTickets(dto: {
    page: string | number;
    type: "TICKET" | "SUGGESTION";
    signal?: AbortSignal;
  }) {
    return apiCall<
      {
        page: string | number;
        type: "TICKET" | "SUGGESTION";
        per_page: number;
      },
      { data: TicketListItem[]; meta: PaginationMeta }
    >(
      "GET",
      apiRoutes.TICKETS,
      { page: dto.page, type: dto.type, per_page: 20 },
      { signal: dto.signal },
    );
  }

  static async addTicket(dto: CreateTicketInput) {
    return apiCall<CreateTicketInput, unknown>("POST", apiRoutes.TICKETS, {
      message: dto.message,
      title: dto.title,
      type: dto.type,
    });
  }

  static async getSingleTicket(dto: { id: number | string; signal?: AbortSignal }) {
    return apiCall<never, TicketDetails>(
      "GET",
      apiRoutes.SINGLE_TICKET_GET(dto.id),
      undefined,
      { signal: dto.signal },
    );
  }

  static async replyToTicket(dto: ReplyTicketInput) {
    return apiCall<{ message: string }, unknown>(
      "POST",
      apiRoutes.SINGLE_TICKET_GET(dto.id),
      {
        message: dto.message,
      },
    );
  }
}
