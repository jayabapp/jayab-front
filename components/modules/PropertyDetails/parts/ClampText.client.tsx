"use client";

import type { ClampTextProps } from "@/types/components/modules/property-details";
import { useLayoutEffect, useRef, useState } from "react";

import _STRINGS from "@/utils/LocalStrings";

const LINE_CLAMP: Record<number, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

const ClampText = ({ children, className = "", lines = 4 }: ClampTextProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const node = textRef.current;
    if (!node) return;
    const measure = () =>
      setIsClamped(node.scrollHeight - node.clientHeight > 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div className="flex flex-col items-start gap-2">
      <p
        ref={textRef}
        className={`whitespace-pre-wrap text-sm leading-7 text-neutral-800 md:leading-8 ${
          expanded ? "" : (LINE_CLAMP[lines] ?? "line-clamp-4")
        } ${className}`}
      >
        {children}
      </p>
      {isClamped || expanded ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="cursor-pointer text-sm font-semibold text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {expanded ? _STRINGS.SHOW_LESS : _STRINGS.SHOW_MORE}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ClampText;
