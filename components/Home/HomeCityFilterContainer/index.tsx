"use client";

import _, { isEmpty } from "lodash";

import { useEffect, useRef, useState } from "react";
import type { Swiper } from "swiper";
import { SwiperSlide } from "swiper/react";

import Link from "next/link";

import _STRINGS from "@/utils/LocalStrings";

import { isMobile } from "react-device-detect";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import SwiperWithNavigation from "@/components/SwiperWithNavigation";
import CategoryItem from "./HomeCityItem";
import { HomeLandingDto } from "@/api_services/home/home.interface";
import HomeCityItem from "./HomeCityItem";
import CityModal from "@/components/CityModal";

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
    <div className={` w-full noSelect   select-none   relative rounded-20 flex flex-col items-center`}>
      <div className="w-full flex items-center justify-between ">
        <p className=" font-medium   shrink-0 text-center md:text-start text-lg md:text-2xl">{title}</p>

        <div onClick={onShowCities} className="flex  cursor-pointer items-center shrink-0 gap-2">
          <p className="font-bold text-sm  shrink-0 text-primary-700 ">{_STRINGS.SEE_CITIES}</p>
          <img className="w-3 h-3 aspect-square" src="/assets/icons/shared/blue_chevron_left.svg" />
        </div>
      </div>{" "}
      {isEmpty(data) ? (
        <div className=" min-h-[30dvh] w-full flex items-center justify-center">
          {" "}
          <EmptyList />
        </div>
      ) : (
        <SwiperWithNavigation
          pagination={{
            clickable: true,
            enabled: true,
          }}
          reference={ref}
          className="!w-full  !pb-2  "
          onBeforeInit={(swiper: Swiper) => (ref.current = swiper)}
          dataLength={isMobile ? Number(data?.length) * 3 : Number(data?.length) * 2}
          // slidesPerView={2}
          grid={{ fill: "row", rows: 1 }}
          breakpoints={{
            // when window width is >= 640px
            320: {
              slidesPerView: 4,
              spaceBetween: 2,
              grid: { fill: "row", rows: 1 },
            },
            640: {
              slidesPerView: 5,
              spaceBetween: 2,
              grid: { fill: "row", rows: 1 },
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 7,
              spaceBetween: 0,
              grid: { fill: "row", rows: 1 },
            },
            1024: {
              slidesPerView: 9,
              spaceBetween: 0,
              grid: { fill: "row", rows: 1 },
            },
            1600: {
              slidesPerView: 10,
              spaceBetween: 0,
              grid: { fill: "row", rows: 1 },
            },
          }}
        >
          {data?.map((i, index: number) => (
            <SwiperSlide key={index} className={`w-full  !h-auto   p-0 md:py-2 cursor-pointer select-none md:px-2`}>
              <HomeCityItem item={i} key={`${i?.title}${index}cat`} />
            </SwiperSlide>
          ))}
        </SwiperWithNavigation>
      )}
      <CityModal onHide={onHideCities} show={showCities} passedUrl={"/rooms"} />
    </div>
  );
}

export default HomeCityFilterContainer;
