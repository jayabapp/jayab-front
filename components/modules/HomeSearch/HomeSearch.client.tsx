"use client";

import { HomeCitySelector } from "@modules/HomeCities";
import { useTranslations } from "next-intl";
import { PopSearchBox } from "@modules/Search";

const HomeSearchPart = () => {
  const t = useTranslations("search");

  return (
    <div className=" flex backdrop-blur-md lg:backdrop-blur-none w-[90%] mx-auto shadow-card lg:h-14 lg:bg-white rounded-full items-center  gap-1 lg:gap-2 p-[1px] lg:pl-4">
      <PopSearchBox
        onClear={() => {}}
        onSubmit={() => {}}
        boxId={"HOME_SEARCH_BOX"}
        placeholder={t("search")}
        containerClass={" w-full mx-auto"}
        item={{ bg: `!bg-white lg:bg-transparent !rounded-l-none lg:!rounded-l-20 !border-none `}}
      />
      <div className="w-[1px] h-8 bg-neutral-300 lg:flex hidden"></div>
      <HomeCitySelector
        options={{
          cotainerClass: "h-10 px-2 rounded-l-20 lg:rounded-l-0 lg:px-0 bg-white lg:h-auto lg:bg-transparent",
        }}
      />
    </div>
  );
};

export default HomeSearchPart;
