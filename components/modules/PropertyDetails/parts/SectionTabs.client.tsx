"use client";

import { useEffect, useRef, useState } from "react";
import { trackListingEvent } from "@/helpers/listingAnalytics";
import { useTranslations } from "next-intl";

import type { SectionTabsProps } from "@/types/components/modules/property-details";

const SectionTabs = ({ tabs }: SectionTabsProps) => {
  const t = useTranslations("listing");

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
      aria-label={t("sectionsNav")}
      className="sticky top-[3.75rem] z-10 -mx-3 border-b border-line bg-surface/95 px-3 backdrop-blur md:top-20 md:z-20 md:mx-0 md:px-0"
    >
      <ul className="flex list-none gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              type="button"
              ref={(element) => {
                tabRefs.current[tab.id] = element;
              }}
              onClick={() => onTabClick(tab.id)}
              aria-current={activeId === tab.id ? "true" : undefined}
              className={`cursor-pointer whitespace-nowrap border-b-2 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus ${
                activeId === tab.id
                  ? "border-action font-semibold text-link"
                  : "border-transparent text-ink-muted hover:text-ink"
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
