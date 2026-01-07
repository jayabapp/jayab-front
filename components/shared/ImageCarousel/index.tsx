import { NEW_IMAGE_URL } from "../../../utils/urls";

import Editable from "@/components/Editable";
import Image from "next/image";
import "swiper/css/pagination";

import Swiper from "@/components/embelaCarousel/Swiper";
import SwiperSlide from "@/components/embelaCarousel/SwiperSlide";
import { DeviceInfo } from "@/helpers/device.detector";
import Link from "next/link";

type ImageCarouselTypes = {
  list: any[];
  item?: { parentClass?: string; showCount?: number; imageClasses?: string };
  devices?: DeviceInfo;
};

const ImageCarousel = ({ list, item, devices }: ImageCarouselTypes) => {
  // const onImageError = (e: any) => {
  //   e.target.src = "/assets/images/home/image_placeholder.png";
  // };

  return (
    <div className="h-full  col-span-full  px-4 md:pl-0 md:pr-0  py-0">
      <Swiper
        pagination
        autoplay
        spaceBetween={!!devices?.isMobile || !!devices?.isTablet ? 2 : 5}
        slidesPerView={!!devices?.isMobile || !!devices?.isTablet ? 1 : 2.5}
        viewportClassName=" !px-0 md:!px-4"
        breakPoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 2,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 2,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 1,
            spaceBetween: 2,
          },
          1024: {
            slidesPerView: 2.5,
            spaceBetween: 5,
          },
          1600: {
            slidesPerView: 2.5,
            spaceBetween: 5,
          },
        }}
        options={{ align: "center", direction: "rtl", dragFree: false, loop: true, skipSnaps: false }}
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
                className={` focus:outline-none w-full px-0  aspect-[2.67]  md:aspect-[2.5]   ${
                  e?.link || e?.category || e?.product || e?.brand_id ? "cursor-pointer" : ""
                } transition-all duration-300 ease-in-out   relative`}
              >
                <Image
                  // loading="lazy"
                  fetchPriority="high"
                  fill
                  priority={true}
                  // onError={onImageError}
                  alt={e?.image?.alt}
                  // src={true ? "saf" : IMAGE_URL(e?.image_location)}
                  src={NEW_IMAGE_URL(e?.image)}
                  className={`w-full object-cover rounded-20 hidden  md:flex aspect-[2.67] md:aspect-[2.5]   align-middle  ${
                    item?.imageClasses ? item?.imageClasses : ""
                  }   `}
                />
                <Image
                  fill
                  fetchPriority="high"
                  priority={true}
                  // onError={onImageError}
                  alt={e?.image?.alt}
                  // src={true ? "saf" : IMAGE_URL(e?.image_location)}
                  src={NEW_IMAGE_URL(e?.image_sm ? e?.image_sm : e?.image)}
                  className={`w-full object-cover rounded-20 flex  md:hidden aspect-[2.67]  md:aspect-[2.5] align-middle  ${
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
