"use client";

import { useEffect, useRef } from "react";

import type { SplashScreenProps } from "@/types/components/layouts/splash-screen";

import splashStyles from "./splashStyles";

const SPLASH_SESSION_KEY = "jayab:splash-seen";

const SplashScreen = ({ locale }: SplashScreenProps) => {
  const splashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SPLASH_SESSION_KEY)) {
        splashRef.current?.classList.add("app-splash--seen");
        return;
      }
      sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    } catch {}
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: splashStyles }} />
      <div
        ref={splashRef}
        id="app-splash"
        role="presentation"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          width={782}
          height={218}
          className="splash-logo"
          src={`/assets/icons/logo/title-${locale === "en" ? "en" : "fa"}-white.svg`}
        />
      </div>
    </>
  );
};

export default SplashScreen;
