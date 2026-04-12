// AutoFitText.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";

interface AutoFitTextProps {
  text: string;
  maxFontSize?: number;
  minFontSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

const AutoFitText: React.FC<AutoFitTextProps> = ({ text, maxFontSize = 64, minFontSize = 8, className, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);
  // Use a state to control visibility, updated after measurement
  const [isVisible, setIsVisible] = useState(false);

  const resizeText = useCallback(() => {
    const container = containerRef.current;
    const measureEl = measureRef.current;

    if (!container || !measureEl) return { fontSize: maxFontSize, visible: false };

    const containerWidth = container.offsetWidth;

    let low = minFontSize;
    let high = maxFontSize;
    let bestFit = minFontSize;

    // Binary search on the hidden element
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

    // Ensure we don't go below minFontSize
    if (bestFit < minFontSize) {
      bestFit = minFontSize;
    }

    return { fontSize: bestFit, visible: true };
  }, [minFontSize, maxFontSize]);

  // Effect to handle resizing and updating state
  useEffect(() => {
    // Hide the text immediately when text or size changes
    setIsVisible(false);

    const { fontSize: calculatedFontSize, visible: canBeVisible } = resizeText();
    setFontSize(calculatedFontSize);

    // Use requestAnimationFrame to ensure the DOM is ready for the visibility change
    const animationFrameId = requestAnimationFrame(() => {
      if (canBeVisible) {
        setIsVisible(true);
      }
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, [text, resizeText]); // Dependency on resizeText ensures it runs when values change

  // ResizeObserver setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      // Hide while resizing due to container change
      setIsVisible(false);
      const { fontSize: calculatedFontSize, visible: canBeVisible } = resizeText();
      setFontSize(calculatedFontSize);

      // Schedule visibility update
      const animationFrameId = requestAnimationFrame(() => {
        if (canBeVisible) {
          setIsVisible(true);
        }
      });
      // Cleanup for this specific observer callback
      return () => cancelAnimationFrame(animationFrameId);
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [resizeText]); // Depend on resizeText

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative", // Needed for absolute positioning of hidden span
        ...style,
      }}
    >
      {/* Hidden span for measurement */}
      <span
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden", // Keep it hidden
          whiteSpace: "nowrap",
          fontSize: `${fontSize}px`, // Use the current state fontSize for measurement
          lineHeight: 1.2, // Keep consistent with visible text
        }}
      >
        {text}
      </span>

      {/* Visible text span */}
      <span
        style={{
          opacity: isVisible ? 1 : 0,
          fontSize: `${fontSize}px`, // Apply the final calculated font size
          display: "inline-block",
          whiteSpace: "nowrap",
          lineHeight: 1.2,
          transition: "opacity 150ms ease-in-out", // Smooth fade-in
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default AutoFitText;
