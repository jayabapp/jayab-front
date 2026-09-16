"use client";

import { useEffect, useRef } from "react";

const DRAG_THRESHOLD_PX = 4;
const VELOCITY_WINDOW_MS = 100;
const RELEASE_IDLE_MS = 60;
const FRAME_MS = 16;
const FRICTION_PER_FRAME = 0.95;
const MIN_VELOCITY_PX_PER_MS = 0.02;
const MAX_VELOCITY_PX_PER_MS = 4;
const MAX_FRAME_GAP_MS = 50;

// Presses that stopped a gliding row. Both city rows glide together, so a press on either
// one must know whether any row was gliding; the event object is what they share.
const glideCatchingPresses = new WeakSet<Event>();

/**
 * Mouse drag-to-scroll for a horizontal row, gliding to a stop after release.
 *
 * Only a mouse drags: touch keeps the browser's own scrolling and momentum, and the
 * wheel is left alone so it keeps scrolling the page instead of the row.
 */
export const useHorizontalDragScroll = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pointerId: number | null = null;
    let isDragging = false;
    let suppressClick = false;
    let startX = 0;
    let startScroll = 0;
    let samples: { x: number; t: number }[] = [];
    let momentumFrame = 0;

    const stopMomentum = () => {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = 0;
    };

    // Runs in the capture phase, before any row's own pointerdown handler.
    const catchGlide = (event: PointerEvent) => {
      if (momentumFrame !== 0) glideCatchingPresses.add(event);
      stopMomentum();
    };

    const startMomentum = (velocity: number) => {
      if (reducedMotion.matches || Math.abs(velocity) < MIN_VELOCITY_PX_PER_MS)
        return;

      let speed = Math.max(
        -MAX_VELOCITY_PX_PER_MS,
        Math.min(MAX_VELOCITY_PX_PER_MS, velocity),
      );
      // Scroll positions are rounded by the browser; tracking the exact position keeps
      // the slow tail of the glide from stalling on sub-pixel steps.
      let position = el.scrollLeft;
      let lastTime = performance.now();

      const step = (now: number) => {
        const elapsed = Math.min(now - lastTime, MAX_FRAME_GAP_MS);
        lastTime = now;
        position -= speed * elapsed;
        el.scrollLeft = position;

        // At either end the browser clamps the position: stop rather than push the edge.
        if (Math.abs(el.scrollLeft - position) > 1) return stopMomentum();

        speed *= Math.pow(FRICTION_PER_FRAME, elapsed / FRAME_MS);
        if (Math.abs(speed) < MIN_VELOCITY_PX_PER_MS) return stopMomentum();
        momentumFrame = requestAnimationFrame(step);
      };

      momentumFrame = requestAnimationFrame(step);
    };

    const onPointerDown = (event: PointerEvent) => {
      // A press that stops a gliding row only stops it, as on a touch list; it must not
      // also open the city that happened to glide under the cursor.
      suppressClick = glideCatchingPresses.has(event);
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      if (el.scrollWidth <= el.clientWidth) return;
      pointerId = event.pointerId;
      isDragging = false;
      startX = event.clientX;
      startScroll = el.scrollLeft;
      samples = [{ x: event.clientX, t: event.timeStamp }];
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      // The button was released outside the page, so no pointerup ever reached us.
      if ((event.buttons & 1) === 0) {
        pointerId = null;
        return;
      }

      if (!isDragging) {
        if (Math.abs(event.clientX - startX) < DRAG_THRESHOLD_PX) return;
        isDragging = true;
        suppressClick = true;
        // Re-anchor at the threshold so the row does not jump by the slop distance.
        startX = event.clientX;
        startScroll = el.scrollLeft;
        el.setPointerCapture(event.pointerId);
        el.dataset.dragging = "true";
      }

      event.preventDefault();
      el.scrollLeft = startScroll - (event.clientX - startX);
      samples.push({ x: event.clientX, t: event.timeStamp });
      while (
        samples.length > 2 &&
        event.timeStamp - samples[0].t > VELOCITY_WINDOW_MS
      )
        samples.shift();
    };

    const endDrag = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      if (!isDragging) return;

      isDragging = false;
      delete el.dataset.dragging;
      if (el.hasPointerCapture(event.pointerId))
        el.releasePointerCapture(event.pointerId);

      const first = samples[0];
      const last = samples[samples.length - 1];
      // A drag that came to rest before the button was released should not fling.
      const isStillMoving = event.timeStamp - last.t < RELEASE_IDLE_MS;
      if (event.type === "pointerup" && isStillMoving && last.t > first.t)
        startMomentum((last.x - first.x) / (last.t - first.t));
    };

    // A click at the end of a drag is the release, not a tap on the city under it.
    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    };

    // Images and links would otherwise start the browser's own drag-and-drop.
    const onDragStart = (event: DragEvent) => {
      if (pointerId !== null) event.preventDefault();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("dragstart", onDragStart);
    // Any press anywhere catches a gliding row, the way a flicked list stops under a finger.
    window.addEventListener("pointerdown", catchGlide, true);

    return () => {
      stopMomentum();
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("pointerdown", catchGlide, true);
    };
  }, []);

  return ref;
};
