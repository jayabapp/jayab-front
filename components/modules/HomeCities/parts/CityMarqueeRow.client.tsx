"use client";

import type { CityMarqueeRowProps } from "@/types/components/modules/home";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

// Roughly one card every 3.5s, so the drift reads as calm at any row length
// instead of speeding up when the CMS returns more cities.
const SECONDS_PER_CARD = 3.5;

const CityMarqueeRow = ({ children, count, reverse }: CityMarqueeRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  // The observer toggles a class straight on the node rather than going through
  // state: pausing an off-screen row must not cost a React render.
  useEffect(() => {
    const row = rowRef.current;
    if (!row || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) =>
      row.classList.toggle("marquee-paused", !entries[0]?.isIntersecting),
    );
    observer.observe(row);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className="marquee w-full"
      style={
        { "--marquee-duration": `${count * SECONDS_PER_CARD}s` } as CSSProperties
      }
    >
      <div
        className={`marquee-track ${reverse ? "marquee-track-reverse" : ""}`}
      >
        <div className="flex shrink-0">{children}</div>
        {/* `inert` keeps the duplicate out of the tab order and the a11y tree —
            it exists only so the loop has something to wrap around to. */}
        <div inert aria-hidden="true" className="marquee-clone flex shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CityMarqueeRow;
