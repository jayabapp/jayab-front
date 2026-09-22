"use client";

import { useSyncedRowScroll } from "@/hooks/useSyncedRowScroll";

import type { HomeCitiesProps } from "@/types/components/modules/home";

import HomeCityItem from "./parts/HomeCityItem.client";
import HomeCityRow from "./parts/HomeCityRow.client";

const splitByRow = (data: HomeCitiesProps["data"]) => [
  data?.filter((_, index) => index % 2 === 0) ?? [],
  data?.filter((_, index) => index % 2 === 1) ?? [],
];

const HomeCityFilterContainer = ({ data, title }: HomeCitiesProps) => {
  const rows = splitByRow(data);
  const setRowRef = useSyncedRowScroll(rows.length);

  return (
    <div className="noSelect relative flex w-full select-none flex-col gap-2.5 rounded-20 md:gap-2 lg:gap-3">
      <div className="padding-x hidden w-full items-center justify-between md:flex">
        <p className="shrink-0 text-start text-base font-bold lg:text-xl">
          {title}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2.5 min-[900px]:hidden md:gap-2 lg:gap-3">
        {rows.map((row, rowIndex) => (
          <HomeCityRow
            row={row}
            key={`city-row-${rowIndex}`}
            syncRef={setRowRef(rowIndex)}
          />
        ))}
      </div>

      <div className="home-tile-grid padding-x hidden w-full min-[900px]:grid">
        {data?.map((city, index) => (
          <HomeCityItem item={city} key={`city-grid-${city?.title}-${index}`} />
        ))}
      </div>
    </div>
  );
};

export default HomeCityFilterContainer;
