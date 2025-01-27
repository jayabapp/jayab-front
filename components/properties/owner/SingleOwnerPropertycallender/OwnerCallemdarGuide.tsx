import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const OwnerCallemdarGuide = () => {
  return (
    <div className=" w-full flex flex-wrap gap-y-1 gap-x-5">
      <div className="flex text-primary-800 text-sm items-center gap-2 ">
        <div className="w-3.5 h-3.5 bg-primary-800 rounded-full"></div>
        <p>{_STRINGS.RESERVED_DAYS}</p>
      </div>
      {/*  ///////////////// */}
      <div className="flex text-primary-800 text-sm items-center gap-2 ">
        <div className="w-3.5 h-3.5 bg-primary-50 rounded-full"></div>
        <p>{_STRINGS.EMPTY_DAYS}</p>
      </div>
      {/* /////////////////// */}
      <div className="flex text-primary-800 text-sm items-center gap-2 ">
        <div className="w-3.5 h-0.5 bg-primary-900 rounded-full"></div>
        <p>{_STRINGS.PEAK_DAYS}</p>
      </div>
      {/* /////////////////// */}
      <div className="flex text-primary-800 text-sm items-center gap-2 ">
        <div className="w-1 h-1 bg-primary-700 rounded-full"></div>
        <p>{_STRINGS.MEMO_DAYS}</p>
      </div>
    </div>
  );
};

export default OwnerCallemdarGuide;
