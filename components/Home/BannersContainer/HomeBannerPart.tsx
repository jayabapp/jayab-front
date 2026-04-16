"use client";
import Editable from "@/components/Editable";
import PopSearchbox from "@/components/SearchBoxComp/PopSearchbox";
import { DeviceInfo } from "@/helpers/device.detector";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { random } from "lodash";
import Image from "next/image";
import { Suspense } from "react";
import HomeCityFilterCityPart from "../HomeCityFilterContainer/HomeCityFilterCityPart";

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
  
    relative
       w-full h-full  md:gap-3 lg:grid-cols-3  px-0  `}
    >
      {/* HOME SEARCH PART  */}

      <div className="w-full extra-padding-x  lg:!px-[28%] flex absolute m-auto left-0 right-0  bottom-[25%] lg:bottom-[40%] flex-col   z-20  gap-20">
        <div className="flex z-5 gap-4 items-center justify-center flex-col">
          <img className="w-40" src="/assets/images/home/home_banner_logo.png" />
          <h1 className="text-white font-bold text-lg text-center">{_STRINGS.HOME_TITLE}</h1>
        </div>
        <div className=" hidden md:flex   h-14 bg-white rounded-full items-center gap-2  pl-4">
          <Suspense>
            <PopSearchbox
              boxId={"HOME_SEARCH_BOX"}
              placeholder={_STRINGS?.SEARCH_CITY_OR_ADD}
              onSubmit={() => {}}
              onClear={() => {
                // setsearchText("");
                // router.replace(pathname);
              }}
              containerClass={" w-full mx-auto"}
              item={{ bg: `!bg-transparent  !border-none ` }}
              // autofocus={isInSearch}
            />
          </Suspense>
          <div className="w-[1px] h-12 bg-gray-300"></div>
          <HomeCityFilterCityPart />
        </div>
      </div>

      <div aria-label={item?.image?.alt || item?.title}>
        {" "}
        <Editable
          editIconClass=" !top-auto  !bottom-0"
          isBanner
          contentId={item?.id}
          // // href={item?.link ? item?.link : undefined}
          // target={item?.link ? "_blank" : ""}
          className={` focus:outline-none w-full px-0  aspect-[1.5]  md:aspect-[3]   ${
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
            className={`w-full object-cover  hidden  md:flex aspect-[1.5] md:aspect-[3]   align-middle  ${
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
            className={`w-full object-cover  flex  md:hidden aspect-[1.5]  md:aspect-[3] align-middle  ${
              item?.imageClasses ? item?.imageClasses : ""
            }   `}
          />
        </Editable>
      </div>
    </div>
  );
};

export default HomeBannerPart;
