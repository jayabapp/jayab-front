"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { chatKeys } from "../api/chat.keys";

import { endSession } from "@/helpers/session";

export const useSwitchChatAccount = (chatId: string) => {
  const queryClient = useQueryClient();

  return async () => {
    queryClient.removeQueries({ queryKey: chatKeys.all });
    await endSession();
    useAuthStore.setState({ isLogin: false });
    const redirectUrl = encodeURIComponent(`/chat/${chatId}`);
    window.location.replace(`/auth?redirect_url=${redirectUrl}`);
  };
};
