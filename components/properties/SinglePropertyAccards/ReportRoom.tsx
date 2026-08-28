"use client";

import { SinglePropDto } from "@/api_services/property/property.interface";
import { useState } from "react";

import ReportPop from "./ReportPop";
import _STRINGS from "@/utils/LocalStrings";

const ReportRoom = ({ data }: { data: SinglePropDto }) => {
  const [show, setShow] = useState(false);

  const onShowReport = () => {
    setShow(true);
  };

  return (
    <>
      <div
        onClick={onShowReport}
        className="  cursor-pointer border border-neutral-300 rounded-10  px-4 py-3 flex items-center justify-between"
      >
        <p className=" text-red-500 bg-white  text-sm lg:text-base font-medium  !mt-0  rounded-10 w-full ">
          {_STRINGS.REPORT_WRONG}
        </p>
        <img
          src="/assets/icons/shared/chevron.svg"
          className={` object-contain transition-all   w-4 aspect-square  `}
        />
      </div>
      {!!show ? (
        <ReportPop postId={data?.id} setShow={setShow} show={show} />
      ) : (
        <></>
      )}
    </>
  );
};

export default ReportRoom;
