"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@features/map/lib/map-support";
import { useDiscoveryMap } from "@features/properties/context/DiscoveryMapContext";
import { useTranslations } from "next-intl";
import { useProperties } from "@features/properties/hooks/useProperties";
import { Icon } from "@elements/Icon";

import type { CSSProperties } from "react";
import type { DiscoveryMobileMapProps } from "@/types/components/modules/discovery-map";

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

const MAP_PEEK_PX = 120;
// The bottom tab bar covers the foot of the screen on load, so the tags have to sit above it.
const MOBILE_NAV_PX = 96;

const scrollPageBy = (distance: number) =>
  window.scrollTo({
    top: Math.max(0, window.scrollY + distance),
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });

const showMap = () => scrollPageBy(-window.scrollY);

const stickTop = (stage: HTMLElement) =>
  parseFloat(getComputedStyle(stage).top) || 0;

const listCoversMap = (stage: HTMLElement, sheet: HTMLElement) =>
  sheet.getBoundingClientRect().top < stickTop(stage) + MAP_PEEK_PX;

const DiscoveryMobileMap = ({
  query,
  header,
  children,
}: DiscoveryMobileMapProps) => {
  const t = useTranslations("listing");
  const { selectedId } = useDiscoveryMap();
  const { properties, isFetching, isPlaceholderData } = useProperties(query);
  const stageRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const [peek, setPeek] = useState(0);
  const [isListUp, setIsListUp] = useState(false);
  const lift = peek ? peek + MOBILE_NAV_PX : 0;

  useEffect(() => {
    const stage = stageRef.current;
    const sheet = sheetRef.current;
    if (!stage || !sheet) return;
    const head = sheet.querySelector<HTMLElement>(".results-sheet-head");
    const quickRow = sheet.querySelector<HTMLElement>(".discovery-quick-row");
    let frame = 0;
    let hasOpened = false;
    // On arrival the sheet is raised once so the first card shows; scrolling back to the top
    // drops it to the tags-only state. A restored scroll position is left alone.
    const openToFirstCard = () => {
      const card = sheet.querySelector<HTMLElement>("[data-property-id]");
      if (hasOpened || !card) return;
      hasOpened = true;
      if (window.scrollY > 0) return;
      const hidden =
        card.getBoundingClientRect().bottom -
        (window.innerHeight - MOBILE_NAV_PX);
      if (hidden > 0)
        window.scrollTo({ top: Math.ceil(hidden), behavior: "instant" });
    };
    const update = () => {
      frame = 0;
      openToFirstCard();
      setPeek((head?.offsetHeight ?? 0) + (quickRow?.offsetHeight ?? 0));
      setIsListUp(listCoversMap(stage, sheet));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    const observer = new ResizeObserver(schedule);
    for (const element of [stage, sheet, head, quickRow])
      if (element) observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const showList = () => {
    const stage = stageRef.current;
    const sheet = sheetRef.current;
    if (stage && sheet)
      scrollPageBy(sheet.getBoundingClientRect().top - stickTop(stage));
  };

  const toggle = () => {
    const stage = stageRef.current;
    const sheet = sheetRef.current;
    if (stage && sheet && listCoversMap(stage, sheet)) showMap();
    else showList();
  };

  useEffect(() => {
    if (selectedId !== null) showMap();
  }, [selectedId]);

  return (
    <div
      className="discovery-mobile-map"
      style={
        lift ? ({ "--sheet-peek": `${lift}px` } as CSSProperties) : undefined
      }
    >
      <div ref={stageRef} className="discovery-mobile-stage">
        <DiscoveryMap
          query={query}
          onClose={showList}
          variant="background"
          properties={properties}
          bottomInset={lift}
          isListSettled={!isPlaceholderData && !isFetching}
        />
      </div>

      <section
        ref={sheetRef}
        className="results-sheet"
        aria-label={t("mapSheetLabel")}
      >
        <div className="results-sheet-head">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isListUp}
            aria-label={isListUp ? t("mapShow") : t("mapExpandList")}
            className="flex h-6 w-full cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
          >
            <span
              aria-hidden="true"
              className="h-1 w-10 rounded-full bg-line-strong"
            />
          </button>
          <div className="flex items-center">
            <div className="min-w-0 flex-1">{header}</div>
            {isListUp ? (
              <button
                type="button"
                onClick={showMap}
                className="results-sheet-map-button"
              >
                <Icon name="map" size={16} />
                {t("mapShow")}
              </button>
            ) : null}
          </div>
        </div>
        {children}
      </section>
    </div>
  );
};

export default DiscoveryMobileMap;
