"use client";

import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { useOwnerActiveReservationCount } from "@features/reservations/hooks/useOwnerActiveReservationCount";
import { initMetrix, withMetrix } from "@/utils/metrix";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentProfile } from "./useCurrentProfile";
import { useAuthInit } from "./useAuthInit";
import { useEffect } from "react";
import { getCookie } from "cookies-next/client";

import FCM from "@/utils/FCM";

export const useSessionBootstrap = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLogin, isAdminSso } = useAuthStore((state) => state);
  const isAuthScreen = pathname.includes("auth");

  useEffect(() => {
    initMetrix();
    if (!getCookie("isLogin")) return;

    useAuthStore.setState({
      isLogin: true,
      isAdminSso: getCookie("is_admin_sso") === "true",
    });
    if (isAuthScreen) router.push("/");
  }, [isAuthScreen, router]);

  const { data: profile } = useCurrentProfile(Boolean(isLogin));
  const { data: initData } = useAuthInit(Boolean(isLogin));

  const { data: activeReserves } = useOwnerActiveReservationCount(
    Boolean(profile?.owner_id),
  );

  useEffect(() => {
    useStoreParams
      .getState()
      .setOwmerActiveReservesCount(activeReserves ?? null);
  }, [activeReserves]);

  useEffect(() => {
    if (!initData) return;
    useStoreParams.setState({
      bookmarks: initData?.bookmarks || [],
      likes: initData?.favorites || [],
      isAdvisor: initData?.isValidAdvisor?.isAdvisor || false,
    });
  }, [initData]);

  useEffect(() => {
    if (!profile) return;
    withMetrix((sdk) => {
      sdk.authorizeUser(profile?.id);
      sdk.setPhoneNumber(profile?.mobile_number);
      sdk.setCustomAttribute("full_name", profile?.full_name);
      sdk.setCustomAttribute(
        "role",
        profile?.owner_id
          ? "owner"
          : profile?.advisor_id
            ? "advisor"
            : "customer",
      );
    });
    useStoreInit.setState({ userInfo: profile });
  }, [profile]);

  useEffect(() => {
    if (isLogin && !isAdminSso) FCM.init();
  }, [isAdminSso, isLogin]);

  return { isLogin: Boolean(isLogin), profile };
};
