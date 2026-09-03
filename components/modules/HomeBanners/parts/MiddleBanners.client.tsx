"use client";

import type { HomeMiddleBannersProps } from "@/types/components/modules/home";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { Swiper, SwiperSlide } from "swiper/react";
import { ContentImage } from "@elements/Image";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/navigation";
import { Autoplay } from "swiper/modules";
import { useRef } from "react";

import Editable from "@elements/Editable";
import "swiper/css/pagination";
import "swiper/css";

const MiddleBanners = ({
  list,
  cols = 2,
  containerClass,
}: HomeMiddleBannersProps) => {
  const router = useRouter();
  const ref = useRef(null) as any;

  return (
    <div
      className={`w-full   overflow-hidden px-0 py-0  relative ${containerClass} `}
    >
      <Swiper
        navigation
        spaceBetween={10}
        slidesPerView={"auto"}
        onBeforeInit={(swiper) => {
          ref.current = swiper;
        }}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
          },
          640: {
            slidesPerView: 1.2,
          },
          768: {
            slidesPerView: list?.length == 1 ? 1 : cols,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: list?.length == 1 ? 1 : cols,
            spaceBetween: 20,
          },
          1600: {
            slidesPerView: list?.length == 1 ? 1 : cols,
            spaceBetween: 20,
          },
        }}
        modules={[Autoplay]}
        watchSlidesProgress
      >
        {list?.map((e) => (
          <SwiperSlide key={e.id}>
            <Editable
              isBanner
              contentId={e?.id}
              className={`group ${
                cols > 1 && cols <= 2
                  ? "aspect-[2] "
                  : cols == 3
                    ? "aspect-[1.4] "
                    : "aspect-[3] "
              } focus:outline-none w-full px-0 relative overflow-hidden rounded-md   ${
                e?.brand_id || e?.link || e?.category || e?.product
                  ? "cursor-pointer"
                  : ""
              } `}
              onClick={() => {
                if (e?.brand_id) {
                  router.push(`/products?brands=${e?.brand_id}&sort_type=new`);
                } else if (e?.product?.slug) {
                  router.push(`/products/${e?.product?.slug}`);
                } else if (e?.category) {
                  if (e?.category?.parent?.id) {
                    router.push(
                      `/products?parent_category=${e?.category?.parent?.id}&categories=${e?.category?.id}`,
                    );
                  } else if (e?.category?.id) {
                    router.push(`/products?parent_category=${e?.category?.id}`);
                  }
                } else if (e?.link) router.push(e?.link);
              }}
            >
              <div className="invisible">sd</div>
              <div className="w-full h-full rounded-20 object-cover overflow-hidden align-middle">
                <ContentImage
                  src={getHomeImageUrl(
                    isMobile && e?.image_sm ? e?.image_sm : e?.image,
                  )}
                  fill
                  sizes="100vw"
                  alt={`${e?.id}`}
                  className="w-full h-full rounded-20 !object-cover overflow-hidden align-middle img-dark"
                />
              </div>
            </Editable>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MiddleBanners;
