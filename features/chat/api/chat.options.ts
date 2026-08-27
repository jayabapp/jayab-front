import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { ChatService } from "@/api_services/chat/chat.service";
import { chatKeys } from "./chat.keys";

const CHAT_PAGE_SIZE = 100;

export const chatsOptions = () =>
  queryOptions({
    queryKey: chatKeys.list(),
    queryFn: async ({ signal }) =>
      (await ChatService.getChatList({ signal })) ?? [],
    staleTime: STALE_TIME.SHORT,
    gcTime: GC_TIME.DEFAULT,
  });

export const chatDetailsOptions = (chatId: string) =>
  queryOptions({
    queryKey: chatKeys.detail(chatId),
    queryFn: ({ signal }) => ChatService.getSingleChat({ id: chatId, signal }),
    enabled: chatId.length > 0,
    staleTime: STALE_TIME.SHORT,
    gcTime: GC_TIME.DEFAULT,
  });

export const chatMessagesOptions = (chatId: string) =>
  infiniteQueryOptions({
    queryKey: chatKeys.messages(chatId),
    queryFn: async ({ pageParam, signal }) =>
      (await ChatService.getSingleChatMessages({
        id: chatId,
        cursor: pageParam,
        signal,
      })) ?? { data: [] },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length < CHAT_PAGE_SIZE) return undefined;
      return lastPage.data.at(-1)?.id;
    },
    enabled: chatId.length > 0,
    staleTime: STALE_TIME.REALTIME,
    gcTime: GC_TIME.DEFAULT,
  });

export const unreadChatCountOptions = (enabled = true) =>
  queryOptions({
    queryKey: chatKeys.unreadCount(),
    queryFn: async ({ signal }) =>
      (await ChatService.getUnreadChatCount({ signal })) ?? { unread_count: 0 },
    enabled,
    staleTime: STALE_TIME.SHORT,
    gcTime: GC_TIME.DEFAULT,
  });
