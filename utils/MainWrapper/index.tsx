"use client";

import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { headerBlackList, mobileFooterBlackList } from "../constantss";
import { useOwnerActiveReservationCount } from "@features/reservations/hooks/useOwnerActiveReservationCount";
import { usePathname, useRouter } from "next/navigation";
import { initMetrix, withMetrix } from "../metrix";
import { useCurrentProfile } from "@features/auth/hooks/useCurrentProfile";
import { useAuthInit } from "@features/auth/hooks/useAuthInit";
import { getCookie } from "cookies-next/client";
import { isMobile } from "react-device-detect";
import { SocketIO } from "../../components/SocketIo";
import { Toaster } from "sonner";

import MobileFooter from "../../components/Footer/MobileFooter";
import LoginModal from "@/components/Modal/LoginModal";
import dynamic from "next/dynamic";
import FCM from "../FCM";

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
  const isAuthScreen = pathname.includes("auth");
  const [isLandscape, setIsLandscape] = useState(
    () =>
      isMobile &&
      typeof window !== "undefined" &&
      window.matchMedia("(orientation: landscape)").matches,
  );

  useEffect(() => {
    initMetrix();
    withMetrix((sdk) =>
      sdk.onMetrixUserIdReceived().then((metrixUserId: string) => {
        console.log({ metrixUserId });
      }),
    );
    const isLogin = getCookie("isLogin");

    if (isLogin) {
      useAuthStore.setState({
        isLogin: true,
        isAdminSso: getCookie("is_admin_sso") === "true",
      });
      if (isAuthScreen) router.push("/");
    }
  }, [isAuthScreen, router]);

  const { data: profile } = useCurrentProfile(isLogin);

  const { data: activeReserves, refetch: refetchActiveReserveCount } =
    useOwnerActiveReservationCount(Boolean(profile?.owner_id));

  useEffect(() => {
    if (profile?.owner_id && owmerActiveReservesSocket)
      void refetchActiveReserveCount();
  }, [owmerActiveReservesSocket, profile?.owner_id, refetchActiveReserveCount]);

  useEffect(() => {
    if (!!activeReserves) setOwmerActiveReservesCount(activeReserves);
    else setOwmerActiveReservesCount(null);
  }, [activeReserves, setOwmerActiveReservesCount]);

  const { data: initData } = useAuthInit(isLogin);

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
  }, [isAdminSso, isLogin]);
  SocketIO();
  useEffect(() => {
    const handleOrientation = () => {
      if (window.orientation == 90 || window.orientation == -90)
        setIsLandscape(true);
      else setIsLandscape(false);
    };
    const handleInstallPrompt = (e: Event) => {
      useStoreParams.setState({ installPrompt: e });
      e.preventDefault();
    };
    const handleInstalled = () => {
      localStorage.setItem("INSTALL_PROMPT_IS_DISABLED", "1");
    };
    window.addEventListener("orientationchange", handleOrientation, false);
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    console.log(
      "INSTALL_PROMPT_IS_DISABLED",
      localStorage.getItem("INSTALL_PROMPT_IS_DISABLED"),
    );
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("orientationchange", handleOrientation);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
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
