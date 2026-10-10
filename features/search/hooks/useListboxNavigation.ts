"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { KeyboardEvent } from "react";

export const useListboxNavigation = (count: number, resetKey: string) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const listKey = `${resetKey}|${count}`;
  const [seenKey, setSeenKey] = useState(listKey);
  if (seenKey !== listKey) {
    setSeenKey(listKey);
    setActiveIndex(-1);
  }

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
      if (event.key === "Enter" && activeIndex >= 0) {
        event.preventDefault();
        onPick(activeIndex);
      }
    },
    [activeIndex, count],
  );

  return { activeIndex, listRef, onKeyDown, setActiveIndex };
};
