"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// If a navigation never resolves — blocked by a guard, cancelled, or aborted by
// a second click — the bar would otherwise sit at 90% forever.
const SAFETY_TIMEOUT_MS = 15000;

// Long enough for the `.nav-progress-done` fade to finish before the element is
// reset to zero width, so the bar never visibly snaps backwards.
const RESET_DELAY_MS = 500;

const isModifiedClick = (event: MouseEvent) =>
  event.button !== 0 ||
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey;

/**
 * Top-of-viewport indicator for App Router navigations.
 *
 * There is no router-events API in the App Router, so the start of a navigation
 * is detected from the click that causes it and the end from `usePathname`
 * changing. Everything is written straight to the DOM node: with React state
 * this component would re-render the app shell twice per navigation, which is
 * the opposite of what it exists to fix.
 */
const NavigationProgress = () => {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };

    const finish = () => {
      const bar = barRef.current;
      clearTimer();
      if (!bar?.classList.contains("nav-progress-active")) return;

      bar.classList.remove("nav-progress-active");
      bar.classList.add("nav-progress-done");
      timerRef.current = setTimeout(() => {
        bar.classList.remove("nav-progress-done");
      }, RESET_DELAY_MS);
    };

    const onClick = (event: MouseEvent) => {
      const bar = barRef.current;
      if (!bar || event.defaultPrevented || isModifiedClick(event)) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.hasAttribute("download")) return;

      const target = anchor.getAttribute("target");
      if (!!target && target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let destination: URL;
      try {
        destination = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // A cross-origin link leaves the SPA entirely, and a link to the path we
      // are already on never changes `pathname`, so neither would ever reach
      // `finish()` — both would strand the bar until the safety timeout.
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname) return;

      bar.classList.remove("nav-progress-done");
      bar.classList.add("nav-progress-active");
      clearTimer();
      timerRef.current = setTimeout(finish, SAFETY_TIMEOUT_MS);
    };

    // Capture phase: a card's own onClick handler may stop propagation before a
    // bubbling listener would ever see the event.
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimer();
    };
  }, []);

  // Runs on mount too, where `finish()` is a no-op because the bar is inactive.
  // That also covers back/forward: the path changes with no preceding click.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar?.classList.contains("nav-progress-active")) return;

    bar.classList.remove("nav-progress-active");
    bar.classList.add("nav-progress-done");
    const timer = setTimeout(
      () => bar.classList.remove("nav-progress-done"),
      RESET_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [pathname]);

  return <div ref={barRef} aria-hidden="true" className="nav-progress" />;
};

export default NavigationProgress;
