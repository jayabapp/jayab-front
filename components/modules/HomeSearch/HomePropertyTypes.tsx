const SwiperEm = dynamic(() => import("@/components/embelaCarousel/Swiper"), { ssr: true });
// const SwiperSlide = dynamic(() => import("@/components/embelaCarousel/SwiperSlide"), { ssr: true });
// import SwiperEm from "@/components/embelaCarousel/Swiper";
import { type DeviceInfo, type HomeLandingDto } from "@/types/components/modules/home";

import SwiperSlide from "@/components/embelaCarousel/SwiperSlide";
import PropertyTypeItem from "./parts/PropertyTypeItem";
import dynamic from "next/dynamic";

const HomePropertyTypes = ({ data, title, devices }: { data: HomeLandingDto[]; title: string; devices?: DeviceInfo }) => {
  return (
    <div
      className={` w-full noSelect   select-none  gap-4 md:gap-2 relative rounded-20   pt-2 lg:pt-0 flex flex-col items-start `}
    >
      <p className=" font-bold    padding-x  shrink-0 text-center md:text-start hidden   lg:flex text-lg lg:text-xl  ">
        {title}
      </p>
      <SwiperEm
        viewportClassName="  padding-x "
        slidesPerView={!!devices?.isMobile || !!devices?.isTablet ? 4 : 8}
        spaceBetween={2}
        breakPoints={{
          320: {
            slidesPerView: 4.25,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 4.25,
            spaceBetween: 10,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 4.25,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 8,
            spaceBetween: 2,
          },
          1600: {
            slidesPerView: 8,
            spaceBetween: 2,
          },
        }}
        slidesWidth={{ def: "25%", md: "10%" }}
        options={{ align: "start", direction: "rtl", dragFree: true, loop: false }}
      >
        {data?.map((i, index: number) => (
          <SwiperSlide key={index} className={`w-full  !h-auto   p-0 md:py-2 cursor-pointer select-none md:px-2`}>
            <PropertyTypeItem item={i} key={`${i?.title}${index}`} />
          </SwiperSlide>
        ))}
      </SwiperEm>
    </div>
  );
}

export default HomePropertyTypes;
