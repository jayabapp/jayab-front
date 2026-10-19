"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Opens every newly navigated page at its top.
 *
 * The App Router is meant to reset the scroll itself, but here it sometimes
 * skips the reset and the browser keeps the old offset (see
 * ScrollToTopOnMount, which patched this for property pages only). This runs
 * for every route change instead.
 *
 * Back and forward are left alone, so returning to a long list lands on the
 * card the visitor left. Only the pathname is watched: filter and sort changes
 * live in the query string and must not jump the page.
 */
const ScrollToTopOnNavigate = () => {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const isHistoryMove = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      isHistoryMove.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isHistoryMove.current) {
      isHistoryMove.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTopOnNavigate;
