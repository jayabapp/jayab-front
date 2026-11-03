import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "@/api_services/chat/chat.service";
import { chatKeys } from "../api/chat.keys";

export const useBlockChatUser = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ChatService.blockUserChat,
    onSuccess: (_response, variables) => {
      queryClient.setQueryData(
        chatKeys.detail(chatId),
        (current: object | undefined) =>
          current
            ? { ...current, is_blocked: variables.action === 1 }
            : current,
      );
    },
  });
};
