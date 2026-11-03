import { unreadChatCountOptions } from "../api/chat.options";
import { useQuery } from "@tanstack/react-query";

export const useUnreadChatCount = (enabled = true) =>
  useQuery(unreadChatCountOptions(enabled));
