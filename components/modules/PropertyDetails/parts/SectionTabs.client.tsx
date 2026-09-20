"use client";

import { useEffect, useState } from "react";
import { trackListingEvent } from "@/helpers/listingAnalytics";

import type { SectionTabsProps } from "@/types/components/modules/property-details";

import _STRINGS from "@/utils/LocalStrings";

const SectionTabs = ({ tabs }: SectionTabsProps) => {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");

  useEffect(() => {
    const sections = tabs
      .map((tab) => document.getElementById(tab.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [tabs]);

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
      aria-label={_STRINGS.SECTIONS_NAV}
      className="sticky top-16 z-20 -mx-3 mb-2 border-b border-neutral-100 bg-white/95 px-3 backdrop-blur md:top-20 md:mx-0 md:px-0"
    >
      <ul className="flex list-none gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              type="button"
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
