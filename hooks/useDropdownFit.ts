"use client";

import { useEffect, type RefObject } from "react";

const GAP_PX = 16;
const MIN_PX = 200;

// The hero is pinned, so a dropdown that reaches past the viewport bottom can
// never be scrolled into view. Publish the room left under the trigger as
// `--hero-dropdown-h`; `.hero-dropdown` caps the panel to it and scrolls inside.
export const useDropdownFit = (
  isOpen: boolean,
  ref: RefObject<HTMLElement | null>,
) => {
  useEffect(() => {
    const anchor = ref.current;
    if (!isOpen || !anchor) return;
    let frame = 0;
    const fit = () => {
      frame = 0;
      const room = window.innerHeight - anchor.getBoundingClientRect().bottom;
      anchor.style.setProperty(
        "--hero-dropdown-h",
        `${Math.max(room - GAP_PX, MIN_PX)}px`,
      );
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(fit);
    };
    fit();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isOpen, ref]);
};
