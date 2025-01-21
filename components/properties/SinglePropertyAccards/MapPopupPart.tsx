"use client";
import { SinglePropDto } from "@/api_services/property/property.interface";
import _STRINGS from "@/utils/LocalStrings";
import React, { useMemo, useState } from "react";
import PropertyMapPopModal from "./PropertyMapPopModal";
import dynamic from "next/dynamic";

const MapPopupPart = ({ data }: { data: SinglePropDto }) => {
  const [showMap, setShowMap] = useState(false);

  const onHideMap = () => {
    setShowMap(false);
  };
  const onShowMap = () => {
    setShowMap(true);
  };
  return (
    <>
      <div
        onClick={onShowMap}
        className="  cursor-pointer border border-gray-300 rounded-10  px-4 py-2.5 flex items-center justify-between"
      >
        <p className="font-bold bg-white  text-xs  md:text-sm !mt-0  rounded-10 w-full ">{_STRINGS.COORDINATES}</p>
        <img
          src="/assets/icons/shared/chevron.svg"
          className={` object-contain transition-all   w-4 aspect-square  `}
        />
      </div>
      {!!showMap ? <PropertyMapPopModal onHide={onHideMap} show={showMap} data={data} /> : <></>}
    </>
  );
};

export default MapPopupPart;
