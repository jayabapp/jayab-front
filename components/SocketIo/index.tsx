import {
  ChatRealtimeDeleteEvent,
  ChatRealtimeMessageEvent,
  ChatTypingEvent,
} from "@/api_services/chat/chat.interface";
import {
  appendMessageToCache,
  patchChatListFromMessage,
} from "@features/chat/api/chat.cache";
import { useAuthStore, useChatStore, useStoreSocket } from "@/store";
import { notificationKeys } from "@features/notifications/api/notification.keys";
import { useStoreParams } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { chatKeys } from "@features/chat/api/chat.keys";
import { notify } from "../shared/Toast/notify";
import { Url } from "@/utils/urls";
import { io } from "socket.io-client";

export const SocketIO = () => {
  const { isLogin } = useAuthStore((state) => state);
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    const socketToken: string = localStorage.getItem("socket_token") || "";
    if (!isLogin) {
      queryClient.removeQueries({ queryKey: chatKeys.all });
      useStoreSocket.setState({
        connecting: false,
        socket: null,
        notification: null,
      });
      return;
    }
    const socket = io(Url || "", {
      secure: false,
      transports: ["websocket"],
      rejectUnauthorized: false,
      auth: { token: socketToken },
    });
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
            router.push(`/reserves/${e?.eventData?.event_id}`);
        },
      });
    });

    socket.on("event:new-reserve", (e) => {
      useStoreParams.setState({ owmerActiveReservesSocket: e });
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
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
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
