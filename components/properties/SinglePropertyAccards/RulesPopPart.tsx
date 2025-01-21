"use client";
import { SinglePropDto } from "@/api_services/property/property.interface";
import _STRINGS from "@/utils/LocalStrings";
import React, { useState } from "react";

import PropertTermsModal from "./PropertTermsModal";

const RulesPopPart = ({ data }: { data: SinglePropDto }) => {
  const [showRules, setShowRules] = useState(false);

  const onHideMap = () => {
    setShowRules(false);
  };
  const onShowMap = () => {
    setShowRules(true);
  };
  return (
    <>
      <div
        onClick={onShowMap}
        className="  cursor-pointer border border-gray-300 rounded-10  px-4 py-2.5 flex items-center justify-between"
      >
        <p className="font-bold bg-white  text-xs  md:text-sm !mt-0  rounded-10 w-full ">{_STRINGS.PROP_TERMS}</p>
        <img
          src="/assets/icons/shared/chevron.svg"
          className={` object-contain transition-all   w-4 aspect-square  `}
        />
      </div>
      {!!showRules ? <PropertTermsModal onHide={onHideMap} show={showRules} data={data} /> : <></>}
    </>
  );
};

export default RulesPopPart;
