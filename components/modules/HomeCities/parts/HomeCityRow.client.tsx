"use client";

import type { HomeCityRowProps } from "@/types/components/modules/home";

import HomeCityItem from "./HomeCityItem.client";

const HomeCityRow = ({ row }: HomeCityRowProps) => {
  return (
    <div
      className="home-city-row flex min-w-full w-max select-none gap-2 md:gap-3"
    >
      {row?.map((city, index) => (
        <div
          key={`${city?.title}-${index}`}
          className="home-city-tile w-[5.5rem] shrink-0 md:w-[8.8125rem]"
        >
          <HomeCityItem item={city} />
        </div>
      ))}
    </div>
  );
};

export default HomeCityRow;
