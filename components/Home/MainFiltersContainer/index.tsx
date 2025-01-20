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
import CategoryItem from "./CategoryItem";
import { HomeLandingDto } from "@/api_services/home/home.interface";

function MainFiltersContainer({ data, title }: { data: HomeLandingDto[]; title: string }) {
  const ref = useRef<Swiper>(null);
  return (
    <div className="px-3 select-none md:px-3 lg:px-4 2xl:px-[10%]  pt-0 md:py-8 w-full">
      <div className={` w-full noSelect   select-none   relative rounded-20 flex flex-col items-center`}>
        <p className=" font-medium  w-full text-center md:text-start text-lg md:text-2xl">{title}</p>
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
            <SwiperWithNavigation
              pagination={{
                clickable: true,
                enabled: true,
              }}
              reference={ref}
              className="!w-full  !pb-10  "
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
                  slidesPerView: 4,
                  spaceBetween: 2,
                  grid: { fill: "row", rows: 1 },
                },
                // when window width is >= 768px
                768: {
                  slidesPerView: 5,
                  spaceBetween: 0,
                  grid: { fill: "row", rows: 1 },
                },
                1024: {
                  slidesPerView: 7.5,
                  spaceBetween: 0,
                  grid: { fill: "row", rows: 1 },
                },
                1600: {
                  slidesPerView: 7.5,
                  spaceBetween: 0,
                  grid: { fill: "row", rows: 1 },
                },
              }}
            >
              {data?.map((i, index: number) => (
                <SwiperSlide key={index} className={`w-full  !h-auto   p-0 md:py-2 cursor-pointer select-none md:px-2`}>
                  <CategoryItem item={i} key={`${i?.title}${index}cat`} />
                </SwiperSlide>
              ))}
            </SwiperWithNavigation>
          )
        }
      </div>
    </div>
  );
}

export default MainFiltersContainer;
