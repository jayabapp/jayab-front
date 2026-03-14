"use client";
import { SinglePropDto } from "@/api_services/property/property.interface";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import Button from "@/components/shared/Button/Button";
import SinglePopUpSelect from "@/components/shared/Form/SingleSelectPopUpSelect";
import Notify from "@/components/shared/Toast";
import DatePickerModal from "@/components/widgets/DatePicker/DatePickerModal";
import _STRINGS from "@/utils/LocalStrings";
import { useState } from "react";
import SinglePropRequestedReserveModal from "./SinglePropRequestedReserveModal";

const SinglePropReservePop = ({
  data,
  show,
  onHide,
}: {
  data: SinglePropDto;
  show: boolean;
  onHide: () => void | null;
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [count, setCount] = useState<number | string>("");
  const [showReserveReq, setShowReserveReq] = useState(false);
  const countList = [
    ...Array.from({ length: data?.max_capacity }, (_, idx) => ({ id: `${idx + 1}`, title: `${idx + 1}` })),
    { id: `${data?.max_capacity}+`, title: `${data?.max_capacity}+` },
  ];

  const onReserveClick = () => {
    if (!endDate || !startDate) {
      Notify({ body: "تاریخ ورود و خروج را انتخاب کنید.", type: "warn" });
    } else if (!count) {
      Notify({ body: `تعداد نفرات را مشخص کنید.`, type: "warn" });
    } else {
      onHide();
      setShowReserveReq(true);
    }
  };

  const onCloseReserveReq = () => {
    onHide();
    setShowReserveReq(false);
    setCount("");
    setEndDate("");
    setStartDate("");
  };
  return (
    <>
      <ModalBottomSheet
        options={{
          containerClass: `mx-auto rounded-t-20 absolute pb-[1.5rem] md:pb-4 bottom-0 md:translate-x-1/2 md:right-1/2 w-full md:w-[calc(35svw)]  bg-white dark:bg-zinc-900 overflow-y-scroll  dark:bg-dark-700`,
        }}
        onHide={onHide}
        show={show}
      >
        <ModalHeaderPart hideArrow title={_STRINGS.RESERVE} onHide={onHide} />
        <div className=" flex flex-col gap-4  p-4">
          {/* DATES */}
          <div className="w-full flex flex-col gap-2">
            <p className=" ">{_STRINGS.TRIP_DATE}</p>

            <div className="flex w-full items-center justify-between gap-4">
              <DatePickerModal title={_STRINGS.START_DATE} date={startDate} setDate={setStartDate} />
              <DatePickerModal title={_STRINGS.EXIT_DATE} date={endDate} setDate={setEndDate} />
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <p className=" ">{_STRINGS.PPL_COUNT}</p>
            <SinglePopUpSelect
              onSelect={setCount}
              value={count}
              item={{ list: countList, placeholder: `${_STRINGS.PPL_COUNT} مشخص کنید` }}
              closeOnSelect
            />
          </div>

          <Button
            onClick={onReserveClick}
            width="w-full"
            containerClass="w-full items-center  justify-center"
            roundedClass="rounded-full"
            title={_STRINGS.SUBMIT}
          />
        </div>
      </ModalBottomSheet>
      <SinglePropRequestedReserveModal
        count={count}
        onHide={onCloseReserveReq}
        show={showReserveReq}
        startDate={startDate}
        data={data}
        endDate={endDate}
      />
    </>
  );
};

export default SinglePropReservePop;
