"use client";
import PopSearchbox from "@/components/SearchBoxComp/PopSearchbox";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const HomeSearchPart = () => {
  return (
    <div className="w-full px-4 py-1 flex md:hidden">
      <PopSearchbox
        boxId={"HOME_SEARCH_BOX"}
        placeholder={_STRINGS?.SEARCH_CITY_OR_ADD}
        onSubmit={() => {}}
        onClear={() => {
          // setsearchText("");
          // router.replace(pathname);
        }}
        item={{ bg: `!bg-white/70 !border  ` }}
        // autofocus={isInSearch}
      />
    </div>
  );
};

export default HomeSearchPart;
