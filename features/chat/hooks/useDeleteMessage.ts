import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "@/api_services/chat/chat.service";
import { chatKeys } from "../api/chat.keys";

import type { ChatMessagesPageDto } from "@/api_services/chat/chat.interface";
import type { InfiniteData } from "@tanstack/react-query";

export const useDeleteMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ChatService.deleteMessage,
    onSuccess: (_response, variables) => {
      queryClient.setQueryData<
        InfiniteData<ChatMessagesPageDto, number | string>
      >(chatKeys.messages(chatId), (current) =>
        current
          ? {
              ...current,
              pages: current.pages.map((page) => ({
                ...page,
                data: page.data.map((message) =>
                  message.id === Number(variables.chatId)
                    ? {
                        ...message,
                        text: null,
                        media: null,
                        deleted_at: new Date().toISOString(),
                      }
                    : message,
                ),
              })),
            }
          : current,
      );
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
    },
  });
};
