"use client";
import Editable from "@/components/Editable";
import HomePopSearch from "@/components/SearchBoxComp/HomePopSearch";
import SearchBoxDropDown from "@/components/SearchBoxComp/SearchBoxDropDown";
import { DeviceInfo } from "@/helpers/device.detector";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { random } from "lodash";
import Image from "next/image";
import { Suspense, useState } from "react";
import HomeCityFilterCityPart from "../HomeCityFilterContainer/HomeCityFilterCityPart";

type ImageCarouselTypes = {
  banners?: any[];
  devices?: DeviceInfo;
};

const HomeBannerPart = ({ banners, devices }: ImageCarouselTypes) => {
  const randomeNumber = random(0, (banners?.length || 1) - 1, false);
  const item = banners?.[Math.floor(randomeNumber)];
  const [showPop, setShowPop] = useState(false);
  return (
    <div
      className={`
  
    relative
       w-full h-full  md:gap-3 lg:grid-cols-3  px-0  `}
    >
      {/* HOME TITLE PART */}
      <div className="w-full extra-padding-x  lg:!px-[28%] flex absolute m-auto left-0 right-0  bottom-[35%] lg:bottom-[30%] flex-col   z-10 lg:z-1  gap-20">
        <div className="flex z-5 !gap-2 lg:!gap-4 items-center justify-center flex-col">
          <img className=" !w-24 lg:!w-40" src="/assets/images/home/home_banner_logo.png" />
          <h1 className="text-white font-bold !text-sm lg:!text-lg  text-center">{_STRINGS.HOME_TITLE}</h1>
        </div>
      </div>

      {/* HOME SEARCH PART  */}
      <div className=" flex backdrop-blur-md   shadow-card lg:shadow-none  lg:backdrop-blur-none  z-5   absolute bottom-0   lg:bottom-[12%]  w-[90%] lg:w-[40%]   left-0 right-0     mx-auto    h-11   lg:h-14 lg:bg-white rounded-full items-center  gap-1 lg:gap-2    p-[1px]   lg:pl-4">
        <SearchBoxDropDown
          placeholder={_STRINGS?.SEARCH}
          containerClass="bg-transparent border   rounded-full lg:flex hidden    w-full dark:bg-zinc-600   justify-between items-center  !bg-white lg:bg-transparent !rounded-l-none  lg:!rounded-l-20  !border-none "
        />

        <div
          onClick={() => {
            setShowPop(true);
          }}
          className={`bg-transparent border  lg:hidden rounded-20  px-4 py-1.5  overflow-hidden w-full dark:bg-zinc-600  flex justify-between items-center  !bg-white lg:bg-transparent !rounded-l-none  lg:!rounded-l-20  !border-none `}
        >
          {" "}
          <div className="flex items-center gap-1 w-full">
            {/* <div className="">
              <img src="/assets/icons/edit/magnifier.svg" width={20} className="dark:invert" height={20} />
            </div> */}
            <div
              id={"HOME_SEARCH_BOX"}
              className={`bg-transparent text-sm  dark:bg-transparent py-1 pl-3 pr-0.5  w-full opacity-50  `}
              // onChange={(v) => handleChange(v.target.value)}
            >
              {" "}
              {_STRINGS?.SEARCH}{" "}
            </div>
          </div>{" "}
        </div>

        <div className="w-[1px] h-8 bg-gray-300 lg:flex hidden"></div>
        <HomeCityFilterCityPart
          isHome
          options={{
            cotainerClass:
              " h-10  px-2 shrink-0  w-fit  rounded-l-20 lg:rounded-l-0 lg:px-0  justify-between  bg-white   lg:h-auto lg:bg-transparent",
          }}
        />
      </div>
      <Suspense>
        <HomePopSearch
          setShowPop={setShowPop}
          showPop={showPop}
          boxId={"HOME_SEARCH_BOX"}
          placeholder={_STRINGS?.SEARCH}
          onSubmit={() => {}}
          onClear={() => {
            // setsearchText("");
            // router.replace(pathname);
          }}
          containerClass={" w-full mx-auto"}
          item={{ bg: `` }}
          // autofocus={isInSearch}
        />
      </Suspense>
      <div aria-label={item?.image?.alt || item?.title}>
        {" "}
        <Editable
          editIconClass=" !top-auto  !bottom-0"
          isBanner
          contentId={item?.id}
          // // href={item?.link ? item?.link : undefined}
          // target={item?.link ? "_blank" : ""}
          className={` focus:outline-none w-full px-0  aspect-[1.5] max-h-[60dvh]  md:aspect-[3.029]   ${
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
            className={`w-full object-cover  hidden  md:flex aspect-[1.5] md:aspect-[3.029]   align-middle  ${
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
            className={`w-full object-cover  flex  md:hidden aspect-[1.5]  md:aspect-[3.029] align-middle  ${
              item?.imageClasses ? item?.imageClasses : ""
            }   `}
          />
        </Editable>
      </div>
    </div>
  );
};

export default HomeBannerPart;
