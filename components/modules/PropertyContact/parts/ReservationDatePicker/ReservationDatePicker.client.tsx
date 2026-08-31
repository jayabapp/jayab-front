"use client";

import type { TReservationDatePickerProps } from "@/types/components/modules/reservation-date-picker";
import { useState } from "react";

import ReservationDateModal from "./ReservationDateModal.client";
import _STRINGS from "@/utils/LocalStrings";
import Notify from "@elements/Toast";
import moment from "moment-jalaali";

const ReservationDatePicker = ({
  dates,
  setDates,
  forbiden_dates,
  endTitle = _STRINGS.EXIT_DATE,
  startTitle = _STRINGS.START_DATE,
}: TReservationDatePickerProps) => {
  const [show, setShow] = useState(false);
  const onHide = () => {
    setShow(false);
  };
  const onShowCalender = () => {
    setShow(true);
  };

  const START_TITLE = !!dates?.start
    ? moment(dates?.start).format("jYYYY/jMM/jDD")
    : startTitle;
  const END_TITLE = !!dates?.start
    ? moment(dates?.end).format("jYYYY/jMM/jDD")
    : endTitle;

  const onConfirmDate = (e: any) => {
    if (!e?.start || !e?.end)
      return Notify({ body: `${startTitle} و ${endTitle} را انتخاب کنید.` });

    setDates(e);
    onHide();
  };
  return (
    <>
      <div className="flex w-full items-center justify-between gap-2">
        <div
          onClick={onShowCalender}
          className=" w-full  border px-2  h-12  cursor-pointer relative flex items-center justify-center  rounded-10     "
        >
          <div className="flex flex-col ">
            <p
              className={`text-center text-sm ${!!dates ? " font-medium " : " opacity-50"} `}
            >
              {START_TITLE}
            </p>
          </div>
        </div>
        <div
          onClick={onShowCalender}
          className=" w-full  border px-2  h-12  cursor-pointer relative flex items-center justify-center  rounded-10     "
        >
          <div className="flex flex-col ">
            <p
              className={`text-center text-sm ${!!dates ? " font-medium " : " opacity-50"} `}
            >
              {END_TITLE}
            </p>
          </div>
        </div>
      </div>
      <ReservationDateModal
        show={show}
        onHide={onHide}
        onConfirm={onConfirmDate}
        forbiden_dates={forbiden_dates}
      />
    </>
  );
};

export default ReservationDatePicker;
