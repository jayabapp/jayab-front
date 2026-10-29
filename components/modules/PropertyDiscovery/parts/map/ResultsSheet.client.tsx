"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { ResultsSheetProps } from "@/types/components/modules/discovery-map";
import type { SheetGesture } from "@/types/components/modules/discovery-map";
import type { SheetSnap } from "@/types/components/modules/discovery-map";

const AXIS_LOCK_PX = 6;
const FLICK_PROJECTION_MS = 180;
const SNAPS: readonly SheetSnap[] = ["full", "half", "peek"];
const PEEK_CLEARANCE_PX = 28;

const ResultsSheet = ({
  snap,
  header,
  children,
  onSnapChange,
  onVisibleHeightChange,
}: ResultsSheetProps) => {
  const t = useTranslations("listing");
  const rootRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const [size, setSize] = useState({ stage: 0, head: 0 });

  const offsets: Record<SheetSnap, number> = {
    full: 0,
    half: Math.round(size.stage / 2),
    peek: Math.max(0, size.stage - size.head - PEEK_CLEARANCE_PX),
  };
  const offset = offsets[snap];
  const isMeasured = size.stage > 0;

  useEffect(() => {
    const root = rootRef.current;
    const stage = root?.parentElement;
    const head = headRef.current;
    if (!stage || !head) return;
    const measure = () =>
      setSize({ stage: stage.clientHeight, head: head.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(head);
    return () => observer.disconnect();
  }, []);

  const reportVisible = useEffectEvent((height: number) =>
    onVisibleHeightChange?.(height),
  );
  useEffect(() => {
    if (isMeasured) reportVisible(size.stage - offset);
  }, [isMeasured, offset, size.stage]);

  // Leaving the full list starts it from the top next time.
  useEffect(() => {
    if (snap !== "full") bodyRef.current?.scrollTo({ top: 0 });
  }, [snap]);

  const settle = useEffectEvent((gesture: SheetGesture, current: number) => {
    const projected = current + gesture.velocity * FLICK_PROJECTION_MS;
    const next = SNAPS.reduce((best, candidate) =>
      Math.abs(offsets[candidate] - projected) <
      Math.abs(offsets[best] - projected)
        ? candidate
        : best,
    );
    const root = rootRef.current;
    if (root) {
      delete root.dataset.dragging;
      root.style.transform = `translateY(${offsets[next]}px)`;
    }
    if (next !== snap) onSnapChange(next);
  });

  const currentSnap = useEffectEvent(() => snap);
  const offsetOf = useEffectEvent((which: SheetSnap) => offsets[which]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let gesture: SheetGesture | null = null;
    let position = 0;

    const begin = (
      x: number,
      y: number,
      time: number,
      target: EventTarget | null,
    ) => {
      gesture = {
        x,
        y,
        lastY: y,
        lastT: time,
        velocity: 0,
        axis: null,
        dragging: false,
        start: offsetOf(currentSnap()),
        fromHandle: !!headRef.current?.contains(target as Node),
      };
      position = gesture.start;
    };

    // Returns true once the sheet itself is following the pointer.
    const follow = (x: number, y: number, time: number) => {
      if (!gesture) return false;
      const dy = y - gesture.y;
      if (!gesture.axis) {
        const dx = x - gesture.x;
        if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX)
          return false;
        gesture.axis = Math.abs(dy) > Math.abs(dx) ? "y" : "x";
        if (gesture.axis === "x") return false;
        const listAtTop = (bodyRef.current?.scrollTop ?? 0) <= 0;
        gesture.dragging =
          currentSnap() !== "full" ||
          gesture.fromHandle ||
          (listAtTop && dy > 0);
        if (gesture.dragging) root.dataset.dragging = "true";
      }
      if (!gesture.dragging) return false;
      const elapsed = time - gesture.lastT;
      if (elapsed > 0) gesture.velocity = (y - gesture.lastY) / elapsed;
      gesture.lastY = y;
      gesture.lastT = time;
      position = Math.min(offsetOf("peek"), Math.max(0, gesture.start + dy));
      root.style.transform = `translateY(${position}px)`;
      return true;
    };

    const end = () => {
      const finished = gesture;
      gesture = null;
      if (!finished?.dragging) return;
      suppressClickRef.current = true;
      settle(finished, position);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      begin(touch.clientX, touch.clientY, event.timeStamp, event.target);
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch && follow(touch.clientX, touch.clientY, event.timeStamp))
        event.preventDefault();
    };

    const head = headRef.current;
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      head?.setPointerCapture(event.pointerId);
      begin(event.clientX, event.clientY, event.timeStamp, event.target);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "touch")
        follow(event.clientX, event.clientY, event.timeStamp);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "touch") end();
    };

    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", end);
    root.addEventListener("touchcancel", end);
    head?.addEventListener("pointerdown", onPointerDown);
    head?.addEventListener("pointermove", onPointerMove);
    head?.addEventListener("pointerup", onPointerUp);
    head?.addEventListener("pointercancel", onPointerUp);
    return () => {
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", end);
      root.removeEventListener("touchcancel", end);
      head?.removeEventListener("pointerdown", onPointerDown);
      head?.removeEventListener("pointermove", onPointerMove);
      head?.removeEventListener("pointerup", onPointerUp);
      head?.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  const onHandleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    onSnapChange(snap === "half" ? "full" : "half");
  };

  const isFull = snap === "full";

  return (
    <>
      <section
        ref={rootRef}
        aria-label={t("mapSheetLabel")}
        data-snap={snap}
        className="results-sheet"
        style={{
          transform: isMeasured ? `translateY(${offset}px)` : "translateY(50%)",
        }}
      >
        <div ref={headRef} className="results-sheet-head">
          <button
            type="button"
            aria-expanded={isFull}
            onClick={onHandleClick}
            aria-label={isFull ? t("mapShow") : t("mapExpandList")}
            className="flex h-6 w-full cursor-grab items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
          >
            <span
              aria-hidden="true"
              className="h-1 w-10 rounded-full bg-line-strong"
            />
          </button>
          {header}
        </div>
        <div
          ref={bodyRef}
          className={`min-h-0 flex-1 overscroll-contain ${
            isFull ? "overflow-y-auto" : "overflow-hidden"
          }`}
        >
          {children}
        </div>
      </section>

      {isFull ? (
        <button
          type="button"
          onClick={() => onSnapChange("half")}
          className="absolute inset-x-0 bottom-10 z-30 mx-auto flex h-11 w-fit cursor-pointer items-center gap-2 rounded-full bg-action px-5 text-sm font-bold text-on-action shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
        >
          <Icon name="map" size={20} />
          {t("mapShow")}
        </button>
      ) : null}
    </>
  );
};

export default ResultsSheet;
