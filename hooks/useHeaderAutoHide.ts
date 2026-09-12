"use client";

import { useEffect } from "react";

/**
 * Above this point the header always shows. Expressed as a share of the viewport
 * rather than a fixed pixel count because the thing it is really tracking is
 * "has the reader left the opening screen yet", and that distance is a phone's
 * 844px in one place and a laptop's 900px in another. A flat threshold that felt
 * right on a phone pulled the header away on a desktop while the hero was still
 * halfway up the screen.
 */
const RELEASE_VIEWPORT_SHARE = 0.6;
const RELEASE_FLOOR = 220;

/**
 * On the home page the header floats, transparent, over the photo until the
 * scrolling sheet reaches its bottom edge; that meeting point replaces the flat
 * scroll thresholds. Returns null anywhere there is no sheet.
 */
export const sheetBelowHeader = (header: HTMLElement | null) => {
  const sheet = document.querySelector<HTMLElement>(".home-sheet");
  const bar = header?.firstElementChild;
  if (!sheet || !bar) return null;
  return sheet.getBoundingClientRect().top > bar.getBoundingClientRect().height;
};

/** Movement smaller than this is rubber-banding, a focus scroll, or a thumb resting. */
const MOVEMENT_THRESHOLD = 8;

/**
 * Hides the fixed header while the reader is moving down the page and brings it
 * straight back on the first upward movement.
 *
 * The point is the return trip. Once someone is deep in a long list, the header
 * is the only way to the user menu, and without this they have to scroll all the
 * way back to the top to reach it. Hiding on the way down buys the list a header's
 * worth of height; revealing on the way up means the cost of getting it back is
 * one flick.
 *
 * Deliberately writes a data attribute on the element rather than setting React
 * state. The header must respond at scroll frequency, and this store's params are
 * read with whole-state selectors in several components — one of them per property
 * card — so a state write here would re-render dozens of components per scroll
 * tick on exactly the devices this is supposed to stay smooth on. A data attribute
 * plus a CSS transform is a compositor-only change that React never hears about.
 *
 * The listener is passive and coalesced into one `requestAnimationFrame`, so
 * multiple scroll events in a frame collapse into a single DOM write.
 */
export const useHeaderAutoHide = (elementId: string, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const header = document.getElementById(elementId);
    if (!header) return;

    let previous = Math.max(window.scrollY, 0);
    let frame = 0;

    const setHidden = (hidden: boolean) => {
      const next = hidden ? "hidden" : "visible";
      // Reading first keeps this a no-op write on the vast majority of frames.
      if (header.dataset.autohide !== next) header.dataset.autohide = next;
    };

    const measure = () => {
      frame = 0;
      const current = Math.max(window.scrollY, 0);
      const movement = current - previous;

      // Leaving `previous` alone below the threshold lets slow, deliberate
      // scrolling accumulate into a decision instead of being discarded.
      if (Math.abs(movement) < MOVEMENT_THRESHOLD) return;
      previous = current;

      const releaseAbove = Math.max(
        RELEASE_FLOOR,
        window.innerHeight * RELEASE_VIEWPORT_SHARE,
      );
      if (sheetBelowHeader(header) ?? current <= releaseAbove)
        return setHidden(false);

      // A menu or search field open inside the header outranks the scroll: pulling
      // the panel's own anchor out from under the reader would be the bug, not the
      // feature.
      if (header.contains(document.activeElement)) return setHidden(false);

      setHidden(movement > 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      // Leaving the attribute behind would strand the header off-screen on a
      // route that does not run this hook.
      delete header.dataset.autohide;
    };
  }, [elementId, enabled]);
};
