import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const OwnerCallemdarGuide = ({ isAdvisor }: { isAdvisor?: boolean }) => {
  return (
    <div className=" w-full flex flex-wrap gap-y-1 gap-x-5">
      <div className="flex text-primary-800 text-sm items-center gap-2 ">
        <div className="w-5 h-5 striped !bg-gray-200   rounded-md"></div>
        <p className=" text-xs md:text-sm">{_STRINGS.RESERVED_DAYS}</p>
      </div>
      {/*  ///////////////// */}
      {/* <div className="flex text-primary-800 text-sm items-center gap-2 ">
        <div className="w-3.5 h-3.5 bg-primary-50 rounded-full"></div>
        <p>{_STRINGS.EMPTY_DAYS}</p>
      </div> */}
      {/* /////////////////// */}
      <div className="flex text-primary-800 text-sm items-center gap-2 ">
        <div className="w-3.5 h-0.5 bg-primary-900 rounded-full"></div>
        <p className=" text-xs md:text-sm">{_STRINGS.PEAK_DAYS}</p>
      </div>
      {/* /////////////////// */}
      {!!isAdvisor ? (
        <></>
      ) : (
        <div className="flex text-primary-800 text-sm items-center gap-2 ">
          <div className="w-1 h-1 bg-primary-700 rounded-full"></div>
          <p className=" text-xs md:text-sm">{_STRINGS.MEMO_DAYS}</p>
        </div>
      )}
    </div>
  );
};

export default OwnerCallemdarGuide;
