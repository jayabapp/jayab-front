"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

/**
 * Keyboard cursor for a combobox listbox.
 *
 * The search panel had no keyboard path at all: suggestions were plain buttons
 * in three separate blocks, so the only way to reach one was the mouse, and
 * tabbing walked into every row of every block instead of moving a cursor. This
 * keeps focus in the input — as the combobox pattern requires — and moves a
 * highlighted index instead, which is also what lets `aria-activedescendant`
 * announce the current option.
 *
 * `activeIndex` is -1 when nothing is highlighted, which is the state Enter must
 * treat as "run the free-text search" rather than "open the first suggestion".
 */
export const useListboxNavigation = (count: number, resetKey: string) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  // A new term means a new result set; leaving the cursor where it was would
  // point it at an unrelated row — or past the end of a shorter list.
  //
  // Adjusted during render rather than in an effect: React discards this render
  // and re-runs the component before committing, so the cursor is never painted
  // pointing at the wrong row, and there is no cascading-render lint violation.
  const listKey = `${resetKey}|${count}`;
  const [seenKey, setSeenKey] = useState(listKey);
  if (seenKey !== listKey) {
    setSeenKey(listKey);
    setActiveIndex(-1);
  }

  // Scrolling is done here rather than in the row so the row stays a pure
  // render of its props.
  useEffect(() => {
    if (activeIndex < 0) return;
    listRef.current
      ?.querySelector(`[data-option-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent, onPick: (index: number) => void) => {
      if (count === 0) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % count);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => (index <= 0 ? count - 1 : index - 1));
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        setActiveIndex(0);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        setActiveIndex(count - 1);
        return;
      }
      // Enter with no highlighted row falls through to the form's own submit,
      // which is the free-text search.
      if (event.key === "Enter" && activeIndex >= 0) {
        event.preventDefault();
        onPick(activeIndex);
      }
    },
    [activeIndex, count],
  );

  return { activeIndex, listRef, onKeyDown, setActiveIndex };
};
