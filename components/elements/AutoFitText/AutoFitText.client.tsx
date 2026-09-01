"use client";

import type { AutoFitTextProps } from "@/types/components/elements/auto-fit-text";

import { useCallback, useEffect, useRef, useState } from "react";

const AutoFitText: React.FC<AutoFitTextProps> = ({
  text,
  style,
  className,
  minFontSize = 8,
  maxFontSize = 64,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [isVisible, setIsVisible] = useState(false);

  const resizeText = useCallback(() => {
    const container = containerRef.current;
    const measureEl = measureRef.current;

    if (!container || !measureEl)
      return { fontSize: maxFontSize, visible: false };

    const containerWidth = container.offsetWidth;

    let low = minFontSize;
    let high = maxFontSize;
    let bestFit = minFontSize;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      measureEl.style.fontSize = `${mid}px`;

      if (measureEl.scrollWidth <= containerWidth) {
        bestFit = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    if (bestFit < minFontSize) bestFit = minFontSize;
    return { fontSize: bestFit, visible: true };
  }, [minFontSize, maxFontSize]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(() => {
      setIsVisible(false);
      const { fontSize: calculatedFontSize, visible: canBeVisible } =
        resizeText();
      setFontSize(calculatedFontSize);
      if (canBeVisible) setIsVisible(true);
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, [text, resizeText]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      setIsVisible(false);
      const { fontSize: calculatedFontSize, visible: canBeVisible } =
        resizeText();
      setFontSize(calculatedFontSize);
      const animationFrameId = requestAnimationFrame(() => {
        if (canBeVisible) setIsVisible(true);
      });
      return () => cancelAnimationFrame(animationFrameId);
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [resizeText]);
  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
        ...style,
      }}
    >
      <span
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          fontSize: `${fontSize}px`,
          lineHeight: 1.2,
        }}
      >
        {text}
      </span>

      <span
        style={{
          opacity: isVisible ? 1 : 0,
          fontSize: `${fontSize}px`,
          display: "inline-block",
          whiteSpace: "nowrap",
          lineHeight: 1.2,
          transition: "opacity 150ms ease-in-out",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default AutoFitText;
