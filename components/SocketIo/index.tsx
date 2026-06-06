import { useAuthStore, useChatStore, useStoreParams, useStoreSocket } from "@/store";
import { Url } from "@/utils/urls";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { io } from "socket.io-client";
import Notify from "../shared/Toast";

export const SocketIO = () => {
  const { isLogin } = useAuthStore((state) => state);
  const router = useRouter();
  // const { userInfo } = useSelector((state: any) => state?.init);
  // const isLogin = authUserStore((state: any) => state?.auth?.isLogin);

  useEffect(() => {
    const socketToken: string = localStorage.getItem("socket_token") || "";
    if (!isLogin) return;
    const socket = io(Url || "", {
      secure: false,
      transports: ["websocket"],
      rejectUnauthorized: false,
      auth: { token: socketToken },
    });
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("client-connected", (e) => {
      console.log("client-connected", e);

      useStoreSocket.setState({ connecting: false });

      useStoreSocket.setState({ socket: socket });
    });
    socket.on("event:new-notification", (e) => {
      useStoreSocket.setState({ notification: e });
      Notify({
        body: e?.body,
        title: "پیام جدید",

        cb: () => {
          if (e?.eventData?.event_type == "NOTIF_FROM_MANAGER") {
            router.push(`/notifications`);
          }
          if (e?.eventData?.event_type == "RESERVE") {
            router.push(`/reserves/${e?.eventData?.event_id}`);
            // router.push(`/reserves/${e?.eventData?.event_id}`);
            //  `/service-providers/${item?.data?.employee_id}/${item?.data?.event_id}`
          }
        },
      });
    });

    /* --------------------------------- RESERVE -------------------------------- */
    socket.on("event:new-reserve", (e) => {
      useStoreParams.setState({ owmerActiveReservesSocket: e });
    });

    /////////CHAT////////
    socket.on("chat:is-typing", (e) => {
      useChatStore.setState({ isTyping: e });
    });

    socket.on("chat:new-message", (e) => {
      useChatStore.setState({ chatNotification: e });

      if (!window.location?.href?.includes("/chat"))
        Notify({
          body: e?.message?.text,
          title: "پیام جدید",

          cb: () => {
            router.push(`/chat/${e?.chatroom_id}`);
          },
        });
    });

    socket.on("chat:message-deleted", (e) => {
      useChatStore.setState({ deletedMessage: e });
    });

    socket.on("disconnect", (reason) => {
      useStoreSocket.setState({ connecting: true });
      console.log("-------disconect-------");
    });
  }, [isLogin]);
};
