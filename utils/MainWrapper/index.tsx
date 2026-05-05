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
import { useAuthStore, useStoreInit, useStoreParams, useStoreSocket } from "@/store";
// @ts-ignore
import { authorizeUser, init, onMetrixUserIdReceived, setCustomAttribute, setPhoneNumber } from "@metrixorg/websdk";
import MobileFooter from "../../components/Footer/MobileFooter";
import { headerBlackList, mobileFooterBlackList } from "../constantss";

import LoginModal from "@/components/Modal/LoginModal";
import { getParameter } from "@/helpers/queryGet";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
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
const MainWrapper = ({ children }: mainWrapper) => {
  const router = useRouter();
  const pathname = usePathname();
  const { connecting } = useStoreSocket((state) => state);
  const { isDark } = useStoreParams((state) => state);
  const { isLogin, isAdminSso } = useAuthStore((state) => state);
  const [isVisible, setIsVisible] = useState(true);

  const [accessChecked, setAccessChecked] = useState(false);
  const isAuthScreen = pathname.match("auth");

  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    try {
      const appId = process.env.NEXT_PUBLIC_METRIX_APP_ID;
      const appKey = process.env.NEXT_PUBLIC_METRIX_APP_KEY;

      if (appId && appKey) {
        init(appId, appKey);
      } else {
        console.warn("Metrix SDK: Missing credentials", { appId: !!appId, appKey: !!appKey });
      }
    } catch (error) {
      console.error("Metrix SDK initialization error:", error);
    }

    const isLogin = localStorage.getItem("isLogin");
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
      useAuthStore.setState({ isLogin: true });
      useAuthStore.setState({ isAdminSso: true });
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("access_token", ssoToken);
      redirectUrl && router.push(redirectUrl);
    } else if (isLogin) {
      useAuthStore.setState({ isLogin: true });
      // dispatch({ type: "IS_LOGIN", payload: true });
      if (isAuthScreen) {
        router.push("/");
        hideSplashscreen();
      } else {
        hideSplashscreen();
      }
    } else {
      // router.push("/auth");
      hideSplashscreen();
    }
  }, []);

  // useQuery(
  //   [AuthService?.SHARED_SALON_API_CACHEKEY],
  //   () => {
  //     return AuthService?.GetSaloon();
  //   },
  //   {
  //     onSuccess: (e) => {
  //       // useStoreInit.setState({ managerInfo: e });
  //       // useStoreTheme.persist.getOptions()
  //       useStoreTheme.setState({
  //         color: e?.color_code,
  //         logo: e?.logo_image,
  //         title: e?.title,
  //         splash: e?.splash_image,
  //         background_color: e?.bg_color_code,
  //       });
  //     },
  //   }
  // );

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
      onMetrixUserIdReceived().then((metrixUserId: string) => {
        console.log({ metrixUserId });
        // todo
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
      // dispatch({
      //   type: "INSTALL_PROMPT",
      //   payload: e,
      // });
      useStoreParams.setState({ installPrompt: e });
      e.preventDefault();
    });
    console.log("INSTALL_PROMPT_IS_DISABLED", localStorage.getItem("INSTALL_PROMPT_IS_DISABLED"));
    window.addEventListener("appinstalled", () => {
      localStorage.setItem("INSTALL_PROMPT_IS_DISABLED", "1");
    });
  }, []);

  const hideSplashscreen = () => {
    if (!accessChecked)
      setTimeout(() => {
        setAccessChecked(true);
      }, 1500);
  };

  useEffect(() => {
    const myVisitor_id = localStorage.getItem("visitor_id");
    if (!myVisitor_id) {
      const setFp = async () => {
        const fp = await FingerprintJS.load();

        const { visitorId } = await fp.get();
        localStorage.setItem("visitor_id", visitorId);
      };

      setFp();
    }
  }, []);

  if (isLandscape) {
    return <RotatePhone />;
  }

  // if (!accessChecked) return <Splashscreen />;
  return (
    <div className={`app-background  app-text transition-opacity`}>
      {/* <DesktopHeader /> */}
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
