"use client";

import _, { isEmpty } from "lodash";

import { useEffect, useRef, useState } from "react";
import type { Swiper } from "swiper";
// import { SwiperSlide } from "swiper/react";

import Link from "next/link";

import _STRINGS from "@/utils/LocalStrings";

import { isMobile } from "react-device-detect";
import EmptyList from "@/components/shared/Lotties/EmptyList";
const SwiperEm = dynamic(() => import("@/components/embelaCarousel/Swiper"), { ssr: false });
const SwiperSlide = dynamic(() => import("@/components/embelaCarousel/SwiperSlide"), { ssr: false });
import CategoryItem from "./HomeCityItem";
import { HomeLandingDto } from "@/api_services/home/home.interface";
import HomeCityItem from "./HomeCityItem";
import CityModal from "@/components/CityModal";
import dynamic from "next/dynamic";

function HomeCityFilterContainer({ data, title }: { data: HomeLandingDto[]; title: string }) {
  const [showCities, setShowCities] = useState(false);

  const ref = useRef<Swiper>(null);

  const onHideCities = () => {
    setShowCities(false);
  };
  const onShowCities = () => {
    setShowCities(true);
  };

  return (
    <div className={` w-full noSelect   select-none  gap-1  md:gap-2 relative rounded-20 flex flex-col items-center`}>
      <div className="w-full flex items-center justify-between ">
        <p className=" font-medium   shrink-0 text-center md:text-start text-sm md:text-xl">{title}</p>

        <div onClick={onShowCities} className=" flex cursor-pointer items-center shrink-0 gap-2">
          <p className=" font-normal md:font-bold text-sm  shrink-0 text-primary-700 ">{_STRINGS.SEE_CITIES}</p>
          <img className="w-3 h-3 hidden md:flex aspect-square" src="/assets/icons/shared/blue_chevron_left.svg" />
          <img
            className="w-3 h-3  flex  md:hidden aspect-square"
            src="/assets/icons/shared/skiny_blue_chevron_left.svg"
          />
        </div>
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
      <CityModal onHide={onHideCities} show={showCities} passedUrl={"/rooms"} />
    </div>
  );
}

export default HomeCityFilterContainer;
