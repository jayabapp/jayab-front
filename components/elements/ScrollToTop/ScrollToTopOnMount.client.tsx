"use client";

import { useEffect } from "react";

/**
 * Puts a freshly opened page at its top.
 *
 * The App Router usually does this itself, but on this app it is a race it can
 * lose. Traced on a phone viewport: from the home page at y=2993, clicking a
 * property card landed on the detail page at y=1309 — and the instrumented
 * `window.scrollTo` / `Element.scrollIntoView` were never called at all, so the
 * framework had simply skipped its reset and the browser kept the old offset,
 * clamped to the height of whatever had streamed in so far (1309 + 844 viewport
 * = 2153, exactly the document height at that moment). The same navigation
 * lands at 0 on other runs, which is what makes it a race rather than a
 * constant, and why it shows up as "sometimes the page opens in the middle".
 *
 * `instant` rather than the default: a smooth scroll here would animate the
 * whole way down the page in front of the reader, which looks like a bug even
 * when it ends in the right place.
 *
 * Scoped deliberately to detail routes. Applying it globally would fight the
 * Router Cache on back navigation, where returning to a long result list at the
 * card you left is the correct behaviour.
 */
const ScrollToTopOnMount = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return null;
};

export default ScrollToTopOnMount;
