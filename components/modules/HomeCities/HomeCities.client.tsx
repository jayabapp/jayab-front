"use client";

import { useHorizontalDragScroll } from "@/hooks/useHorizontalDragScroll";

import type { HomeCitiesProps } from "@/types/components/modules/home";

import HomeCityItem from "./parts/HomeCityItem.client";

const HomeCityFilterContainer = ({ data, title }: HomeCitiesProps) => {
  const scrollRef = useHorizontalDragScroll<HTMLDivElement>();

  return (
    <div className="home-tile-row noSelect relative flex w-full select-none flex-col gap-2.5 rounded-20 md:gap-2 lg:gap-3">
      <div className="padding-x hidden w-full items-center justify-between md:flex">
        <p className="shrink-0 text-start text-base font-bold lg:text-xl">
          {title}
        </p>
      </div>

      <div
        ref={scrollRef}
        className="padding-x grid w-full cursor-grab select-none grid-flow-col grid-rows-[auto_auto] gap-2 overflow-x-auto scroll-auto md:gap-3 data-[dragging=true]:cursor-grabbing data-[dragging=true]:[&_*]:cursor-grabbing"
      >
        {data?.map((city, index) => (
          <div
            key={`${city?.title}-${index}`}
            className="home-city-tile w-[5.5rem] shrink-0 md:w-[8.8125rem]"
          >
            <HomeCityItem item={city} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCityFilterContainer;
