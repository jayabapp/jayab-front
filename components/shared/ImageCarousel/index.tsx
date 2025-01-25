"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { NEW_IMAGE_URL, imageUrl } from "../../../utils/urls";

import "swiper/css/pagination";
import Image from "next/image";
import Editable from "@/components/Editable";
type ImageCarouselTypes = {
  list: any[];
  item?: { parentClass?: string; showCount?: number; imageClasses?: string };
};

const ImageCarousel = ({ list, item }: ImageCarouselTypes) => {
  const router = useRouter();
  // const onImageError = (e: any) => {
  //   e.target.src = "/assets/images/home/image_placeholder.png";
  // };
  return (
    <div className="h-full  col-span-full  px-4 md:pl-0 md:pr-4  py-0">
      <Swiper
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        slidesPerView={item?.showCount ? item?.showCount : 1}
        breakpoints={{
          // when window width is >= 640px
          320: {
            slidesPerView: 1,
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
            slidesPerView: 2.5,
            spaceBetween: 10,
          },
          1600: {
            slidesPerView: 2.5,
            spaceBetween: 15,
          },
        }}
        spaceBetween={10}
        centeredSlides={true}
        zoom={true}
        pagination={true}
        className={` ${item?.parentClass}`}
      >
        {" "}
        {list?.map((e, i) => (
          <SwiperSlide key={`${e.id}banners`}>
            {({ isActive }) => (
              <Editable
                editIconClass=" !top-auto  !bottom-0"
                isBanner
                contentId={e?.id}
                onClick={() => {
                  if (e?.brand_id) {
                    router.push(`/products?brands=${e?.brand_id}&sort_type=new`);
                  } else if (e?.product?.slug) {
                    router.push(`/products/${e?.product?.slug}`);
                  } else if (e?.category) {
                    if (e?.category?.parent?.id) {
                      router.push(`/products?parent_category=${e?.category?.parent?.id}&categories=${e?.category?.id}`);
                    } else if (e?.category?.id) {
                      router.push(`/products?parent_category=${e?.category?.id}`);
                    }
                  } else if (e?.link) router.push(e?.link);
                }}
                // // href={e?.link ? e?.link : undefined}
                // target={e?.link ? "_blank" : ""}
                className={` focus:outline-none w-full px-0  aspect-[2]  md:aspect-[2.5]   ${
                  e?.link || e?.category || e?.product || e?.brand_id ? "cursor-pointer" : ""
                } transition-all duration-300 ease-in-out   relative`}
              >
                <Image
                  fill
                  // onError={onImageError}
                  alt={e?.image?.alt}
                  // src={true ? "saf" : IMAGE_URL(e?.image_location)}
                  src={NEW_IMAGE_URL(e?.image)}
                  className={`w-full object-cover rounded-20 hidden  md:flex aspect-[2] md:aspect-[2.5]   align-middle  ${
                    item?.imageClasses ? item?.imageClasses : ""
                  }   `}
                />
                <Image
                  fill
                  // onError={onImageError}
                  alt={e?.image?.alt}
                  // src={true ? "saf" : IMAGE_URL(e?.image_location)}
                  src={NEW_IMAGE_URL(e?.image_sm ? e?.image_sm : e?.image)}
                  className={`w-full object-cover rounded-20 flex  md:hidden aspect-[2]  md:aspect-[2.5] align-middle  ${
                    item?.imageClasses ? item?.imageClasses : ""
                  }   `}
                />
              </Editable>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
