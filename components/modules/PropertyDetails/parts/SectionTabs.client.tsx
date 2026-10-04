"use client";

import { useEffect, useRef, useState } from "react";
import { trackListingEvent } from "@/helpers/listingAnalytics";

import type { SectionTabsProps } from "@/types/components/modules/property-details";

import _STRINGS from "@/utils/LocalStrings";

const SectionTabs = ({ tabs }: SectionTabsProps) => {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const navRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const sections = tabs
      .map((tab) => document.getElementById(tab.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;
    let frameId: number | null = null;
    const syncActiveTab = () => {
      frameId = null;
      const navBottom = navRef.current?.getBoundingClientRect().bottom ?? 0;
      const triggerLine = navBottom + 24;
      const activeSection =
        [...sections]
          .reverse()
          .find(
            (section) => section.getBoundingClientRect().top <= triggerLine,
          ) ?? sections[0];
      setActiveId((currentId) =>
        currentId === activeSection.id ? currentId : activeSection.id,
      );
    };
    const requestSync = () => {
      if (frameId === null)
        frameId = window.requestAnimationFrame(syncActiveTab);
    };

    requestSync();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    return () => {
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [tabs]);

  useEffect(() => {
    tabRefs.current[activeId]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [activeId]);

  const onTabClick = (id: string) => {
    trackListingEvent("listing_tab_click", { tab: id });
    const section = document.getElementById(id);
    if (!section) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    section.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <nav
      ref={navRef}
      aria-label={_STRINGS.SECTIONS_NAV}
      className="sticky top-16 z-20 order-2 -mx-3 mb-2 border-b border-neutral-100 bg-white/95 px-3 backdrop-blur md:top-20 md:order-3 md:mx-0 md:px-0"
    >
      <ul className="flex list-none gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              type="button"
              ref={(element) => {
                tabRefs.current[tab.id] = element;
              }}
              onClick={() => onTabClick(tab.id)}
              aria-current={activeId === tab.id ? "true" : undefined}
              className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                activeId === tab.id
                  ? "bg-brand-50 font-semibold text-brand-700"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SectionTabs;
