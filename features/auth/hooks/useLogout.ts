"use client";

import {
  useChatStore,
  useStoreInit,
  useStoreParams,
  useStoreSocket,
} from "@/store";
import { useAuthQueriesStore, useAuthStore } from "@/store";
import { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { endSession } from "@/helpers/session";
import { useRouter } from "next/navigation";
import { authKeys } from "../api/auth.keys";
import { userKeys } from "@features/user/api/user.keys";
import { advisorKeys } from "@features/advisors/api/advisor.keys";

import FCM from "@/utils/FCM";

const PRIVATE_QUERY_ROOTS = new Set([
  "auth",
  "chat",
  "notifications",
  "user",
  "support",
  "reservations",
  "owner-properties",
  "photo-upgrade",
]);

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const logoutLockRef = useRef<Promise<void> | null>(null);

  return useCallback(() => {
    if (logoutLockRef.current) return logoutLockRef.current;
    logoutLockRef.current = (async () => {
      const privateQueries = queryClient.getQueryCache().findAll({
        predicate: (query) =>
          PRIVATE_QUERY_ROOTS.has(String(query.queryKey[0] ?? "")),
      });
      await Promise.all(
        privateQueries.map((query) =>
          queryClient.cancelQueries({ queryKey: query.queryKey }),
        ),
      );
      privateQueries.forEach((query) =>
        queryClient.removeQueries({ queryKey: query.queryKey }),
      );
      queryClient.removeQueries({ queryKey: authKeys.all });
      await Promise.all([
        queryClient.cancelQueries({ queryKey: advisorKeys.profile() }),
        queryClient.cancelQueries({ queryKey: userKeys.bookmarks() }),
      ]);
      queryClient.removeQueries({ queryKey: advisorKeys.profile() });
      queryClient.removeQueries({ queryKey: userKeys.bookmarks() });
      useStoreSocket.getState().socket?.disconnect();
      useStoreSocket.setState({
        connecting: false,
        socket: null,
        notification: null,
      });
      await Promise.allSettled([endSession(), FCM.cleanup()]);
      useAuthStore.setState({
        isLogin: false,
        isAdminSso: false,
        authCodeExpire: null,
      });
      useAuthQueriesStore.setState({ auth_queries: null });
      useStoreInit.setState({ userInfo: null });
      useStoreParams.setState({
        bookmarks: [],
        likes: [],
        isAdvisor: false,
        notificationsCount: 0,
        owmerActiveReservesCount: 0,
        owmerActiveReservesSocket: null,
      });
      useChatStore.setState({
        isTyping: null,
        chatReply: null,
        chatDelete: null,
        chatProduct: null,
        usersStatus: null,
        chatsPageData: null,
        deletedMessage: null,
        chatNotification: null,
      });
      router.replace("/");
    })().finally(() => {
      logoutLockRef.current = null;
    });
    return logoutLockRef.current;
  }, [queryClient, router]);
};
