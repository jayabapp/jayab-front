import { chatDetailsOptions } from "../api/chat.options";
import { useQuery } from "@tanstack/react-query";

export const useChatDetails = (chatId: string) =>
  useQuery(chatDetailsOptions(chatId));
