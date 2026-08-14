"use client";
import React from "react";
import IosPrompt from "./IosPrompt";
import InstallPromt from ".";

import { useState, useEffect } from "react";
import { isIOS } from "react-device-detect";
import { useStoreInit, useStoreParams } from "../../store";
const TheInstallPrompt = () => {
  const [local, setLocal] = useState<any>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setLocal(localStorage.getItem("INSTALL_PROMPT_IS_DISABLED"));
    }
  }, []);

  const { installPrompt, showInstallPrompt } = useStoreParams((state) => state);

  const [disabledInstallPrompt, setDisabledInstallPrompt] = useState(false);

  const disableInstallPrompt = () => {
    useStoreParams.setState({ showInstallPrompt: false });

    setLocal(1);
    setDisabledInstallPrompt(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("INSTALL_PROMPT_IS_DISABLED", "1");
    }
  };

  function getPWADisplayMode(): "twa" | "standalone" | "browser" {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (document.referrer.startsWith("android-app://")) {
      return "twa";
    } else if (isStandalone) {
      return "standalone";
    }
    return "browser";
  }

  const canShowingInstallPrompt = (grade: number): boolean => {
    if (grade == 2) {
      if (disabledInstallPrompt) return false;
      if (local == "1") return false;
    }
    if (!installPrompt) return false;
    if (getPWADisplayMode() == "twa" || getPWADisplayMode() == "standalone") return false;
    return true;
  };

  const isInStandaloneMode = () => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(display-mode: standalone)").matches || document.referrer.includes("android-app://");
    }
  };

  // isIOS and matchMedia are read from the browser, so they are always false on
  // the server. Deciding before mount would render the prompt on the client but
  // not in the SSR HTML, which is a hydration mismatch (React #418).
  if (!mounted) return <></>;

  return (
    <>
      {(showInstallPrompt || !local) && isIOS && !isInStandaloneMode() ? (
        <IosPrompt callBack={() => disableInstallPrompt()} />
      ) : (showInstallPrompt || canShowingInstallPrompt(2) || !local) && !isInStandaloneMode() && !!installPrompt ? (
        <InstallPromt submitCallBack={() => installPrompt?.prompt()} cacelCallBack={() => disableInstallPrompt()} />
      ) : (
        <></>
      )}
    </>
  );
};

export default TheInstallPrompt;
