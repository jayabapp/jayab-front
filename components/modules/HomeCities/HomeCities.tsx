import type { HomeCitiesProps } from "@/types/components/modules/home";

import HomeCityItem from "./parts/HomeCityItem.client";

const splitByRow = (data: HomeCitiesProps["data"]) => [
  data?.filter((_, index) => index % 2 === 0) ?? [],
  data?.filter((_, index) => index % 2 === 1) ?? [],
];

const HomeCityFilterContainer = ({ data, title }: HomeCitiesProps) => {
  const rows = splitByRow(data);

  return (
    <div className="noSelect relative flex w-full select-none flex-col gap-2.5 rounded-20 md:gap-2 lg:gap-3">
      <div className="padding-x hidden w-full items-center justify-between md:flex">
        <p className="shrink-0 text-start text-base font-bold lg:text-xl">
          {title}
        </p>
      </div>

      {rows.map((row, rowIndex) => (
        <div
          key={`city-row-${rowIndex}`}
          className="padding-x flex w-full gap-2 overflow-x-auto md:gap-3"
        >
          {row.map((city, index) => (
            <div
              key={`${city?.title}-${index}`}
              className="w-[5.5rem] shrink-0 md:w-[9.5rem]"
            >
              <HomeCityItem item={city} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HomeCityFilterContainer;
