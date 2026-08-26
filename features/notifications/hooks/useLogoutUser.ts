"use client";

import { useAuthStore, useStoreInit } from "@/store";
import { notificationKeys } from "@features/notifications/api/notification.keys";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { supportKeys } from "@features/support/api/support.keys";
import { AuthService } from "@/api_services/auth/auth.service";
import { endSession } from "@/helpers/session";
import { useRouter } from "next/navigation";
import { userKeys } from "@features/notifications/api/notification.keys";

export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useCallback(async () => {
    const scopedKeys = [
      notificationKeys.all,
      userKeys.all,
      supportKeys.all,
      [AuthService.GET_PROFILE_CACHEKEY],
    ] as const;

    await Promise.all(
      scopedKeys.map((queryKey) => queryClient.cancelQueries({ queryKey })),
    );
    scopedKeys.forEach((queryKey) => queryClient.removeQueries({ queryKey }));
    await endSession();
    useAuthStore.setState({ isLogin: false, isAdminSso: false });
    useStoreInit.setState({ userInfo: null });
    router.push("/");
  }, [queryClient, router]);
};
