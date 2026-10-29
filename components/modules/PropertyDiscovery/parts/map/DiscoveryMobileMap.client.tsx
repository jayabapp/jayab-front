"use client";

import { useEffect, useState } from "react";
import { useBodyScrollLock } from "@hooks/useBodyScrollLock";
import { useDiscoveryMap } from "@features/properties/context/DiscoveryMapContext";
import { useProperties } from "@features/properties/hooks/useProperties";

import type { DiscoveryMobileMapProps } from "@/types/components/modules/discovery-map";
import type { SheetSnap } from "@/types/components/modules/discovery-map";

import ResultsSheet from "./ResultsSheet.client";
import dynamic from "next/dynamic";

const DiscoveryMap = dynamic(() => import("./DiscoveryMap.client"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="size-full animate-pulse bg-surface-muted"
    />
  ),
});

const FILTER_BAR_SELECTOR = ".discovery-filter-bar";
const MOBILE_NAV_SELECTOR = "[data-mobile-nav]";

const DiscoveryMobileMap = ({
  query,
  header,
  children,
}: DiscoveryMobileMapProps) => {
  const { selectedId } = useDiscoveryMap();
  const { properties, isFetching, isPlaceholderData } = useProperties(query);
  const [snap, setSnap] = useState<SheetSnap>("half");
  const [covered, setCovered] = useState(0);
  const [frame, setFrame] = useState<{ top: number; bottom: number } | null>(
    null,
  );

  useBodyScrollLock(true);

  const [shownId, setShownId] = useState(selectedId);
  if (shownId !== selectedId) {
    setShownId(selectedId);
    if (selectedId !== null) setSnap("peek");
  }

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const bar = document.querySelector<HTMLElement>(FILTER_BAR_SELECTOR);
    const measure = () => {
      const nav = document.querySelector<HTMLElement>(MOBILE_NAV_SELECTOR);
      setFrame({
        top: bar ? Math.round(bar.getBoundingClientRect().bottom) : 0,
        bottom: nav?.offsetHeight ?? 0,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (bar) observer.observe(bar);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fixed inset-x-0 z-[5] overflow-hidden bg-surface-muted"
      style={{
        top: frame?.top ?? 0,
        bottom: frame?.bottom ?? 0,
        visibility: frame ? undefined : "hidden",
      }}
    >
      <DiscoveryMap
        query={query}
        variant="background"
        properties={properties}
        onClose={() => setSnap("full")}
        bottomInset={snap === "full" ? 0 : covered}
        isListSettled={!isPlaceholderData && !isFetching}
      />
      <ResultsSheet
        snap={snap}
        header={header}
        onSnapChange={setSnap}
        onVisibleHeightChange={setCovered}
      >
        {children}
      </ResultsSheet>
    </div>
  );
};

export default DiscoveryMobileMap;
