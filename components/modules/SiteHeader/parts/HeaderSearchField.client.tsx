"use client";

import { HomeCitySelector } from "@modules/HomeCities";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

import type { HeaderSearchFieldProps } from "@/types/components/modules/site-header";

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
  const t = useTranslations("header");
  const field = (
    <Suspense>
      <PopSearchBox
        boxId={boxId}
        justIcon={justIcon}
        item={{ bg: inputClass ?? "" }}
        placeholder={t("searchPlaceholder")}
        containerClass={withCitySelector ? " w-full mx-auto" : containerClass}
      />
    </Suspense>
  );

  if (!withCitySelector) return field;

  return (
    <div
      className={`flex w-full border bg-surface rounded-full items-center gap-2 pl-4 ${containerClass ?? ""}`}
    >
      {field}
      <div className="w-[1px] h-8 bg-line-strong" />
      <HomeCitySelector />
    </div>
  );
};

export default HeaderSearchField;
