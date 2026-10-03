"use client";

import type { HomeCitiesProps } from "@/types/components/modules/home";

import HomeCityRow from "./parts/HomeCityRow.client";

const splitByRow = (data: HomeCitiesProps["data"]) => [
  data?.filter((_, index) => index % 2 === 0) ?? [],
  data?.filter((_, index) => index % 2 === 1) ?? [],
];

const HomeCityFilterContainer = ({ data, title }: HomeCitiesProps) => {
  const rows = splitByRow(data);

  return (
    <div className="home-tile-row noSelect relative flex w-full select-none flex-col gap-2.5 rounded-20 md:gap-2 lg:gap-3">
      <div className="padding-x hidden w-full items-center justify-between md:flex">
        <p className="shrink-0 text-start text-base font-bold lg:text-xl">
          {title}
        </p>
      </div>

      <div className="home-city-scroller padding-x w-full overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
