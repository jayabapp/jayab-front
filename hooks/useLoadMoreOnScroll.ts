"use client";

import { useEffect, useState } from "react";

export const useLoadMoreOnScroll = ({
  enabled,
  onLoadMore,
  rootMargin = "600px 0px",
}: {
  enabled: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}) => {
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || !node || typeof IntersectionObserver === "undefined")
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, node, onLoadMore, rootMargin]);

  return setNode;
};
