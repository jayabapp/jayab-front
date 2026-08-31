"use client";

import type { AdvisorSearchBarProps } from "@/types/components/modules/advisors";
import { CityModal } from "@modules/CitySelector";
import { Suspense, useState } from "react";

import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";

const SearchInput = dynamic(() =>
  import("@modules/Search").then((module) => module.SearchInput),
);

const AdvisorSearchBar = ({
  onFilter,
  cityTitle,
  onCityTitleChange,
}: AdvisorSearchBarProps) => {
  const [showCityModal, setShowCityModal] = useState(false);

  return (
    <>
      <Suspense>
        <SearchInput
          containerClass=" w-full"
          passedQuerykey="search"
          boxId="ADVISOR_SEARCH"
          placeholder={_STRINGS.ADVISOR_SEARCH_PLACEHOLDER}
          onClear={() => onFilter("", "search")}
          onSubmit={(value) => onFilter(value || "", "search")}
        >
          <button
            type="button"
            onClick={() => setShowCityModal(true)}
            className="w-3/4 md:w-1/2 z-2 cursor-pointer justify-end flex items-center gap-2"
          >
            <p className="text-3xl text-neutral-200">|</p>
            <p className="text-xs min-w-12">
              {cityTitle
                ? cityTitle.replace(_STRINGS.SEARCH_IN_PREFIX, "")
                : _STRINGS.CITY}
            </p>
          </button>
        </SearchInput>
      </Suspense>

      <CityModal
        show={showCityModal}
        setTitle={onCityTitleChange}
        onHide={() => setShowCityModal(false)}
      />
    </>
  );
};

export default AdvisorSearchBar;
