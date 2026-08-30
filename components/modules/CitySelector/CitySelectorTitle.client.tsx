"use client";

import type { CitySelectorTitleProps } from "@/types/components/modules/city-selector";
import { parseIdList } from "@features/cities/lib/city-selection";
import { usePathname, useRouter } from "next/navigation";
import { ContentImage } from "@elements/Image";
import { useCallback } from "react";

import queryBuilder from "@/helpers/queryBuilder";
import RegionButton from "./RegionButton.client";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

/** The "choose a city" trigger shown above the property results, plus its region shortcut. */
const CitySelectorTitle = ({
  cb,
  cityWithRegions,
  hideCityPart,
  queries,
  setShowRegions,
  title,
}: CitySelectorTitleProps) => {
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
          <p className="shrink-0">{title || _STRINGS.SELECT_CITY}</p>
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
          containerClass="hidden lg:flex"
          onClearRegions={clearRegions}
          setShowRegions={setShowRegions}
        />
      )}
    </div>
  );
};

export default CitySelectorTitle;
