"use client";

import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { CityModal } from "@modules/CitySelector";

import type { AdvisorSearchBarProps } from "@/types/components/modules/advisors";

import dynamic from "next/dynamic";

const SearchInput = dynamic(() =>
  import("@modules/Search").then((module) => module.SearchInput),
);

const AdvisorSearchBar = ({
  onFilter,
  cityTitle,
  onCityTitleChange,
}: AdvisorSearchBarProps) => {
  const t = useTranslations();

  const [showCityModal, setShowCityModal] = useState(false);

  return (
    <>
      <Suspense>
        <SearchInput
          boxId="ADVISOR_SEARCH"
          passedQuerykey="search"
          containerClass=" w-full"
          onClear={() => onFilter("", "search")}
          placeholder={t("advisor.advisorSearchPlaceholder")}
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
                ? cityTitle.replace(t("advisor.searchInPrefix"), "")
                : t("common.city")}
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
