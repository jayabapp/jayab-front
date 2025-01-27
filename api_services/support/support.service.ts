import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { AddTicket, MetaDto, SingleTicketDto, TicketDatum, TicketsDto } from "./support.interface";

export class SupportService {
  static TICKETS_CACHEKEY = "TICKETS";
  static SINGLE_TICKET_GET_CACHEKEY = "SINGLE_TICKET_GET";

  static async GetTickets(dto: { page: string | number; type: "TICKET" | "SUGGESTION" }) {
    try {
      const result = await apiCall<
        { page: string | number; type: "TICKET" | "SUGGESTION"; per_page: number },
        { data: TicketDatum[]; meta: MetaDto }
      >("GET", apiRoutes.TICKETS, {
        page: dto?.page,
        type: dto?.type,
        per_page: 20,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async AddTicket(dto: AddTicket) {
    try {
      const result = await apiCall<AddTicket, unknown>("POST", apiRoutes.TICKETS, {
        message: dto?.message,
        title: dto?.title,
        type: dto?.type,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetSingleTicket(dto: { id: number | string }) {
    try {
      const result = await apiCall<{ id: number | string }, SingleTicketDto>(
        "GET",
        apiRoutes.SINGLE_TICKET_GET(dto?.id)
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async ReplySingleTicket(dto: { id: number | string; message: string }) {
    try {
      const result = await apiCall<{ message: string }, SingleTicketDto>("POST", `${apiRoutes.TICKETS}/${dto.id}`, {
        message: dto.message,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }
}
