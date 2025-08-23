import React from "react";

import { NEW_IMAGE_URL, imageUrl } from "../../../utils/urls";

import "swiper/css/pagination";
import Image from "next/image";
import Editable from "@/components/Editable";

import Swiper from "@/components/embelaCarousel/Swiper";
import SwiperSlide from "@/components/embelaCarousel/SwiperSlide";
import Link from "next/link";

type ImageCarouselTypes = {
  list: any[];
  item?: { parentClass?: string; showCount?: number; imageClasses?: string };
};

const ImageCarousel = ({ list, item }: ImageCarouselTypes) => {
  // const onImageError = (e: any) => {
  //   e.target.src = "/assets/images/home/image_placeholder.png";
  // };

  return (
    <div className="h-full  col-span-full  px-4 md:pl-0 md:pr-4  py-0">
      <Swiper
        pagination
        autoplay
        spacing="0.5rem"
        slidesWidth={{ def: "100%", md: "40%" }}
        options={{ align: "center", direction: "rtl", dragFree: false, loop: true }}
      >
        {" "}
        {list?.map((e, i) => (
          <SwiperSlide key={`${e.id}banners`}>
            <Link
              aria-label={e?.image?.alt || e?.title}
              href={e?.property?.slug ? `/rooms/${e?.property?.slug}` : e?.link ? e?.link : ""}
              prefetch={false}
            >
              {" "}
              <Editable
                editIconClass=" !top-auto  !bottom-0"
                isBanner
                contentId={e?.id}
                // // href={e?.link ? e?.link : undefined}
                // target={e?.link ? "_blank" : ""}
                className={` focus:outline-none w-full px-0  aspect-[2]  md:aspect-[2.5]   ${
                  e?.link || e?.category || e?.product || e?.brand_id ? "cursor-pointer" : ""
                } transition-all duration-300 ease-in-out   relative`}
              >
                <Image
                  loading="lazy"
                  fetchPriority="auto"
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
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
