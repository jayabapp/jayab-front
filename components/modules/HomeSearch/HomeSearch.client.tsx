"use client";
import { HomeCitySelector } from "@modules/HomeCities";

import { PopSearchBox } from "@modules/Search";
import _STRINGS from "@/utils/LocalStrings";

const HomeSearchPart = () => {
  return (
    <div className=" flex backdrop-blur-md    lg:backdrop-blur-none      w-[90%]  mx-auto  shadow-card   lg:h-14 lg:bg-white rounded-full items-center  gap-1 lg:gap-2    p-[1px]   lg:pl-4">
      <PopSearchBox
        boxId={"HOME_SEARCH_BOX"}
        placeholder={_STRINGS?.SEARCH}
        onSubmit={() => {}}
        onClear={() => {
          // setsearchText("");
          // router.replace(pathname);
        }}
        containerClass={" w-full mx-auto"}
        item={{ bg: `!bg-white lg:bg-transparent !rounded-l-none  lg:!rounded-l-20  !border-none ` }}
        // autofocus={isInSearch}
      />
      <div className="w-[1px] h-8 bg-neutral-300 lg:flex hidden"></div>
      <HomeCitySelector
        options={{
          cotainerClass: " h-10  px-2  rounded-l-20 lg:rounded-l-0 lg:px-0   bg-white   lg:h-auto lg:bg-transparent",
        }}
      />
    </div>
  );
};

export default HomeSearchPart;
