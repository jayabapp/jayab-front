import isEmpty from "lodash/isEmpty";

import { HomeLandingDto } from "@/api_services/home/home.interface";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import { DeviceInfo } from "@/helpers/device.detector";
import dynamic from "next/dynamic";
import CategoryItem from "./CategoryItem";
const Swiper = dynamic(() => import("@/components/embelaCarousel/Swiper"), { ssr: true });
const SwiperSlide = dynamic(() => import("@/components/embelaCarousel/SwiperSlide"), { ssr: true });

function MainFiltersContainer({
  data,
  title,
  devices,
}: {
  data: HomeLandingDto[];
  title: string;
  devices?: DeviceInfo;
}) {
  // const ref = useRef<Swiper>(null);
  return (
    <div className={` w-full noSelect   select-none   relative  rounded-20 flex gap-2 md:gap-2 flex-col items-center`}>
      <p className=" font-medium  w-full text-start md:text-start text-sm md:text-xl ">{title}</p>
      {
        // isLoading ? (
        //   <div className=" min-h-[30dvh] w-full flex items-center justify-center">
        //     {" "}
        //     <LottieLoading margin="w-full" />
        //   </div>
        // ) :
        isEmpty(data) ? (
          <div className=" min-h-[30dvh] w-full flex items-center justify-center">
            {" "}
            <EmptyList />
          </div>
        ) : (
          <Swiper
            slidesPerView={!!devices?.isMobile || !!devices?.isTablet ? 4 : 8}
            spaceBetween={0}
            breakPoints={{
              320: {
                slidesPerView: 4,
                spaceBetween: 0,
              },
              640: {
                slidesPerView: 4,
                spaceBetween: 0,
              },
              // when window width is >= 768px
              768: {
                slidesPerView: 4,
                spaceBetween: 0,
              },
              1024: {
                slidesPerView: 8,
                spaceBetween: 0,
              },
              1600: {
                slidesPerView: 8,
                spaceBetween: 0,
              },
            }}
            withArrows
            slidesWidth={{ def: "25%", md: "12.5%" }}
            options={{ align: "start", direction: "rtl", dragFree: true }}
          >
            {data?.map((i, index: number) => (
              <SwiperSlide key={index} className={`w-full  !h-auto   p-0 md:py-2 cursor-pointer select-none md:px-2`}>
                <CategoryItem item={i} key={`${i?.title}${index}cat`} />
              </SwiperSlide>
            ))}
          </Swiper>
        )
      }
    </div>
  );
}

export default MainFiltersContainer;
