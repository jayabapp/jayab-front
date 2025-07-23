"use client";
import { SinglePropDto } from "@/api_services/property/property.interface";
import _STRINGS from "@/utils/LocalStrings";
import React, { useState } from "react";

import PropertTermsModal from "./PropertTermsModal";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import Notify from "@/components/shared/Toast";
import { random } from "lodash";

const ReportRoom = ({ data }: { data: SinglePropDto }) => {
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const onHideMap = () => {
    setShowReport(false);
  };
  const onConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setShowReport(false);
      setLoading(false);
      Notify({ body: "گزارش با موفقیت ثبت شد.", type: "success" });
    }, random(1, 3) * 1000);
  };
  const onShowMap = () => {
    setShowReport(true);
  };
  return (
    <>
      <div
        onClick={onShowMap}
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
      {!!showReport ? (
        <ConfirmModal
          confirmTextClassName=" !bg-red-500"
          isLoading={loading}
          options={{ inputTitle: "متن گزارش ", hasInput: true }}
          confirmText="ثبت گرازش"
          onConfirm={onConfirm}
          text="گزارش خود را ثبت کنید"
          onHide={onHideMap}
          isVisible={showReport}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default ReportRoom;
