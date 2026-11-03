import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "@/api_services/chat/chat.service";
import { chatKeys } from "../api/chat.keys";

export const useMarkChatRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ChatService.chatRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
      void queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
    },
  });
};
