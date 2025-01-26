"use client";

import { usePathname, useRouter, useSelectedLayoutSegment } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { isMobile } from "react-device-detect";
import { Suspense } from "react";
// import { footerWhiteList, sidenavBlackList } from "../constants";
// import { AuthService } from "@repo/api/modules/auth/auth.service";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
// import BtnLoading from "@/components/shared/Button/BtnLoading";
// import GrowingCircleAnimation from "@/components/shared/DarkModeToggle";
import _STRINGS from "../LocalStrings";
import { SocketIO } from "../../components/SocketIo";
// import SideNav from "@/components/SideNav";
// import DesktopHeader from "@/components/Home/HomeHeader/DesktopHeader";
// import ConnectingBanner from "@/components/Headers/ConnectingBanner";
import { useAuthStore, useStoreInit, useStoreParams, useStoreSocket, useStoreTheme } from "@/store";

import { footerBlacklist, headerBlackList, mobileFooterBlackList } from "../constantss";
import RotatePhone from "@/components/shared/Lotties/RotatePhone";
import Splashscreen from "@/components/SplashScreen";
import ConnectingBanner from "@/components/headers/ConnectingBanner";
import { AuthService } from "@/api_services/auth/auth.service";
import Headers from "@/components/headers";
import MobileFooter from "../../components/Footer/MobileFooter";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import LoginModal from "@/components/Modal/LoginModal";
function FallBack() {
  return <></>;
}

interface mainWrapper {
  children: ReactNode;
}
const Footer = dynamic(() => import("../../components/Footer"), {
  ssr: false,
});
const MainWrapper = ({ children }: mainWrapper) => {
  const { connecting } = useStoreSocket((state) => state);

  const router = useRouter();
  // const isDark = useSelector((state: any) => state.params.isDark) || false;
  const { isDark } = useStoreParams((state) => state);
  const { isLogin } = useAuthStore((state) => state);
  // const { connecting } = useSelector((state: { sockets: { connecting: boolean } }) => state.sockets);
  const pathname = usePathname();
  const [accessChecked, setAccessChecked] = useState(false);
  const isAuthScreen = pathname.match("auth");

  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    // useStoreTheme.setState({ logo: fakeLogo });
    const isLogin = localStorage.getItem("isLogin");
    if (isLogin) {
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
      useStoreInit.setState({ userInfo: profile });
    }
  }, [profile]);

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
      false
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
      {!headerBlackList.includes(pathname) && (
        <Suspense fallback={<FallBack />}>
          <Headers />
        </Suspense>
      )}
      <div className="app-size relative " style={{ background: pathname == "/" && !isDark ? "" : "" }}>
        {connecting ? <ConnectingBanner /> : <></>}
        <div className="  mx-auto h-full   w-full   ">
          {/* {!sidenavBlackList?.includes(pathname || "") && <SideNav />} */}
          {children}
        </div>
        {!mobileFooterBlackList.find((e) => pathname?.includes(e)) && <Footer />}
        {!mobileFooterBlackList.find((e) => pathname?.includes(e)) && <MobileFooter />}
      </div>
      <Toaster />
      <LoginModal />
    </div>
  );
};
export default MainWrapper;
