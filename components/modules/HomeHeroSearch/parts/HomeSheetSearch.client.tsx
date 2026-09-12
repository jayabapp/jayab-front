"use client";

import { useEffect, useRef } from "react";
import { useStoreParams } from "@/store";

import HomeHeroSearch from "../HomeHeroSearch.client";

// The fixed header's own height: a pill hidden behind it counts as gone.
const HEADER_STRIP = "-64px 0px 0px 0px";

// The phone search pill, riding the sheet's lip so it scrolls away with the
// sheet. While it is still on screen the header keeps showing the brand instead
// of its own compact search, so the two never appear stacked.
const HomeSheetSearch = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const report = (inView: boolean) => {
      if (useStoreParams.getState().homeSearchInView !== inView)
        useStoreParams.setState({ homeSearchInView: inView });
    };
    if (!wrapper || typeof IntersectionObserver === "undefined") return;

    report(true);
    const observer = new IntersectionObserver(
      ([entry]) => report(entry.isIntersecting),
      { rootMargin: HEADER_STRIP },
    );
    observer.observe(wrapper);
    return () => {
      observer.disconnect();
      report(false);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative z-10 -mt-5 mb-1 w-full px-3">
      <HomeHeroSearch isPhone />
    </div>
  );
};

export default HomeSheetSearch;
