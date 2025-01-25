import { apiRoutes } from "@/utils/urls";

import { apiCall } from "../common/apicall.helper";
import {
  BaseContentsDto,
  ChatListDto,
  ChatRoomCrreateDto,
  ContentDto,
  CreateFndChatDto,
  NewSingleChatDto,
  SendMessageReeturnDto,
  SingleChatDetailsDto,
  SingleChatDto,
  TicketsDto,
} from "./chat.interface";

// import {  } from "./chat.interface";

export class ChatService {
  static GET_SINGLE_CHAT_CACHEKEY = "GET_SINGLE_CHAT";
  static CHAT_CACHEKEY = "CHAT";
  static NOTIFS_CACHEKEY = "NOTIFS";
  static TICKET_CACHEKEY = "TICKET";
  static NOTIFS_BADGE_CACHEKEY = "NOTIFS_BADGE";
  static CONTENTS_CACHEKEY = "CONTENTS";
  static GET_SNGLE_CHAT_MESSAGES_CACHEKEY = "GET_SNGLE_CHAT_MESSAGES";
  static UNREAD_CHAT_COUNT_CACHEKEY = "UNREAD_CHAT_COUNT";

  static async GetChatList() {
    try {
      const result = await apiCall<unknown, ChatListDto[]>("GET", apiRoutes.CHAT);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getUnreadChatCount() {
    try {
      const result = await apiCall<unknown, number>("GET", apiRoutes.UNREAD_CHAT_COUNT);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetNotifs() {
    try {
      const result = await apiCall<unknown, number>("GET", apiRoutes.NOTIFS);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetNotifsBadge() {
    try {
      const result = await apiCall<unknown, number>("GET", "apiRoutes.NOTIFS_BADGE");
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetSingleChat(dto: { id: string | number }) {
    try {
      const result = await apiCall<unknown, SingleChatDetailsDto>("GET", apiRoutes.GET_SNGLE_CHAT(dto?.id));
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetSingleChatMessages(dto: { id: string | number; cursor: string | number }) {
    try {
      const result = await apiCall<unknown, { data: NewSingleChatDto[] }>(
        "GET",
        apiRoutes.GET_SNGLE_CHAT_MESSAGES(dto?.id, dto?.cursor)
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async StartOrFindChat(dto: { property_id?: string | number }) {
    try {
      const result = await apiCall<{ property_id?: string | number }, ChatRoomCrreateDto>("POST", apiRoutes.CHAT, {
        property_id: dto.property_id,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetTickets() {
    try {
      const result = await apiCall<unknown, TicketsDto[]>("GET", "apiRoutes.TICKET");
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetContent(dto: { page: string | number; key: string }) {
    try {
      const result = await apiCall<{ page: string | number; key: string }, BaseContentsDto>("GET", apiRoutes.CONTENTS, {
        key: dto?.key,
        page: dto?.page,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async PostTicket(dto: { message: string | number; title: string | number }) {
    try {
      const result = await apiCall<{ message: string | number; title: string | number }, unknown>(
        "POST",
        "apiRoutes.TICKET",
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

  static async SendMessage(dto: { id: string | number; text: string; media_id?: number }) {
    try {
      const result = await apiCall<{ text: string; media_id?: number }, SendMessageReeturnDto>(
        "POST",
        apiRoutes.SEND_MESSAGE(dto?.id),
        {
          media_id: dto?.media_id,
          text: dto?.text,
        }
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async deleteMessage(dto: { id: string | number; chatId: number | string }) {
    try {
      const result = await apiCall<unknown, SendMessageReeturnDto>(
        "DELETE",
        apiRoutes.DELETE_MESSAGE(dto?.id, dto?.chatId)
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async chatRead(dto: { chatId: number | string }) {
    try {
      const result = await apiCall<unknown, unknown>("PATCH", apiRoutes.READ_MESSAGE(dto?.chatId));
      return result;
    } catch (e) {
      throw e;
    }
  }
}
