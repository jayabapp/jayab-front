"use client";

import _, { isEmpty } from "lodash";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import _STRINGS from "@/utils/LocalStrings";

import { isMobile } from "react-device-detect";
import EmptyList from "@/components/shared/Lotties/EmptyList";
const Swiper = dynamic(() => import("@/components/embelaCarousel/Swiper"), { ssr: false });
const SwiperSlide = dynamic(() => import("@/components/embelaCarousel/SwiperSlide"), { ssr: false });
import CategoryItem from "./CategoryItem";
import { HomeLandingDto } from "@/api_services/home/home.interface";
import dynamic from "next/dynamic";

function MainFiltersContainer({ data, title }: { data: HomeLandingDto[]; title: string }) {
  // const ref = useRef<Swiper>(null);
  return (
    <div
      className={` w-full noSelect   select-none   relative mt-2 rounded-20 flex gap-2 md:gap-2 flex-col items-center`}
    >
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
            slidesWidth={{ def: "25%", md: "12.5%" }}
            spacing="0.5rem"
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
