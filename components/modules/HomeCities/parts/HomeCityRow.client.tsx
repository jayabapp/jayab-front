"use client";

import { useHorizontalDragScroll } from "@/hooks/useHorizontalDragScroll";
import type { HomeCityRowProps } from "@/types/components/modules/home";

import HomeCityItem from "./HomeCityItem.client";

const HomeCityRow = ({ row, syncRef }: HomeCityRowProps) => {
  const scrollRef = useHorizontalDragScroll<HTMLDivElement>();

  return (
    <div
      ref={(element) => {
        scrollRef.current = element;
        syncRef(element);
      }}
      className="padding-x flex w-full cursor-grab gap-2 overflow-x-auto md:gap-3"
    >
      {row?.map((city, index) => (
        <div
          key={`${city?.title}-${index}`}
          className="w-[5.5rem] shrink-0 md:w-[8.8125rem]"
        >
          <HomeCityItem item={city} />
        </div>
      ))}
    </div>
  );
};

export default HomeCityRow;
