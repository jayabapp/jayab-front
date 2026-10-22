"use client";

import { useEffect, useRef } from "react";

import splashStyles from "./splashStyles";

const SPLASH_SESSION_KEY = "jayab:splash-seen";

// The splash always shows the Persian wordmark with the mark, in every locale.
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
        <div className="splash-logo flex flex-col items-center gap-4">
          {/* Plain <img>: both have to paint with the first HTML, before any image pipeline runs. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            width={519}
            height={519}
            className="splash-mark"
            src="/assets/icons/logo/mark-glyph.svg"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            width={624}
            height={244}
            className="splash-title"
            src="/assets/icons/logo/title-fa-white.svg"
          />
        </div>
      </div>
    </>
  );
};

export default SplashScreen;
