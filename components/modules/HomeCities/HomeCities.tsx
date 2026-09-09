import type { HomeCitiesProps } from "@/types/components/modules/home";

import CityMarqueeRow from "./parts/CityMarqueeRow.client";
import HomeCityItem from "./parts/HomeCityItem.client";

const splitByRow = (data: HomeCitiesProps["data"]) => [
  data?.filter((_, index) => index % 2 === 0) ?? [],
  data?.filter((_, index) => index % 2 === 1) ?? [],
];

const HomeCityFilterContainer = ({ data, title }: HomeCitiesProps) => {
  const rows = splitByRow(data);

  return (
    <div className="noSelect relative flex w-full select-none flex-col gap-2.5 rounded-20 md:gap-2 lg:gap-3">
      <div className="padding-x flex w-full items-center justify-between">
        <p className="shrink-0 text-start text-base font-bold lg:text-xl">
          {title}
        </p>
      </div>

      {rows.map((row, rowIndex) => (
        <CityMarqueeRow
          count={row.length}
          key={`city-row-${rowIndex}`}
          reverse={rowIndex % 2 === 1}
        >
          {row.map((city, index) => (
            <div
              key={`${city?.title}-${index}`}
              className="w-[5.5rem] shrink-0 px-1 md:w-[9.5rem] md:px-1.5"
            >
              <HomeCityItem item={city} />
            </div>
          ))}
        </CityMarqueeRow>
      ))}
    </div>
  );
};

export default HomeCityFilterContainer;
