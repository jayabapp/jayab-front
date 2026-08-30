"use client";

import type { PropertyLocationRowProps } from "@/types/components/modules/property-details";
import { ContentImage } from "@elements/Image";
import { useState } from "react";

import PropertyMapModal from "./PropertyMapModal.client";
import _STRINGS from "@/utils/LocalStrings";

const PropertyLocationRow = ({
  latitude,
  longitude,
}: PropertyLocationRowProps) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowMap(true)}
        className="cursor-pointer border border-neutral-300 rounded-10 px-4 py-3 flex items-center justify-between"
      >
        <span className="font-medium bg-white text-sm md:text-base !mt-0 rounded-10 w-full text-right">
          {_STRINGS.COORDINATES}
        </span>
        <ContentImage
          alt=""
          width={16}
          height={16}
          src="/assets/icons/shared/chevron.svg"
          className="object-contain transition-all w-4 aspect-square"
        />
      </button>
      {showMap ? (
        <PropertyMapModal
          show={showMap}
          latitude={latitude}
          longitude={longitude}
          onHide={() => setShowMap(false)}
        />
      ) : null}
    </>
  );
};

export default PropertyLocationRow;
