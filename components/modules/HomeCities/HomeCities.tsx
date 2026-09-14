import type { HomeCitiesProps } from "@/types/components/modules/home";
import { useSyncedRowScroll } from "@/hooks/useSyncedRowScroll";

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

      {rows.map((row, rowIndex) => (
        <HomeCityRow
          row={row}
          key={`city-row-${rowIndex}`}
          syncRef={setRowRef(rowIndex)}
        />
      ))}
    </div>
  );
};

export default HomeCityFilterContainer;
