import _, { isEmpty } from "lodash";

import _STRINGS from "@/utils/LocalStrings";

import EmptyList from "@/components/shared/Lotties/EmptyList";
// const SwiperEm = dynamic(() => import("@/components/embelaCarousel/Swiper"), { ssr: true });
// const SwiperSlide = dynamic(() => import("@/components/embelaCarousel/SwiperSlide"), { ssr: true });
import SwiperEm from "@/components/embelaCarousel/Swiper";
import SwiperSlide from "@/components/embelaCarousel/SwiperSlide";

import { HomeLandingDto } from "@/api_services/home/home.interface";
import HomeCityItem from "./HomeCityItem";
import HomeCityFilterCityPart from "./HomeCityFilterCityPart";

function HomeCityFilterContainer({ data, title }: { data: HomeLandingDto[]; title: string }) {
  return (
    <div className={` w-full noSelect   select-none  gap-1  md:gap-2 relative rounded-20 flex flex-col items-center`}>
      <div className="w-full flex items-center justify-between ">
        <p className=" font-medium   shrink-0 text-center md:text-start text-sm md:text-xl">{title}</p>
        <HomeCityFilterCityPart />
      </div>{" "}
      {isEmpty(data) ? (
        <div className=" min-h-[30dvh] w-full flex items-center justify-center">
          {" "}
          <EmptyList />
        </div>
      ) : (
        <SwiperEm
          slidesWidth={{ def: "25%", md: "10%" }}
          spacing="0.5rem"
          options={{ align: "start", direction: "rtl", dragFree: true, loop: false }}
        >
          {data?.map((i, index: number) => (
            <SwiperSlide key={index} className={`w-full  !h-auto   p-0 md:py-2 cursor-pointer select-none md:px-2`}>
              <HomeCityItem item={i} key={`${i?.title}${index}cat`} />
            </SwiperSlide>
          ))}
        </SwiperEm>
      )}
    </div>
  );
}

export default HomeCityFilterContainer;
