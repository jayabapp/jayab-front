"use client";

import { useEffect } from "react";

/**
 * Freezes page scrolling while an overlay is open and always restores the previous
 * value, so an overlay that unmounts while open cannot leave the page stuck.
 */
export const useBodyScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [locked]);
};
