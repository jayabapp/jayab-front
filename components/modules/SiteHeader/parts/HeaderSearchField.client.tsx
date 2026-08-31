"use client";

import type { HeaderSearchFieldProps } from "@/types/components/modules/site-header";
import { HomeCitySelector } from "@modules/HomeCities";
import { Suspense } from "react";

import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";

const PopSearchBox = dynamic(() =>
  import("@modules/Search").then((module) => module.PopSearchBox),
);

const HeaderSearchField = ({
  boxId,
  justIcon,
  inputClass,
  containerClass,
  withCitySelector,
}: HeaderSearchFieldProps) => {
  const field = (
    <Suspense>
      <PopSearchBox
        boxId={boxId}
        justIcon={justIcon}
        placeholder={_STRINGS?.SEARCH}
        item={{ bg: inputClass ?? "" }}
        containerClass={withCitySelector ? " w-full mx-auto" : containerClass}
      />
    </Suspense>
  );

  if (!withCitySelector) return field;

  return (
    <div
      className={`flex w-full border bg-white rounded-full items-center gap-2 pl-4 ${containerClass ?? ""}`}
    >
      {field}
      <div className="w-[1px] h-8 bg-neutral-300" />
      <HomeCitySelector />
    </div>
  );
};

export default HeaderSearchField;
