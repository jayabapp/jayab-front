"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { parseIdList } from "@features/cities/lib/city-selection";
import { useCallback } from "react";

import type { CitySelectorTitleProps } from "@/types/components/modules/city-selector";

import queryBuilder from "@/helpers/queryBuilder";
import RegionButton from "./RegionButton.client";
import isEmpty from "lodash/isEmpty";

const CitySelectorTitle = ({
  cb,
  title,
  queries,
  hideCityPart,
  setShowRegions,
  cityWithRegions,
}: CitySelectorTitleProps) => {
  const t = useTranslations("header");

  const pathname = usePathname();
  const router = useRouter();
  const regionsIds = parseIdList(queries?.regions);

  const clearRegions = useCallback(() => {
    const body = { ...queries };
    delete body.regions;
    delete body.page;
    router.replace(`${pathname}?${queryBuilder(body)}`);
  }, [pathname, queries, router]);

  return (
    <div
      onClick={hideCityPart ? undefined : cb}
      className="shrink-0 cursor-pointer text-sm md:text-base w-fit flex items-center gap-2"
    >
      {hideCityPart ? null : (
        <>
          <ContentImage
            alt=""
            width={16}
            height={16}
            src="/assets/icons/adds/pin_point_location.svg"
          />
          <p className="shrink-0">{title || t("chooseCity")}</p>
          {title ? (
            <ContentImage
              alt=""
              width={16}
              height={16}
              className="w-4 h-4"
              src="/assets/icons/addresses/orange_edit_pen.svg"
            />
          ) : null}
        </>
      )}

      {isEmpty(cityWithRegions?.child) ? null : (
        <RegionButton
          regionsIds={regionsIds}
          onClearRegions={clearRegions}
          setShowRegions={setShowRegions}
          containerClass="hidden lg:flex"
        />
      )}
    </div>
  );
};

export default CitySelectorTitle;
