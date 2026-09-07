"use client";

import type { CityMarqueeDragState } from "@/types/components/modules/home";
import type { CityMarqueeRowProps } from "@/types/components/modules/home";
import type { CSSProperties, MouseEvent, PointerEvent } from "react";
import { useEffect, useRef } from "react";

// Roughly one card every 3.5s, so the drift reads as calm at any row length
// instead of speeding up when the CMS returns more cities.
const SECONDS_PER_CARD = 3.5;
const DRAG_THRESHOLD_PX = 5;

const wrapTime = (time: number, duration: number) =>
  ((time % duration) + duration) % duration;

const CityMarqueeRow = ({ children, count, reverse }: CityMarqueeRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<CityMarqueeDragState | null>(null);
  const suppressClickRef = useRef(false);

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

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    const row = rowRef.current;
    const track = trackRef.current;
    const content = track?.firstElementChild;
    const animation = track?.getAnimations()[0];
    const contentWidth = content?.getBoundingClientRect().width ?? 0;
    const durationMs = Math.max(count, 1) * SECONDS_PER_CARD * 1000;

    if (!row || !animation || !contentWidth) return;

    row.classList.add("marquee-dragging");
    row.setPointerCapture(event.pointerId);
    suppressClickRef.current = false;
    dragRef.current = {
      animation,
      contentWidth,
      durationMs,
      moved: false,
      pointerId: event.pointerId,
      startTime: Number(animation.currentTime) || 0,
      startX: event.clientX,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) >= DRAG_THRESHOLD_PX) drag.moved = true;

    const direction = reverse ? -1 : 1;
    const timeDelta =
      (distance / drag.contentWidth) * drag.durationMs * direction;
    drag.animation.currentTime = wrapTime(
      drag.startTime + timeDelta,
      drag.durationMs,
    );
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const row = rowRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !row) return;

    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    row.classList.remove("marquee-dragging");
    if (row.hasPointerCapture(event.pointerId))
      row.releasePointerCapture(event.pointerId);
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  return (
    <div
      ref={rowRef}
      className="marquee w-full"
      onClickCapture={onClickCapture}
      onDragStart={(event) => event.preventDefault()}
      onPointerCancel={finishDrag}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      style={
        {
          "--marquee-duration": `${Math.max(count, 1) * SECONDS_PER_CARD}s`,
        } as CSSProperties
      }
    >
      <div
        ref={trackRef}
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
