import type { HomeQuickSearchProps } from "@/types/components/modules/home";

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
  return (
    <div
      className={` w-full noSelect   select-none   relative  rounded-20 flex gap-4 md:gap-2 flex-col items-center`}
    >
      <p className="  font-bold   hidden lg:flex  shrink-0 text-start w-full padding-x md:text-start  text-base  lg:text-xl    ">
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
          slidesPerView={!!devices?.isMobile || !!devices?.isTablet ? 4.5 : 8}
          spaceBetween={0}
          breakPoints={{
            320: {
              slidesPerView: 4.25,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 4.25,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 4.25,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 8,
              spaceBetween: 10,
            },
            1600: {
              slidesPerView: 8,
              spaceBetween: 10,
            },
          }}
          options={{ align: "start", direction: "rtl", dragFree: true }}
        >
          {data?.map((i, index: number) => (
            <SwiperSlide
              key={index}
              className={`w-full  !h-auto   p-0 md:py-2 cursor-pointer select-none md:px-2`}
            >
              <QuickSearchItem item={i} key={`${i?.title}${index}cat`} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default MainFiltersContainer;
