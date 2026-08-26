"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Toaster } from "sonner";
// import { footerWhiteList, sidenavBlackList } from "../constants";
// import { AuthService } from "@repo/api/modules/auth/auth.service";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
// import BtnLoading from "@/components/shared/Button/BtnLoading";
// import GrowingCircleAnimation from "@/components/shared/DarkModeToggle";
import { SocketIO } from "../../components/SocketIo";
// import SideNav from "@/components/SideNav";
// import DesktopHeader from "@/components/Home/HomeHeader/DesktopHeader";
// import ConnectingBanner from "@/components/Headers/ConnectingBanner";
import { AuthService } from "@/api_services/auth/auth.service";
import RotatePhone from "@/components/shared/Lotties/RotatePhone";
import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
// @ts-ignore
import { authorizeUser, init, onMetrixUserIdReceived, setCustomAttribute, setPhoneNumber } from "@metrixorg/websdk";
import MobileFooter from "../../components/Footer/MobileFooter";
import { headerBlackList, mobileFooterBlackList } from "../constantss";

import { ReserveService } from "@/api_services/reserve/reserve.service";
import LoginModal from "@/components/Modal/LoginModal";
import { getParameter } from "@/helpers/queryGet";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { getCookie, setCookie } from "cookies-next/client";
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
const SplashScreen = dynamic(() => import("@/components/SplashScreen"), {
  ssr: true,
});

const Headers = dynamic(() => import("@/components/headers"), {
  ssr: true,
});
const HeaderInitialQueriesSetter = dynamic(() => import("@/components/headers/HeaderInitialQueriesSetter"), {
  ssr: true,
});
const MainWrapper = ({ children }: mainWrapper) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, setOwmerActiveReservesCount, owmerActiveReservesSocket } = useStoreParams((state) => state);
  const { isLogin, isAdminSso } = useAuthStore((state) => state);
  const [isVisible, setIsVisible] = useState(true);

  const isAuthScreen = pathname.match("auth");

  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    /* -------------------------------------------------------------------------- */
    /*                                   METRIX                                   */
    /* -------------------------------------------------------------------------- */
    try {
      const appId = process.env.NEXT_PUBLIC_METRIX_APP_ID;
      const appKey = process.env.NEXT_PUBLIC_METRIX_APP_KEY;

      if (appId && appKey) {
        init(appId, appKey);
        onMetrixUserIdReceived().then((metrixUserId: string) => {
          console.log({ metrixUserId });
        });
      } else {
        console.warn("Metrix SDK: Missing credentials", { appId: !!appId, appKey: !!appKey });
      }
    } catch (error) {
      console.error("Metrix SDK initialization error:", error);
    }
    //////////////////////////

    const isLoginLocal = localStorage.getItem("isLogin");
    if (!!isLoginLocal) {
      setCookie("isLogin", "true", { maxAge: 60 * 24 * 60 * 60 });
    }
    const isLogin = getCookie("isLogin") || isLoginLocal;

    /**
     * admin panel sso
     */
    const ssoToken = getParameter("sso_token");
    const redirectUrl = getParameter("__next")?.replaceAll("|", "/");

    /* -------------------------------------------------------------------------- */
    /*                               splash removal                               */
    /* -------------------------------------------------------------------------- */

    if (!isLogin) {
      setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    }

    /////////////////

    //if the url has sso_token query param
    if (ssoToken) {
      useAuthStore.setState({ isLogin: true, isAdminSso: true });
      // localStorage.setItem("isLogin", "true");
      setCookie("isLogin", "true", { maxAge: 60 * 24 * 60 * 60 });
      localStorage.setItem("access_token", ssoToken);
      redirectUrl && router.push(redirectUrl);
    } else if (isLogin) {
      useAuthStore.setState({ isLogin: true });
      if (isAuthScreen) {
        router.push("/");
      } else {
      }
    } else {
    }
  }, []);

  const { data: profile } = useQuery({
    queryKey: [AuthService.AU4_CACHEKEY, isLogin],
    queryFn: () => {
      if (!!isLogin) {
        return AuthService.GetProfile();
      } else {
        return null;
      }
    },

    staleTime: 0,
    gcTime: 0,
  });

  /* -------------------------------------------------------------------------- */
  /*                        INITIAL OWNER ACTIVE RESERVES                       */
  /* -------------------------------------------------------------------------- */

  const { data: activeReserves } = useQuery({
    queryKey: [ReserveService.OWNER_ACTIVE_RESERVE_COUNT_CACHEKEY, profile?.owner_id, owmerActiveReservesSocket],
    queryFn: ReserveService.ownerActiveReserveCount,
    enabled: !!profile?.owner_id,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (!!activeReserves) {
      setOwmerActiveReservesCount(activeReserves);
    } else {
      setOwmerActiveReservesCount(null);
    }
  }, [activeReserves]);

  /* -------------------------------------------------------------------------- */
  /*                              SAVES LIKES DATA                              */
  /* -------------------------------------------------------------------------- */
  const { data: initData } = useQuery({
    queryKey: [AuthService.AUTH_INIT_CACHEKEY, isLogin],
    queryFn: () => {
      if (!!isLogin) {
        return AuthService.initCall();
      } else {
        return null;
      }
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
      setIsVisible(false);
      authorizeUser(profile?.id);
      setPhoneNumber(profile?.mobile_number);
      setCustomAttribute("full_name", profile?.full_name);
      setCustomAttribute("role", !!profile?.owner_id ? "owner" : !!profile?.advisor_id ? "advisor" : "customer");

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
        // Announce the new orientation number
        if (window.orientation == 90 || window.orientation == -90) {
          setIsLandscape(true);
        } else {
          setIsLandscape(false);
        }
      },
      false,
    );

    if (window.matchMedia("(orientation: landscape)").matches && isMobile) {
      setIsLandscape(true);
    }

    window.addEventListener("beforeinstallprompt", (e) => {
      useStoreParams.setState({ installPrompt: e });
      e.preventDefault();
    });
    console.log("INSTALL_PROMPT_IS_DISABLED", localStorage.getItem("INSTALL_PROMPT_IS_DISABLED"));
    window.addEventListener("appinstalled", () => {
      localStorage.setItem("INSTALL_PROMPT_IS_DISABLED", "1");
    });
  }, []);

  // useEffect(() => {
  //   const myVisitor_id = localStorage.getItem("visitor_id");
  //   if (!myVisitor_id) {
  //     const setFp = async () => {
  //       const fp = await FingerprintJS.load();

  //       const { visitorId } = await fp.get();
  //       localStorage.setItem("visitor_id", visitorId);
  //     };

  //     setFp();
  //   }
  // }, []);

  if (isLandscape) {
    return <RotatePhone />;
  }

  return (
    <div className={`app-background  app-text transition-opacity`}>
      {/* <DesktopHeader /> */}
      <Suspense>
        <HeaderInitialQueriesSetter />
      </Suspense>
      {!headerBlackList.includes(pathname) && <Headers />}
      <div className="app-size relative " style={{ background: pathname == "/" && !isDark ? "" : "" }}>
        {/* {connecting && pathname.includes("/chat") ? <ConnectingBanner /> : <></>} */}
        <div style={{ minHeight: "100dvh" }} className="  mx-auto h-full   w-full   ">
          {children}
        </div>
        <SplashScreen isVisible={isVisible} />
        <Suspense fallback={<FallBack />}>
          {" "}
          {!mobileFooterBlackList.find((e) => pathname?.includes(e)) && <Footer />}
          {!mobileFooterBlackList.find((e) => pathname?.includes(e)) && <MobileFooter />}
        </Suspense>{" "}
      </div>
      <Toaster />
      <LoginModal />
    </div>
  );
};
export default MainWrapper;
