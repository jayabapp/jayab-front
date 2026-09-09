"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Makes the hardware/browser back gesture close a full-screen overlay instead of
 * leaving the page, and hands back the dismiss function the overlay's own close
 * controls should call.
 *
 * A sheet that owns the whole viewport reads as a screen, and on Android back is
 * how you leave a screen. Without this, backing out of the hero's search sheet
 * navigates away from the home page entirely — the one thing the user was not
 * asking for. The pushed entry carries the current URL, so the App Router sees
 * the resulting `popstate` as a no-op rather than as a navigation.
 *
 * Cleanup deliberately touches nothing but the listener. An earlier version
 * popped the pushed entry from cleanup, which StrictMode's mount → cleanup →
 * mount cycle turned into a `history.back()` whose `popstate` landed on the
 * *second* mount's listener: the sheet closed itself the instant it opened, in
 * development only. Closing therefore runs one way — through `requestClose`,
 * which both dismisses the overlay and pops the entry it pushed — and a close
 * that comes from navigating away leaves the entry alone, because popping it
 * would undo the navigation the user just asked for.
 */
export const useOverlayBackButton = (isOpen: boolean, onClose: () => void) => {
  // The effect must not re-run when the caller re-creates its close handler:
  // re-running would push a second history entry for the same overlay. The
  // handler is read through a ref that is kept current in its own effect, so
  // only `isOpen` drives the subscription.
  const onCloseRef = useRef(onClose);
  const hasPushedRef = useRef(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ overlay: true }, "");
    hasPushedRef.current = true;

    const onPopState = () => {
      hasPushedRef.current = false;
      onCloseRef.current();
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isOpen]);

  return useCallback(() => {
    onClose();
    if (!hasPushedRef.current) return;
    hasPushedRef.current = false;
    window.history.back();
  }, [onClose]);
};
