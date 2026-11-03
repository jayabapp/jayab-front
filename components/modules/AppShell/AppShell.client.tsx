"use client";

import { useSessionBootstrap } from "@features/auth/hooks/useSessionBootstrap";
import { useRealtimeGateway } from "@features/chat/hooks/useRealtimeGateway";
import type { AppShellProps } from "@/types/components/modules/app-shell";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import { useStoreParams } from "@/store";

import dynamic from "next/dynamic";

const RotatePhone = dynamic(
  () => import("@elements/Lottie/RotatePhone.client"),
  { ssr: false },
);

const AppShell = ({ children }: AppShellProps) => {
  const [isLandscape, setIsLandscape] = useState(
    () =>
      isMobile &&
      typeof window !== "undefined" &&
      window.matchMedia("(orientation: landscape)").matches,
  );

  useSessionBootstrap();
  useRealtimeGateway();

  useEffect(() => {
    const handleOrientation = () =>
      setIsLandscape(window.orientation == 90 || window.orientation == -90);

    const handleInstallPrompt = (event: Event) => {
      useStoreParams.setState({ installPrompt: event });
      event.preventDefault();
    };

    const handleInstalled = () =>
      localStorage.setItem("INSTALL_PROMPT_IS_DISABLED", "1");

    window.addEventListener("orientationchange", handleOrientation, false);
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("orientationchange", handleOrientation);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (isLandscape) return <RotatePhone />;

  return <>{children}</>;
};

export default AppShell;
