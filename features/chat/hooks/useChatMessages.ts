import { chatMessagesOptions } from "../api/chat.options";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useChatMessages = (chatId: string, enabled = true) => {
  const query = useInfiniteQuery(chatMessagesOptions(chatId, enabled));
  const messages = (query.data?.pages.flatMap((page) => page.data) ?? [])
    .filter(
      (message, index, all) =>
        all.findIndex((item) => item.id === message.id) === index,
    )
    .reverse();

  return { ...query, messages };
};
