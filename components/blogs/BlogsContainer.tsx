"use client";

import isEmpty from "lodash/isEmpty";

import { useEffect, useRef, useState } from "react";
import type { Swiper } from "swiper";
import { SwiperSlide } from "swiper/react";

import { ContentDto } from "@/api_services/home/home.interface";
import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";
import EmptyList from "../shared/Lotties/EmptyList";
import LottieLoading from "../shared/Lotties/LottieLoading";
import SwiperWithNavigation from "../SwiperWithNavigation";
import BlogCard from "./BlogCard";
type BlogsContainerTypes = {
  title: string;

  viewAllUrl: string;
  data?: ContentDto[];
};

function BlogsContainer({
  title,
  data,

  viewAllUrl,
}: BlogsContainerTypes) {
  const ref = useRef<Swiper>(null);
  const [tempData, settempData] = useState(data);
  // const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    settempData(data);
  }, [data]);

  // const getData = () => {
  //   setisLoading(true);
  //   ApiCall(
  //     "GET",
  //     url ? url : "",
  //     null,
  //     "GET PRODUCTS",
  //     ({ data }) => {
  //       settempData(data);
  //       setisLoading(false);
  //     },
  //     () => {
  //       setisLoading(false);
  //     }
  //   );
  // };
  // const { data: tempData } = useQuery([`${url}_CACHEKEY`], () =>
  //   BusinessServices.Freelancer<StroesDto[]>({ url: url, body: body })
  // );
  // useEffect(() => {
  //   settempData(data);
  // }, [data]);

  return (
    <div className={` w-full    relative rounded-20 flex flex-col items-center`}>
      <div className="  px-5    md:px-0 flex   w-full mb-4 pb-4 justify-start items-start">
        {" "}
        <p className="text-xl  w-fit text-start  font-medium   ">{title}</p>{" "}
      </div>

      {!tempData ? (
        <LottieLoading />
      ) : isEmpty(tempData) ? (
        <EmptyList />
      ) : (
        <SwiperWithNavigation
          reference={ref}
          pagination={{
            clickable: true,
            enabled: true,
          }}
          className="w-full  !pb-10  "
          onBeforeInit={(swiper: Swiper) => (ref.current = swiper)}
          dataLength={tempData?.length}
          // slidesPerView={2}
          breakpoints={{
            // when window width is >= 640px
            320: {
              slidesPerView: 1.5,
              spaceBetween: 5,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1600: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
          }}
          ca
        >
          {tempData?.map((i, index: number) => (
            <SwiperSlide key={index} className={`w-full  !h-auto py-2 cursor-pointer select-none px-2`}>
              <BlogCard item={i} />
            </SwiperSlide>
          ))}
        </SwiperWithNavigation>
      )}

      <div className="w-full  flex items-center justify-center mt-4">
        {" "}
        <Link
          title={_STRINGS.SEE_ALL}
          prefetch={false}
          href={viewAllUrl}
          style={{ textDecoration: "none" }}
          className="   flex  gap-2  px-3 py-1  w-fit bg-transparent  self-end"
        >
          <p className="no-underline text-primary-700  text-base    ">{_STRINGS?.SEE_ALL}</p>{" "}
          <img src="/assets/icons/shared/blue_chevron_left.svg" alt="qwr" />
        </Link>
      </div>
    </div>
  );
}

export default BlogsContainer;
