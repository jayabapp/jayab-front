import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replaceOptimisticMessage } from "../api/chat.cache";
import { appendMessageToCache } from "../api/chat.cache";
import { ChatService } from "@/api_services/chat/chat.service";
import { chatKeys } from "../api/chat.keys";

import type { InfiniteData } from "@tanstack/react-query";
import type {
  ChatMessagesPageDto,
  NewSingleChatDto,
  SendChatMessageDto,
} from "@/api_services/chat/chat.interface";

export const useSendMessage = (chatId: string, participantId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      ChatService.sendMessage({
        ...variables,
        clientMessageId: variables.clientMessageId ?? crypto.randomUUID(),
      }),
    onMutate: async (variables: SendChatMessageDto) => {
      const clientMessageId = variables.clientMessageId ?? crypto.randomUUID();
      variables.clientMessageId = clientMessageId;
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(chatId) });
      const optimisticMessage: NewSingleChatDto = {
        id: -Date.now(),
        participant_id: participantId ?? 0,
        text: variables.text,
        created_at: new Date().toISOString(),
        deleted_at: null,
        media: variables.optimisticMedia ?? null,
        clientMessageId,
        deliveryStatus: "sending",
      };
      appendMessageToCache(queryClient, chatId, optimisticMessage);
      return { clientMessageId };
    },
    onSuccess: (response, _variables, context) => {
      if (response?.message && context?.clientMessageId) {
        replaceOptimisticMessage(
          queryClient,
          chatId,
          context.clientMessageId,
          response.message,
        );
      }
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
    },
    onError: (_error, _variables, context) => {
      if (!context?.clientMessageId) return;
      queryClient.setQueryData<
        InfiniteData<ChatMessagesPageDto, number | string>
      >(chatKeys.messages(chatId), (current) =>
        current
          ? {
              ...current,
              pages: current.pages.map((page) => ({
                ...page,
                data: page.data.map((message) =>
                  message.clientMessageId === context.clientMessageId
                    ? { ...message, deliveryStatus: "failed" }
                    : message,
                ),
              })),
            }
          : current,
      );
    },
  });
};
