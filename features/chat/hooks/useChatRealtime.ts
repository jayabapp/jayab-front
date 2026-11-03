import { useChatStore, useStoreSocket } from "@/store";
import { useEffect, useRef } from "react";
import { useMarkChatRead } from "./useMarkChatRead";
import { useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "../api/chat.keys";

export const useChatRealtime = (chatId: string, enabled = true) => {
  const connecting = useStoreSocket((state) => state.connecting);
  const usersStatus = useChatStore((state) => state.usersStatus);
  const chatNotification = useChatStore((state) => state.chatNotification);
  const queryClient = useQueryClient();
  const wasConnecting = useRef(false);
  const markRead = useMarkChatRead();

  useEffect(() => {
    if (enabled && wasConnecting.current && !connecting) {
      void queryClient.invalidateQueries({ queryKey: chatKeys.detail(chatId) });
      void queryClient.invalidateQueries({
        queryKey: chatKeys.messages(chatId),
      });
    }
    wasConnecting.current = connecting;
  }, [chatId, connecting, enabled, queryClient]);

  useEffect(() => {
    if (!chatId || !enabled) return;
    markRead.mutate({ chatId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, enabled]);

  useEffect(() => {
    if (
      enabled &&
      chatNotification?.chatroom_id === chatId &&
      document.visibilityState === "visible"
    )
      markRead.mutate({ chatId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, chatNotification?.message?.id, enabled]);

  return { connecting, usersStatus };
};
