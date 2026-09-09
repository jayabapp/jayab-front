"use client";

import { useEffect } from "react";

let lockCount = 0;
let overflowBeforeFirstLock = "";

/**
 * Freezes page scrolling while an overlay is open and always restores the previous
 * value, so an overlay that unmounts while open cannot leave the page stuck.
 *
 * Reference-counted rather than save-and-restore per caller. Locks nest — the
 * hero's search sheet locks the page, and the destination step inside it locks
 * again through `useSearchPanel` — and each caller remembering "what overflow was
 * when I mounted" is only correct if the locks unwind in the exact reverse order
 * they were taken. They do not: React's StrictMode remount runs every cleanup
 * before re-running every setup, which left the outer lock recording `hidden` as
 * the value to restore. The page then stayed unscrollable after navigating away
 * from the sheet.
 *
 * With a counter there is one saved value — the one from before the first lock —
 * and it is only put back when the last lock lets go, whatever order that
 * happens in.
 */
export const useBodyScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;

    if (lockCount === 0) overflowBeforeFirstLock = document.body.style.overflow;
    lockCount += 1;
    document.body.style.overflow = "hidden";

    return () => {
      lockCount -= 1;
      if (lockCount > 0) return;
      document.body.style.overflow = overflowBeforeFirstLock;
    };
  }, [locked]);
};
