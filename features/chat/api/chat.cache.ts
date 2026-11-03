import { chatKeys } from "./chat.keys";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { ChatMessagesPageDto } from "@/api_services/chat/chat.interface";
import type { NewSingleChatDto } from "@/api_services/chat/chat.interface";
import type { ChatListDto } from "@/api_services/chat/chat.interface";

export const messageExists = (
  messages: NewSingleChatDto[],
  candidate: NewSingleChatDto,
) =>
  messages.some(
    (message) =>
      message.id === candidate.id ||
      (!!candidate.clientMessageId &&
        message.clientMessageId === candidate.clientMessageId),
  );

export const appendMessageToCache = (
  queryClient: QueryClient,
  chatId: string,
  message: NewSingleChatDto,
) => {
  queryClient.setQueryData<InfiniteData<ChatMessagesPageDto, number | string>>(
    chatKeys.messages(chatId),
    (current) => {
      if (!current) return current;
      const messages = current.pages.flatMap((page) => page.data);
      if (messageExists(messages, message)) return current;

      const pages = [...current.pages];
      pages[0] = { ...pages[0], data: [message, ...pages[0].data] };
      return { ...current, pages };
    },
  );
};

export const replaceOptimisticMessage = (
  queryClient: QueryClient,
  chatId: string,
  clientMessageId: string,
  message: NewSingleChatDto,
) => {
  queryClient.setQueryData<InfiniteData<ChatMessagesPageDto, number | string>>(
    chatKeys.messages(chatId),
    (current) => {
      if (!current) return current;
      return {
        ...current,
        pages: current.pages.map((page) => ({
          ...page,
          data: page.data.map((item) =>
            item.clientMessageId === clientMessageId
              ? { ...message, clientMessageId, deliveryStatus: "sent" }
              : item,
          ),
        })),
      };
    },
  );
};

export const patchChatListFromMessage = (
  queryClient: QueryClient,
  chatId: string,
  message: NewSingleChatDto,
  incrementUnread: boolean,
) => {
  queryClient.setQueryData<ChatListDto[]>(chatKeys.list(), (current) => {
    if (!current) return current;
    const index = current.findIndex((chat) => chat.uuid === chatId);
    if (index < 0) return current;
    const target = current[index];
    const updated: ChatListDto = {
      ...target,
      last_update: message.created_at,
      last_message: {
        ...target.last_message,
        id: message.id,
        text: message.text ?? "",
        updated_at: new Date(message.created_at),
      },
      unread_count: incrementUnread
        ? Number(target.unread_count || 0) + 1
        : target.unread_count,
    };
    return [updated, ...current.filter((_, itemIndex) => itemIndex !== index)];
  });
};
