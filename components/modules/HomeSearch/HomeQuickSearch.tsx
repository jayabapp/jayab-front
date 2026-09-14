import type { HomeQuickSearchProps } from "@/types/components/modules/home";
import { HOME_TILE_DEFAULT_SLIDES_PER_VIEW } from "./tile-breakpoints";
import { HOME_TILE_DEFAULT_SPACE_BETWEEN } from "./tile-breakpoints";
import { HOME_TILE_BREAKPOINTS } from "./tile-breakpoints";

import QuickSearchItem from "./parts/QuickSearchItem";
import EmptyState from "@elements/EmptyState";
import isEmpty from "lodash/isEmpty";
import dynamic from "next/dynamic";

const Swiper = dynamic(() => import("@elements/Carousel/Swiper.client"), {
  ssr: true,
});
const SwiperSlide = dynamic(() => import("@elements/Carousel/SwiperSlide"), {
  ssr: true,
});

const MainFiltersContainer = ({
  data,
  title,
  devices,
}: HomeQuickSearchProps) => {
  const isCompact = !!devices?.isMobile || !!devices?.isTablet;

  return (
    <div
      className={` w-full noSelect   select-none   relative  rounded-20 flex gap-4 md:gap-2 flex-col items-center`}
    >
      <p className="padding-x hidden w-full shrink-0 text-start text-base font-bold md:flex lg:text-xl">
        {title}
      </p>
      {isEmpty(data) ? (
        <div className=" min-h-[30dvh] w-full flex items-center justify-center">
          {" "}
          <EmptyState />
        </div>
      ) : (
        <Swiper
          viewportClassName="padding-x"
          slidesPerView={
            isCompact
              ? HOME_TILE_DEFAULT_SLIDES_PER_VIEW.compact
              : HOME_TILE_DEFAULT_SLIDES_PER_VIEW.wide
          }
          spaceBetween={
            isCompact
              ? HOME_TILE_DEFAULT_SPACE_BETWEEN.compact
              : HOME_TILE_DEFAULT_SPACE_BETWEEN.wide
          }
          breakPoints={HOME_TILE_BREAKPOINTS}
          options={{ align: "start", direction: "rtl", dragFree: true }}
        >
          {data?.map((i, index: number) => (
            <SwiperSlide
              key={index}
              className={`home-tile-slide w-full  !h-auto   p-0 md:py-2 cursor-pointer select-none md:px-2`}
            >
              <QuickSearchItem
                index={index}
                item={i}
                key={`${i?.title}${index}cat`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default MainFiltersContainer;
