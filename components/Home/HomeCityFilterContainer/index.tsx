const SwiperEm = dynamic(() => import("@/components/embelaCarousel/Swiper"), { ssr: true });
// const SwiperSlide = dynamic(() => import("@/components/embelaCarousel/SwiperSlide"), { ssr: true });
// import SwiperEm from "@/components/embelaCarousel/Swiper";
import SwiperSlide from "@/components/embelaCarousel/SwiperSlide";

import { HomeLandingDto } from "@/api_services/home/home.interface";
import { DeviceInfo } from "@/helpers/device.detector";
import dynamic from "next/dynamic";
import HomeCityFilterCityPart from "./HomeCityFilterCityPart";
import HomeCityItem from "./HomeCityItem";

function HomeCityFilterContainer({
  data,
  title,
  devices,
}: {
  data: HomeLandingDto[];
  title: string;
  devices?: DeviceInfo;
}) {
  return (
    <div className={` w-full noSelect   select-none  gap-1  md:gap-2 relative rounded-20 flex flex-col items-center`}>
      <div className="w-full flex items-center justify-between ">
        <p className=" font-medium   shrink-0 text-center md:text-start text-sm md:text-xl">{title}</p>
        <HomeCityFilterCityPart />
      </div>{" "}
      <SwiperEm
        slidesPerView={!!devices?.isMobile || !!devices?.isTablet ? 4 : 10}
        spaceBetween={2}
        breakPoints={{
          320: {
            slidesPerView: 4,
            spaceBetween: 2,
          },
          640: {
            slidesPerView: 4,
            spaceBetween: 2,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 4,
            spaceBetween: 2,
          },
          1024: {
            slidesPerView: 8,
            spaceBetween: 2,
          },
          1600: {
            slidesPerView: 10,
            spaceBetween: 2,
          },
        }}
        withArrows
        slidesWidth={{ def: "25%", md: "10%" }}
        options={{ align: "start", direction: "rtl", dragFree: true, loop: false }}
      >
        {data?.map((i, index: number) => (
          <SwiperSlide key={index} className={`w-full  !h-auto   p-0 md:py-2 cursor-pointer select-none md:px-2`}>
            <HomeCityItem item={i} key={`${i?.title}${index}cat`} />
          </SwiperSlide>
        ))}
      </SwiperEm>
    </div>
  );
}

export default HomeCityFilterContainer;
