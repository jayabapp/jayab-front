"use client";

import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { headerBlackList, mobileFooterBlackList } from "../constantss";
import { usePathname, useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next/client";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import { getParameter } from "@/helpers/queryGet";
import { AuthService } from "@/api_services/auth/auth.service";
import { isMobile } from "react-device-detect";
import { useQuery } from "@tanstack/react-query";
import { SocketIO } from "../../components/SocketIo";
import { Toaster } from "sonner";

import MobileFooter from "../../components/Footer/MobileFooter";
import LoginModal from "@/components/Modal/LoginModal";
import dynamic from "next/dynamic";
import FCM from "../FCM";

import { initMetrix, withMetrix } from "../metrix";

function FallBack() {
  return <></>;
}

interface mainWrapper {
  children: ReactNode;
}
const Footer = dynamic(() => import("../../components/Footer"), {
  ssr: true,
});
const Headers = dynamic(() => import("@/components/headers"), {
  ssr: true,
});
const HeaderInitialQueriesSetter = dynamic(
  () => import("@/components/headers/HeaderInitialQueriesSetter"),
  {
    ssr: true,
  },
);

const RotatePhone = dynamic(
  () => import("@/components/shared/Lotties/RotatePhone"),
  { ssr: false },
);
const MainWrapper = ({ children }: mainWrapper) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, setOwmerActiveReservesCount, owmerActiveReservesSocket } =
    useStoreParams((state) => state);
  const { isLogin, isAdminSso } = useAuthStore((state) => state);
  const isAuthScreen = pathname.match("auth");
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    initMetrix();
    withMetrix((sdk) =>
      sdk.onMetrixUserIdReceived().then((metrixUserId: string) => {
        console.log({ metrixUserId });
      }),
    );
    const isLoginLocal = localStorage.getItem("isLogin");
    if (!!isLoginLocal)
      setCookie("isLogin", "true", { maxAge: 60 * 24 * 60 * 60 });
    const isLogin = getCookie("isLogin") || isLoginLocal;
    const ssoToken = getParameter("sso_token");
    const redirectUrl = getParameter("__next")?.replaceAll("|", "/");
    if (ssoToken) {
      useAuthStore.setState({ isLogin: true, isAdminSso: true });
      setCookie("isLogin", "true", { maxAge: 60 * 24 * 60 * 60 });
      localStorage.setItem("access_token", ssoToken);
      redirectUrl && router.push(redirectUrl);
    } else if (isLogin) {
      useAuthStore.setState({ isLogin: true });
      if (isAuthScreen) router.push("/");
    }
  }, []);

  const { data: profile } = useQuery({
    queryKey: [AuthService.AU4_CACHEKEY, isLogin],
    queryFn: () => {
      if (!!isLogin) return AuthService.GetProfile();
      else return null;
    },
    staleTime: 0,
    gcTime: 0,
  });

  const { data: activeReserves } = useQuery({
    queryKey: [
      ReserveService.OWNER_ACTIVE_RESERVE_COUNT_CACHEKEY,
      profile?.owner_id,
      owmerActiveReservesSocket,
    ],
    queryFn: ReserveService.ownerActiveReserveCount,
    enabled: !!profile?.owner_id,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (!!activeReserves) setOwmerActiveReservesCount(activeReserves);
    else setOwmerActiveReservesCount(null);
  }, [activeReserves]);

  const { data: initData } = useQuery({
    queryKey: [AuthService.AUTH_INIT_CACHEKEY, isLogin],
    queryFn: () => {
      if (!!isLogin) return AuthService.initCall();
      else return null;
    },
  });

  useEffect(() => {
    if (!!initData) {
      useStoreParams.setState({
        bookmarks: initData?.bookmarks || [],
        likes: initData?.favorites || [],
        isAdvisor: initData?.isValidAdvisor?.isAdvisor || false,
      });
    }
  }, [initData]);

  useEffect(() => {
    if (!!profile) {
      withMetrix((sdk) => {
        sdk.authorizeUser(profile?.id);
        sdk.setPhoneNumber(profile?.mobile_number);
        sdk.setCustomAttribute("full_name", profile?.full_name);
        sdk.setCustomAttribute(
          "role",
          !!profile?.owner_id
            ? "owner"
            : !!profile?.advisor_id
              ? "advisor"
              : "customer",
        );
      });
      useStoreInit.setState({ userInfo: profile });
    }
  }, [profile]);

  useEffect(() => {
    if (isLogin && !isAdminSso) FCM.init();
  }, [isLogin]);
  SocketIO();
  useEffect(() => {
    window.addEventListener(
      "orientationchange",
      function () {
        if (window.orientation == 90 || window.orientation == -90)
          setIsLandscape(true);
        else setIsLandscape(false);
      },
      false,
    );
    if (window.matchMedia("(orientation: landscape)").matches && isMobile)
      setIsLandscape(true);
    window.addEventListener("beforeinstallprompt", (e) => {
      useStoreParams.setState({ installPrompt: e });
      e.preventDefault();
    });
    console.log(
      "INSTALL_PROMPT_IS_DISABLED",
      localStorage.getItem("INSTALL_PROMPT_IS_DISABLED"),
    );
    window.addEventListener("appinstalled", () => {
      localStorage.setItem("INSTALL_PROMPT_IS_DISABLED", "1");
    });
  }, []);
  if (isLandscape) return <RotatePhone />;
  return (
    <div className={`app-background  app-text transition-opacity`}>
      {/* <DesktopHeader /> */}
      <Suspense>
        <HeaderInitialQueriesSetter />
      </Suspense>
      {!headerBlackList.includes(pathname) && <Headers />}
      <div
        className="app-size relative "
        style={{ background: pathname == "/" && !isDark ? "" : "" }}
      >
        <div style={{ minHeight: "100dvh" }} className="mx-auto h-full w-full">
          {children}
        </div>
        <Suspense fallback={<FallBack />}>
          {" "}
          {!mobileFooterBlackList.find((e) => pathname?.includes(e)) && (
            <Footer />
          )}
          {!mobileFooterBlackList.find((e) => pathname?.includes(e)) && (
            <MobileFooter />
          )}
        </Suspense>{" "}
      </div>
      <Toaster />
      <LoginModal />
    </div>
  );
};

export default MainWrapper;
