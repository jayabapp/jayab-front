"use client";

import { useEffect, useRef } from "react";
import { useStoreParams } from "@/store";

import HomeHeroSearch from "../HomeHeroSearch.client";

const HEADER_STRIP = "-64px 0px 0px 0px";

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
    <div
      ref={wrapperRef}
      className="relative z-10 mx-auto -mt-5 mb-1 w-[calc(100%-1.5rem)] max-w-[20rem]"
    >
      <HomeHeroSearch isPhone />
    </div>
  );
};

export default HomeSheetSearch;
