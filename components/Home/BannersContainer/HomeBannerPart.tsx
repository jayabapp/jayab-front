"use client";

import { Suspense, useState } from "react";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { DeviceInfo } from "@/helpers/device.detector";
import { random } from "lodash";

import Editable from "@/components/Editable";
import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";
import Image from "next/image";

const SearchBoxDropDown = dynamic(
  () => import("@/components/SearchBoxComp/SearchBoxDropDown"),
);
const HomePopSearch = dynamic(
  () => import("@/components/SearchBoxComp/HomePopSearch"),
);
const HomeCityFilterCityPart = dynamic(
  () => import("../HomeCityFilterContainer/HomeCityFilterCityPart"),
);

type ImageCarouselTypes = {
  banners?: any[];
  devices?: DeviceInfo;
  title?: string;
};

const HomeBannerPart = ({ banners, devices, title }: ImageCarouselTypes) => {
  const randomeNumber = random(0, (banners?.length || 1) - 1, false);
  const item = banners?.[Math.floor(randomeNumber)];
  const [showPop, setShowPop] = useState(false);
  const isPhone = !!devices?.isMobile;
  return (
    <div
      className={`
  
    relative
       w-full h-full  md:gap-3 lg:grid-cols-3  px-0  `}
    >
      {/* HOME TITLE PART */}
      <div className="w-full extra-padding-x  lg:!px-[28%] flex absolute m-auto left-0 right-0  bottom-[35%] lg:bottom-[30%] flex-col   z-10 lg:z-1  gap-20">
        <div className="flex z-5 !gap-2 lg:!gap-4 items-center justify-center flex-col">
          <Image
            width={320}
            height={166}
            alt={_STRINGS.HOME_TITLE}
            className=" !w-24 lg:!w-40 h-auto"
            sizes="(max-width: 1024px) 96px, 160px"
            src="/assets/images/home/home_banner_logo.webp"
          />
          <h2 className="text-white font-bold !text-sm lg:!text-lg  text-center">
            {title || _STRINGS.HOME_TITLE}
          </h2>
        </div>
      </div>

      {/* HOME SEARCH PART  */}
      <div className=" flex backdrop-blur-md   shadow-card lg:shadow-none  lg:backdrop-blur-none  z-5   absolute bottom-0   lg:bottom-[12%]  w-[90%] lg:w-[40%]   left-0 right-0     mx-auto    h-11   lg:h-14 lg:bg-white rounded-full items-center  gap-1 lg:gap-2    p-[1px]   lg:pl-4">
        <Suspense>
          {" "}
          <SearchBoxDropDown
            placeholder={_STRINGS?.SEARCH}
            containerClass="bg-transparent border   rounded-full lg:flex hidden    w-full dark:bg-zinc-600   justify-between items-center  !bg-white lg:bg-transparent !rounded-l-none  lg:!rounded-l-20  !border-none "
          />
        </Suspense>

        <div
          onClick={() => {
            setShowPop(true);
          }}
          className={`bg-transparent border  lg:hidden rounded-20  px-4 py-1.5  overflow-hidden w-full dark:bg-zinc-600  flex justify-between items-center  !bg-white lg:bg-transparent !rounded-l-none  lg:!rounded-l-20  !border-none `}
        >
          {" "}
          <div className="flex items-center gap-1 w-full">
            <div
              id={"HOME_SEARCH_BOX"}
              className={`bg-transparent text-sm  dark:bg-transparent py-1 pl-3 pr-0.5  w-full opacity-50  `}
            >
              {_STRINGS?.SEARCH}
            </div>
          </div>{" "}
        </div>

        <div className="w-[1px] h-8 bg-gray-300 lg:flex hidden"></div>
        <Suspense>
          {" "}
          <HomeCityFilterCityPart
            isHome
            options={{
              cotainerClass:
                " h-10  px-2 shrink-0  w-fit  rounded-l-20 lg:rounded-l-0 lg:px-0  justify-between  bg-white   lg:h-auto lg:bg-transparent",
            }}
          />
        </Suspense>
      </div>
      <Suspense>
        <HomePopSearch
          showPop={showPop}
          item={{ bg: `` }}
          onClear={() => {}}
          onSubmit={() => {}}
          setShowPop={setShowPop}
          boxId={"HOME_SEARCH_BOX"}
          placeholder={_STRINGS?.SEARCH}
          containerClass={" w-full mx-auto"}
        />
      </Suspense>
      <div aria-label={item?.image?.alt || item?.title}>
        {" "}
        <Editable
          editIconClass=" !top-auto  !bottom-0"
          isBanner
          contentId={item?.id}
          className={` focus:outline-none w-full px-0  aspect-[1.5] max-h-[60dvh]  md:aspect-[3.029] 
           transition-all duration-300 ease-in-out   relative`}
        >
          {isPhone ? (
            <Image
              fill
              priority
              sizes="100vw"
              fetchPriority="high"
              alt={item?.image?.alt}
              src={NEW_IMAGE_URL(item?.image_sm ? item?.image_sm : item?.image)}
              className={`w-full object-cover  flex  aspect-[1.5] align-middle  ${
                item?.imageClasses ? item?.imageClasses : ""
              }   `}
            />
          ) : (
            <Image
              fill
              priority
              sizes="100vw"
              fetchPriority="high"
              alt={item?.image?.alt}
              src={NEW_IMAGE_URL(item?.image)}
              className={`w-full object-cover  flex aspect-[3.029]   align-middle  ${
                item?.imageClasses ? item?.imageClasses : ""
              }   `}
            />
          )}
        </Editable>
      </div>
    </div>
  );
};

export default HomeBannerPart;
