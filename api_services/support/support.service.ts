import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { SingleTicketDto, TicketsDto } from "./support.interface";

export class SupportService {
  static TICKETS_CACHEKEY = "TICKETS";
  static SINGLE_TICKET_GET_CACHEKEY = "SINGLE_TICKET_GET";

  static async GetTickets(dto: { page: string | number }) {
    try {
      const result = await apiCall<{ page: string | number }, TicketsDto>("GET", apiRoutes.TICKETS, {
        page: dto?.page,
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

  static async Reply(dto: { message: string; id: string | number }) {
    try {
      const result = await apiCall<{ message: string }, unknown>("POST", apiRoutes.SINGLE_TICKET_GET(dto?.id), {
        message: dto?.message,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async AddTicket(dto: { title: string | number; message: string | number }) {
    try {
      const result = await apiCall<{ title: string | number; message: string | number }, unknown>(
        "POST",
        apiRoutes.TICKETS,
        {
          message: dto?.message,
          title: dto?.title,
        }
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
}
