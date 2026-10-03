"use client";

import type { HomeCitiesProps } from "@/types/components/modules/home";
import { useRef } from "react";

import HomeCityRow from "./parts/HomeCityRow.client";

const MOUSE_DRAG_THRESHOLD = 5;

const splitByRow = (data: HomeCitiesProps["data"]) => [
  data?.filter((_, index) => index % 2 === 0) ?? [],
  data?.filter((_, index) => index % 2 === 1) ?? [],
];

const HomeCityFilterContainer = ({ data, title }: HomeCitiesProps) => {
  const rows = splitByRow(data);
  const drag = useRef({
    pointerId: null as number | null,
    startX: 0,
    startScrollLeft: 0,
    isRtl: false,
    hasDragged: false,
    previousScrollBehavior: "",
    suppressClick: false,
  });

  const finishMouseDrag = (scroller: HTMLDivElement, pointerId: number) => {
    if (drag.current.pointerId !== pointerId) return;

    const { hasDragged, previousScrollBehavior } = drag.current;

    if (scroller.hasPointerCapture(pointerId)) {
      scroller.releasePointerCapture(pointerId);
    }

    scroller.style.scrollBehavior = previousScrollBehavior;
    drag.current.pointerId = null;
    drag.current.hasDragged = false;
    drag.current.suppressClick = hasDragged;
  };

  return (
    <div className="home-tile-row noSelect relative flex w-full select-none flex-col gap-2.5 rounded-20 md:gap-2 lg:gap-3">
      <div className="padding-x hidden w-full items-center justify-between md:flex">
        <p className="shrink-0 text-start text-base font-bold lg:text-xl">
          {title}
        </p>
      </div>

      <div
        className="home-city-scroller padding-x w-full cursor-grab overflow-x-auto overscroll-x-contain scroll-smooth active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onClickCapture={(event) => {
          if (!drag.current.suppressClick) return;

          // A drag ends with a click event; do not navigate through the city link.
          event.preventDefault();
          event.stopPropagation();
          drag.current.suppressClick = false;
        }}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || event.button !== 0) return;

          const scroller = event.currentTarget;

          // Pointer capture keeps the drag active even when the cursor leaves
          // the scroller. onDragStart below suppresses native image/link drags.
          scroller.setPointerCapture(event.pointerId);
          drag.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScrollLeft: scroller.scrollLeft,
            isRtl: getComputedStyle(scroller).direction === "rtl",
            hasDragged: false,
            previousScrollBehavior: scroller.style.scrollBehavior,
            suppressClick: false,
          };
          scroller.style.scrollBehavior = "auto";
        }}
        onPointerMove={(event) => {
          if (drag.current.pointerId !== event.pointerId) return;

          const distance = event.clientX - drag.current.startX;

          if (
            !drag.current.hasDragged &&
            Math.abs(distance) < MOUSE_DRAG_THRESHOLD
          ) {
            return;
          }

          drag.current.hasDragged = true;
          event.preventDefault();

          // Modern browsers use negative scrollLeft values for RTL scrollers.
          // Inverting the delta keeps the content attached to the mouse in both directions.
          event.currentTarget.scrollLeft =
            drag.current.startScrollLeft +
            (drag.current.isRtl ? distance : -distance);
        }}
        onPointerUp={(event) =>
          finishMouseDrag(event.currentTarget, event.pointerId)
        }
        onPointerCancel={(event) =>
          finishMouseDrag(event.currentTarget, event.pointerId)
        }
        onLostPointerCapture={(event) =>
          finishMouseDrag(event.currentTarget, event.pointerId)
        }
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
