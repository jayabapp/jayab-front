const SwiperEm = dynamic(() => import("@elements/Carousel/Swiper.client"), {
  ssr: true,
});

import type { HomeCitiesProps } from "@/types/components/modules/home";

import SwiperSlide from "@elements/Carousel/SwiperSlide";
import HomeCityItem from "./parts/HomeCityItem.client";
import dynamic from "next/dynamic";
import chunk from "lodash/chunk";

const HomeCityFilterContainer = ({ data, title, devices }: HomeCitiesProps) => {
  const chunckedData = chunk(data || [], 2);
  return (
    <div
      className={` w-full noSelect   select-none  gap-4  md:gap-2 relative rounded-20 flex flex-col items-center`}
    >
      <div className="w-full hidden lg:flex  padding-x items-center justify-between ">
        <p className=" font-bold     shrink-0 text-center md:text-start  text-base  lg:text-xl  ">
          {title}
        </p>
      </div>{" "}
      <SwiperEm
        viewportClassName="padding-x"
        slidesPerView={!!devices?.isMobile || !!devices?.isTablet ? 3.75 : 8}
        spaceBetween={1}
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
        slidesWidth={{ def: "25%", md: "10%" }}
        options={{
          align: "start",
          direction: "rtl",
          dragFree: true,
          loop: false,
        }}
      >
        {chunckedData?.map((i, index: number) => {
          const firstItem = i?.[0];
          const secondItem = i?.[1];
          return (
            <SwiperSlide
              key={index}
              className={`w-full  !h-auto   p-0 md:py-2 cursor-pointer select-none md:px-2`}
            >
              <div className="flex flex-col gap-2.5 lg:gap-3 ">
                <HomeCityItem
                  item={firstItem}
                  key={`${firstItem?.title}${index}cat`}
                />
                {!!secondItem ? (
                  <HomeCityItem
                    item={secondItem}
                    key={`${secondItem?.title}${index}cat`}
                  />
                ) : (
                  <></>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </SwiperEm>
    </div>
  );
};

export default HomeCityFilterContainer;
