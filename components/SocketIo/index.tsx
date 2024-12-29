import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAuthStore, useStoreInit, useStoreSocket } from "@/store";
import { useRouter } from "next/navigation";
import { Url } from "@/utils/urls";
import Notify from "../shared/Toast";

export const SocketIO = () => {
  const { isLogin } = useAuthStore((state) => state);
  const { managerInfo } = useStoreInit((state) => state);
  const router = useRouter();
  // const { userInfo } = useSelector((state: any) => state?.init);
  // const isLogin = authUserStore((state: any) => state?.auth?.isLogin);

  useEffect(() => {
    const socketToken: string = localStorage.getItem("socket_token") || "";
    if (!managerInfo || !isLogin) return;
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
    // socket.on("chat:is-typing", (e) => {
    //   dispatch({
    //     type: "IS_TYPING",
    //     payload: e,
    //   });
    // });
    // socket.on("user:status", (e) => {
    //   dispatch({
    //     type: "USERS_STATUS",
    //     payload: e,
    //   });
    // });
    // socket.on("chat:message-deleted", (e) => {
    //   dispatch({
    //     type: "DELETED_MESSAGE",
    //     payload: e,
    //   });
    // });
    // //////////other than chat ///////////////
    // socket.on("order:status-updated", (e) => {
    //   dispatch({
    //     type: "ORDER_STATUS_ID",
    //     payload: e,
    //   });
    // });
    // socket.on("connect_error", (error) => {
    //   console.log("socket error", error);
    //   // socket.disconnect();
    //   // socket?.off();
    //   socket?.connect();
    // });
    socket.on("disconnect", (reason) => {
      useStoreSocket.setState({ connecting: true });
      console.log("-------disconect-------");
    });
  }, [managerInfo, isLogin]);
};
