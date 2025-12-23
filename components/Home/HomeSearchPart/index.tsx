"use client";
import PopSearchbox from "@/components/SearchBoxComp/PopSearchbox";
import _STRINGS from "@/utils/LocalStrings";
import { Suspense } from "react";

const HomeSearchPart = () => {
  return (
    <div className="w-full px-4 py-1 flex lg:hidden">
      <Suspense>
        <PopSearchbox
          boxId={"HOME_SEARCH_BOX"}
          placeholder={_STRINGS?.SEARCH_CITY_OR_ADD}
          onSubmit={() => {}}
          onClear={() => {
            // setsearchText("");
            // router.replace(pathname);
          }}
          item={{ bg: `!bg-white/70 !border-2  !py-1.5 !border-primary-200  !rounded-full ` }}
          // autofocus={isInSearch}
        />
      </Suspense>
    </div>
  );
};

export default HomeSearchPart;
