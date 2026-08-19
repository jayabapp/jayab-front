import { NEW_IMAGE_URL } from "../../../utils/urls";
import { useMutation } from "@tanstack/react-query";
import { HomeService } from "@/api_services/home/home.service";
import { DeviceInfo } from "@/helpers/device.detector";

import SwiperSlide from "@/components/embelaCarousel/SwiperSlide";
import Editable from "@/components/Editable";
import Swiper from "@/components/embelaCarousel/Swiper";
import Image from "next/image";
import Link from "next/link";

type ImageCarouselTypes = {
  list: any[];
  devices?: DeviceInfo;
  item?: { parentClass?: string; showCount?: number; imageClasses?: string };
};

const ImageCarousel = ({ list, item, devices }: ImageCarouselTypes) => {
  const isPhone = devices?.isMobile;
  const mobile_filteredBanners = list?.filter((e) => !!e?.image_sm);
  const desktop_filteredBanners = list?.filter((e) => !e?.image_sm);
  const final_banenrs = isPhone
    ? mobile_filteredBanners
    : desktop_filteredBanners;
  const { mutate } = useMutation({
    mutationFn: HomeService.updateBannerViewCount,
  });

  return (
    <div className="h-full  col-span-full   py-0">
      <Swiper
        autoplay
        pagination
        viewportClassName=" !px-0 md:!px-4"
        spaceBetween={!!devices?.isMobile || !!devices?.isTablet ? 2 : 5}
        slidesPerView={!!devices?.isMobile || !!devices?.isTablet ? 1 : 1}
        breakPoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 2,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 2,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 2,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 5,
          },
          1600: {
            slidesPerView: 1,
            spaceBetween: 5,
          },
        }}
        options={{
          align: "center",
          direction: "rtl",
          dragFree: false,
          loop: true,
          skipSnaps: false,
        }}
      >
        {" "}
        {final_banenrs?.map((e, i) => (
          <SwiperSlide key={`${e.id}banners`}>
            <Link
              title={e?.title}
              onClick={() => {
                mutate({ bannerId: e?.id });
              }}
              aria-label={e?.image?.alt || e?.title}
              href={
                e?.property?.slug
                  ? `/rooms/${e?.property?.slug}`
                  : e?.link
                    ? e?.link
                    : ""
              }
              prefetch={false}
            >
              {" "}
              <Editable
                isBanner
                contentId={e?.id}
                editIconClass=" !top-auto  !bottom-0"
                className={` focus:outline-none w-full px-0    aspect-[1.5] md:aspect-[6]   ${
                  e?.link || e?.category || e?.product || e?.brand_id
                    ? "cursor-pointer"
                    : ""
                } transition-all duration-300 ease-in-out   relative`}
              >
                {isPhone ? (
                  <Image
                    fill
                    sizes="100vw"
                    loading="lazy"
                    alt={e?.image?.alt}
                    src={NEW_IMAGE_URL(e?.image_sm ? e?.image_sm : e?.image)}
                    className={`w-full object-cover rounded-20 flex  aspect-[1.5] align-middle  ${
                      item?.imageClasses ? item?.imageClasses : ""
                    }   `}
                  />
                ) : (
                  <Image
                    fill
                    sizes="100vw"
                    loading="lazy"
                    alt={e?.image?.alt}
                    src={NEW_IMAGE_URL(e?.image)}
                    className={`w-full object-cover rounded-20 flex  aspect-[6]   align-middle  ${
                      item?.imageClasses ? item?.imageClasses : ""
                    }   `}
                  />
                )}
              </Editable>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
