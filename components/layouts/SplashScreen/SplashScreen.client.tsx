"use client";

import { useEffect, useRef } from "react";

import splashStyles from "./splashStyles";
import SplashLogo from "./SplashLogo";

const SPLASH_SESSION_KEY = "jayab:splash-seen";

const SplashScreen = () => {
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
        <SplashLogo className="splash-logo" />
      </div>
    </>
  );
};

export default SplashScreen;
