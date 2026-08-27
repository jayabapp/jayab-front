import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "@/api_services/chat/chat.service";
import { chatKeys } from "../api/chat.keys";

export const useStartOrFindChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ChatService.StartOrFindChat,
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() }),
  });
};
