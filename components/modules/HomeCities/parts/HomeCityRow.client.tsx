"use client";

import { useHorizontalDragScroll } from "@/hooks/useHorizontalDragScroll";
import type { HomeCitiesProps } from "@/types/components/modules/home";

import HomeCityItem from "./HomeCityItem.client";

const HomeCityRow = ({ row }: { row: HomeCitiesProps["data"] }) => {
  const scrollRef = useHorizontalDragScroll<HTMLDivElement>();

  return (
    <div
      ref={scrollRef}
      className="padding-x flex w-full cursor-grab gap-2 overflow-x-auto md:gap-3"
    >
      {row?.map((city, index) => (
        <div
          key={`${city?.title}-${index}`}
          className="w-[5.5rem] shrink-0 md:w-[9.5rem]"
        >
          <HomeCityItem item={city} />
        </div>
      ))}
    </div>
  );
};

export default HomeCityRow;
