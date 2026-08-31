import { useAuthStore, useChatStore, useStoreSocket } from "@/store";
import { invalidateReservationCaches } from "@features/reservations/hooks/reservation-invalidation";
import { patchChatListFromMessage } from "@features/chat/api/chat.cache";
import { appendMessageToCache } from "@features/chat/api/chat.cache";
import { notificationKeys } from "@features/notifications/api/notification.keys";
import { useStoreParams } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { chatKeys } from "@features/chat/api/chat.keys";
import { notify } from "@elements/Toast";
import { Url } from "@/utils/urls";
import { io } from "socket.io-client";

import type { ChatRealtimeMessageEvent } from "@/api_services/chat/chat.interface";
import type { ChatRealtimeDeleteEvent } from "@/api_services/chat/chat.interface";
import type { ChatTypingEvent } from "@/api_services/chat/chat.interface";

export const useRealtimeGateway = () => {
  const { isLogin } = useAuthStore((state) => state);
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!isLogin) {
      queryClient.removeQueries({ queryKey: chatKeys.all });
      useStoreSocket.setState({
        connecting: false,
        socket: null,
        notification: null,
      });
      return;
    }
    const controller = new AbortController();
    let disposed = false;
    let socket: ReturnType<typeof io> | undefined;
    const connect = async () => {
      const response = await fetch("/api/auth/socket-token", {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok || controller.signal.aborted) return;
      const payload = await response.json();
      if (disposed || controller.signal.aborted) return;
      const socketToken = payload?.data?.token;
      if (typeof socketToken !== "string" || !socketToken) return;
      socket = io(Url || "", {
        secure: false,
        transports: ["websocket"],
        rejectUnauthorized: false,
        auth: { token: socketToken },
      });
      if (disposed) {
        socket.disconnect();
        return;
      }
      socket.on("connect", () => {
        useStoreSocket.setState({ connecting: false, socket });
        void queryClient.invalidateQueries({ queryKey: chatKeys.all });
      });
      socket.on("client-connected", () => {
        useStoreSocket.setState({ connecting: false });
        useStoreSocket.setState({ socket: socket });
      });
      socket.on("event:new-notification", (e) => {
        useStoreSocket.setState({ notification: e });
        void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        void notify({
          body: e?.body,
          title: "پیام جدید",
          cb: () => {
            if (e?.eventData?.event_type == "NOTIF_FROM_MANAGER")
              router.push(`/notifications`);
            if (e?.eventData?.event_type == "RESERVE")
              router.push("/profile/reserves");
          },
        });
      });

      socket.on("event:new-reserve", (e) => {
        useStoreParams.setState({ owmerActiveReservesSocket: e });
        void invalidateReservationCaches(queryClient);
      });

      socket.on("user:status", (e) => {
        useChatStore.setState({ usersStatus: e });
      });

      socket.on("chat:is-typing", (e: ChatTypingEvent) => {
        useChatStore.setState({ isTyping: e });
      });

      socket.on("chat:new-message", (e: ChatRealtimeMessageEvent) => {
        useChatStore.setState({ chatNotification: e });
        const isCurrentRoom =
          window.location.pathname === `/chat/${e.chatroom_id}`;
        appendMessageToCache(queryClient, e.chatroom_id, e.message);
        patchChatListFromMessage(
          queryClient,
          e.chatroom_id,
          e.message,
          !isCurrentRoom,
        );
        void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
        if (!isCurrentRoom) {
          queryClient.setQueryData<{ unread_count: number }>(
            chatKeys.unreadCount(),
            (current) => ({
              unread_count: (current?.unread_count ?? 0) + 1,
            }),
          );
          void notify({
            body: e?.message?.text ?? undefined,
            title: "پیام جدید",
            cb: () => {
              router.push(`/chat/${e?.chatroom_id}`);
            },
          });
        }
      });

      socket.on("chat:message-deleted", (e: ChatRealtimeDeleteEvent) => {
        useChatStore.setState({ deletedMessage: e });
        void queryClient.invalidateQueries({
          queryKey: chatKeys.messages(e.chatroom_id),
        });
        void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
      });

      socket.on("disconnect", () => {
        useStoreSocket.setState({ connecting: true, socket: null });
      });
    };
    void connect().catch((error) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      useStoreSocket.setState({ connecting: false, socket: null });
    });
    return () => {
      disposed = true;
      controller.abort();
      socket?.removeAllListeners();
      socket?.disconnect();
      useStoreSocket.setState({
        connecting: false,
        socket: null,
        notification: null,
      });
      useChatStore.setState({
        isTyping: null,
        usersStatus: null,
        deletedMessage: null,
        chatNotification: null,
      });
    };
  }, [isLogin, queryClient, router]);
};
