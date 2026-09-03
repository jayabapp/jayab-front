import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import {
  BaseContentsDto,
  ChatMessagesPageDto,
  ChatListDto,
  ChatRoomCrreateDto,
  SendMessageReeturnDto,
  SendChatMessageDto,
  SingleChatDetailsDto,
  TicketsDto,
} from "./chat.interface";

export class ChatService {
  static GET_SINGLE_CHAT_CACHEKEY = "GET_SINGLE_CHAT";
  static CHAT_CACHEKEY = "CHAT";
  static NOTIFS_CACHEKEY = "NOTIFS";
  static TICKET_CACHEKEY = "TICKET";
  static NOTIFS_BADGE_CACHEKEY = "NOTIFS_BADGE";
  static CONTENTS_CACHEKEY = "CONTENTS";
  static GET_SNGLE_CHAT_MESSAGES_CACHEKEY = "GET_SNGLE_CHAT_MESSAGES";
  static UNREAD_CHAT_COUNT_CACHEKEY = "UNREAD_CHAT_COUNT";

  static async getChatList(dto: { signal?: AbortSignal } = {}) {
    return apiCall<unknown, ChatListDto[]>("GET", apiRoutes.CHAT, undefined, {
      signal: dto.signal,
    });
  }

  static async getUnreadChatCount(dto: { signal?: AbortSignal } = {}) {
    return apiCall<unknown, { unread_count: number }>(
      "GET",
      apiRoutes.UNREAD_CHAT_COUNT,
      undefined,
      {
        signal: dto.signal,
        showErrorNotification: false,
      },
    );
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
      const result = await apiCall<unknown, number>(
        "GET",
        apiRoutes.NOTIFS_BADGE,
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getSingleChat(dto: {
    id: string | number;
    signal?: AbortSignal;
  }) {
    return apiCall<unknown, SingleChatDetailsDto>(
      "GET",
      apiRoutes.GET_SNGLE_CHAT(dto.id),
      undefined,
      {
        signal: dto.signal,
      },
    );
  }

  static async getSingleChatMessages(dto: {
    id: string | number;
    cursor: string | number;
    signal?: AbortSignal;
  }) {
    return apiCall<unknown, ChatMessagesPageDto>(
      "GET",
      apiRoutes.GET_SNGLE_CHAT_MESSAGES(dto.id, dto.cursor),
      undefined,
      { signal: dto.signal, showErrorNotification: false },
    );
  }

  static async StartOrFindChat(dto: { property_id?: string | number }) {
    try {
      const result = await apiCall<
        { property_id?: string | number },
        ChatRoomCrreateDto
      >("POST", apiRoutes.CHAT, {
        property_id: dto.property_id,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetTickets() {
    try {
      const result = await apiCall<unknown, TicketsDto[]>(
        "GET",
        apiRoutes.TICKETS,
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async GetContent(dto: { page: string | number; key: string }) {
    try {
      const result = await apiCall<
        { page: string | number; key: string },
        BaseContentsDto
      >("GET", apiRoutes.CONTENTS, {
        key: dto?.key,
        page: dto?.page,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async PostTicket(dto: {
    message: string | number;
    title: string | number;
  }) {
    try {
      const result = await apiCall<
        { message: string | number; title: string | number },
        unknown
      >("POST", apiRoutes.TICKETS, {
        message: dto?.message,
        title: dto?.title,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async sendMessage(dto: SendChatMessageDto) {
    return apiCall<{ text: string; media_id?: number }, SendMessageReeturnDto>(
      "POST",
      apiRoutes.SEND_MESSAGE(dto.id),
      { media_id: dto.media_id, text: dto.text },
    );
  }

  static async deleteMessage(dto: {
    id: string | number;
    chatId: number | string;
  }) {
    try {
      const result = await apiCall<unknown, SendMessageReeturnDto>(
        "DELETE",
        apiRoutes.DELETE_MESSAGE(dto?.id, dto?.chatId),
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async chatRead(dto: { chatId: number | string }) {
    try {
      const result = await apiCall<unknown, unknown>(
        "PATCH",
        apiRoutes.READ_MESSAGE(dto?.chatId),
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async blockUserChat(dto: {
    chatId?: number | string;
    action: number;
    target_user_id?: number | string;
  }) {
    try {
      const result = await apiCall<
        { action: number; target_user_id?: number | string },
        unknown
      >("POST", apiRoutes.BLOCK_CHAT(dto?.chatId), {
        action: dto.action,
        target_user_id: dto.target_user_id,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }
}
