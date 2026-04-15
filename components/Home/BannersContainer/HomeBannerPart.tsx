"use client";
import Editable from "@/components/Editable";
import { DeviceInfo } from "@/helpers/device.detector";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { random } from "lodash";
import Image from "next/image";
import Link from "next/link";

type ImageCarouselTypes = {
  banners?: any[];
  devices?: DeviceInfo;
};

const HomeBannerPart = ({ banners, devices }: ImageCarouselTypes) => {
  const randomeNumber = random(0, (banners?.length || 1) - 1, false);
  const item = banners?.[Math.floor(randomeNumber)];

  return (
    <div
      className={`
  
    
       w-full h-full  md:gap-3 lg:grid-cols-3  px-0  `}
    >
      <Link
        aria-label={item?.image?.alt || item?.title}
        href={item?.property?.slug ? `/rooms/${item?.property?.slug}` : item?.link ? item?.link : ""}
        prefetch={false}
      >
        {" "}
        <Editable
          editIconClass=" !top-auto  !bottom-0"
          isBanner
          contentId={item?.id}
          // // href={item?.link ? item?.link : undefined}
          // target={item?.link ? "_blank" : ""}
          className={` focus:outline-none w-full px-0  aspect-[2.67]  md:aspect-[3]   ${
            item?.link || item?.category || item?.product || item?.brand_id ? "cursor-pointer" : ""
          } transition-all duration-300 ease-in-out   relative`}
        >
          <Image
            // loading="lazy"
            fetchPriority="high"
            fill
            priority={true}
            // onError={onImageError}
            alt={item?.image?.alt}
            // src={true ? "saf" : IMAGE_URL(e?.image_location)}
            src={NEW_IMAGE_URL(item?.image)}
            className={`w-full object-cover  hidden  md:flex aspect-[2.67] md:aspect-[3]   align-middle  ${
              item?.imageClasses ? item?.imageClasses : ""
            }   `}
          />
          <Image
            fill
            fetchPriority="high"
            priority={true}
            // onError={onImageError}
            alt={item?.image?.alt}
            // src={true ? "saf" : IMAGE_URL(e?.image_location)}
            src={NEW_IMAGE_URL(item?.image_sm ? item?.image_sm : item?.image)}
            className={`w-full object-cover  flex  md:hidden aspect-[2.67]  md:aspect-[3] align-middle  ${
              item?.imageClasses ? item?.imageClasses : ""
            }   `}
          />
        </Editable>
      </Link>
    </div>
  );
};

export default HomeBannerPart;
