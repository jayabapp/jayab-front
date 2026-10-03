"use client";

import { useEffect, useRef } from "react";

import type { HomeCitiesProps } from "@/types/components/modules/home";

import HomeCityRow from "./parts/HomeCityRow.client";

const MOUSE_DRAG_THRESHOLD = 5;

const splitByRow = (data: HomeCitiesProps["data"]) => [
  data?.filter((_, index) => index % 2 === 0) ?? [],
  data?.filter((_, index) => index % 2 === 1) ?? [],
];

const HomeCityFilterContainer = ({ data, title }: HomeCitiesProps) => {
  const rows = splitByRow(data);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const removeDocumentListeners = useRef<(() => void) | null>(null);
  const drag = useRef({
    startX: 0,
    startScrollLeft: 0,
    isRtl: false,
    hasDragged: false,
    previousScrollBehavior: "",
    suppressClick: false,
  });

  const finishMouseDrag = () => {
    const { hasDragged, previousScrollBehavior } = drag.current;
    const scroller = scrollerRef.current;

    removeDocumentListeners.current?.();
    removeDocumentListeners.current = null;

    if (scroller) scroller.style.scrollBehavior = previousScrollBehavior;
    drag.current.hasDragged = false;
    drag.current.suppressClick = hasDragged;
  };

  useEffect(() => finishMouseDrag, []);

  return (
    <div className="home-tile-row noSelect relative flex w-full select-none flex-col gap-2.5 rounded-20 md:gap-2 lg:gap-3">
      <div className="padding-x hidden w-full items-center justify-between md:flex">
        <p className="shrink-0 text-start text-base font-bold lg:text-xl">
          {title}
        </p>
      </div>

      <div
        className="home-city-scroller padding-x w-full cursor-grab overflow-x-auto overscroll-x-contain scroll-smooth active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={scrollerRef}
        onClickCapture={(event) => {
          if (!drag.current.suppressClick) return;
          event.preventDefault();
          event.stopPropagation();
          drag.current.suppressClick = false;
        }}
        onDragStart={(event) => event.preventDefault()}
        onMouseDown={(event) => {
          if (event.button !== 0) return;

          const scroller = event.currentTarget;

          drag.current = {
            startX: event.clientX,
            startScrollLeft: scroller.scrollLeft,
            isRtl: getComputedStyle(scroller).direction === "rtl",
            hasDragged: false,
            previousScrollBehavior: scroller.style.scrollBehavior,
            suppressClick: false,
          };
          scroller.style.scrollBehavior = "auto";

          const onMouseMove = (moveEvent: MouseEvent) => {
            const distance = moveEvent.clientX - drag.current.startX;
            if (
              !drag.current.hasDragged &&
              Math.abs(distance) < MOUSE_DRAG_THRESHOLD
            )
              return;
            drag.current.hasDragged = true;
            moveEvent.preventDefault();
            scroller.scrollLeft =
              drag.current.startScrollLeft +
              (drag.current.isRtl ? distance : -distance);
          };
          const onMouseUp = () => finishMouseDrag();

          removeDocumentListeners.current?.();
          removeDocumentListeners.current = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        }}
      >
        <div className="home-city-scroll-track flex min-w-full w-max flex-col gap-2.5 md:gap-2 lg:gap-3">
          {rows.map((row, rowIndex) => (
            <HomeCityRow row={row} key={`city-row-${rowIndex}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCityFilterContainer;
