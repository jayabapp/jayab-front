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
    <div className={` w-full noSelect   select-none   relative  rounded-20 flex gap-4 md:gap-2 flex-col items-center`}>
      <p className="  font-bold   hidden lg:flex  shrink-0 text-start w-full padding-x md:text-start  text-base  lg:text-xl    ">
        {title}
      </p>
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
              // when window width is >= 768px
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
            // slidesWidth={{ def: "25%", md: "12.5%" }}
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
