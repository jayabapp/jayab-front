"use client";
import { SinglePropDto } from "@/api_services/property/property.interface";
import _STRINGS from "@/utils/LocalStrings";
import { useState } from "react";

import { PropertyService } from "@/api_services/property/property.service";
import { useMutation } from "@tanstack/react-query";
import ReportPop from "./ReportPop";

const ReportRoom = ({ data }: { data: SinglePropDto }) => {
  // const [reportTitle, setReportTitle] = useState("");
  // const [report, setReport] = useState("");
  const [show, setShow] = useState(false);

  const onHide = () => {
    setShow(false);

    // setReport("");
    // setReportTitle("");
  };

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.reportPost,
    onSuccess: () => {
      onHide();
    },
  });

  // const onSubmit = () => {
  //   mutate({ description: report, title: reportTitle, post_id: data?.id });
  // };

  const onShowReport = () => {
    setShow(true);
  };

  return (
    <>
      <div
        onClick={onShowReport}
        className="  cursor-pointer border border-gray-300 rounded-10  px-4 py-3 flex items-center justify-between"
      >
        <p className=" text-red-500 bg-white  text-sm lg:text-base font-medium  !mt-0  rounded-10 w-full ">
          {_STRINGS.REPORT_WRONG}
        </p>
        <img
          src="/assets/icons/shared/chevron.svg"
          className={` object-contain transition-all   w-4 aspect-square  `}
        />
      </div>
      {!!show ? <ReportPop postId={data?.id} setShow={setShow} show={show} /> : <></>}
    </>
  );
};

export default ReportRoom;
