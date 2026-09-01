"use client";

import { BlogGridSkeleton } from "./BlogGridSkeleton";
import { SwiperSlide } from "swiper/react";
import { useRef } from "react";

import type { BlogsContainerProps } from "@/types/components/modules/blog";
import type { Swiper } from "swiper";

import SwiperWithNavigation from "@elements/Carousel/SwiperWithNavigation.client";
import EmptyState from "@elements/EmptyState";
import _STRINGS from "@/utils/LocalStrings";
import BlogCard from "./BlogCard";
import isEmpty from "lodash/isEmpty";
import Link from "next/link";

function BlogsContainer({ title, data, viewAllUrl }: BlogsContainerProps) {
  const ref = useRef<Swiper>(null);
  const tempData = data;

  return (
    <div
      className={` w-full    relative rounded-20 flex flex-col items-center`}
    >
      <div className="  px-5    md:px-0 flex   w-full mb-4 pb-4 justify-start items-start">
        {" "}
        <p className="text-xl  w-fit text-start  font-medium   ">
          {title}
        </p>{" "}
      </div>

      {!tempData ? (
        <BlogGridSkeleton count={3} />
      ) : isEmpty(tempData) ? (
        <EmptyState />
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
          breakpoints={{
            320: {
              slidesPerView: 1.5,
              spaceBetween: 5,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
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
            <SwiperSlide
              key={index}
              className={`w-full  !h-auto py-2 cursor-pointer select-none px-2`}
            >
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
          <p className="no-underline text-brand-600  text-base    ">
            {_STRINGS?.SEE_ALL}
          </p>{" "}
          <img src="/assets/icons/shared/blue_chevron_left.svg" alt="qwr" />
        </Link>
      </div>
    </div>
  );
}

export default BlogsContainer;
