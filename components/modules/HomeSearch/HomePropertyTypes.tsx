const SwiperEm = dynamic(() => import("@elements/Carousel/Swiper.client"), {
  ssr: true,
});

import {
  HOME_TILE_BREAKPOINTS,
  HOME_TILE_DEFAULT_SLIDES_PER_VIEW,
  HOME_TILE_DEFAULT_SPACE_BETWEEN,
} from "./tile-breakpoints";
import type { THomePropertyTypesProps } from "@/types/components/modules/home";

import SwiperSlide from "@elements/Carousel/SwiperSlide";
import PropertyTypeItem from "./parts/PropertyTypeItem";
import dynamic from "next/dynamic";

const HomePropertyTypes = ({
  data,
  title,
  devices,
}: THomePropertyTypesProps) => {
  const isCompact = !!devices?.isMobile || !!devices?.isTablet;

  return (
    <div
      className={`w-full noSelect select-none gap-4 md:gap-2 relative rounded-20 lg:pt-0 flex flex-col items-start`}
    >
      <p className="padding-x hidden shrink-0 text-start text-base font-bold md:flex lg:text-xl">
        {title}
      </p>
      <SwiperEm
        viewportClassName="  padding-x "
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
        slidesWidth={{ def: "25%", md: "10%" }}
        options={{
          align: "start",
          direction: "rtl",
          dragFree: true,
          loop: false,
        }}
      >
        {data?.map((i, index: number) => (
          <SwiperSlide
            key={index}
            className={`w-full  !h-auto   p-0 md:py-2 cursor-pointer select-none md:px-2`}
          >
            <PropertyTypeItem
              index={index}
              item={i}
              key={`${i?.title}${index}`}
            />
          </SwiperSlide>
        ))}
      </SwiperEm>
    </div>
  );
};

export default HomePropertyTypes;
