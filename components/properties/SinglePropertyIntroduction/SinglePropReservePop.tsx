"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useReservationAvailability } from "@features/reservations/hooks/useReservationAvailability";
import { SinglePropDto } from "@/api_services/property/property.interface";

import SinglePropRequestedReserveModal from "./SinglePropRequestedReserveModal";
import SinglePopUpSelect from "@/components/shared/Form/SingleSelectPopUpSelect";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import DateSpanPicker from "@/components/widgets/UpdatedDatePicker/DateSpanPicker";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";
import moment from "moment-jalaali";

type TSinglePropReserveProps = {
  show: boolean;
  data: SinglePropDto;
  setShow: Dispatch<SetStateAction<boolean>>;
};

const SinglePropReservePop = ({
  data,
  show,
  setShow,
}: TSinglePropReserveProps) => {
  const [dates, setDates] = useState<{ start?: Date; end?: Date }>();
  const [count, setCount] = useState<number | string>("");
  const [showReserveReq, setShowReserveReq] = useState(false);
  const countList = [
    ...Array.from({ length: data?.max_capacity }, (_, idx) => ({
      id: `${idx + 1}`,
      title: `${idx + 1}`,
    })),
    {
      id: `${data?.max_capacity}+`,
      title: ` بیشتر از ${data?.max_capacity} نفر   `,
    },
  ];

  const onReserveClick = () => {
    if (!dates?.start || !dates?.end) {
      Notify({ body: "تاریخ ورود و خروج را انتخاب کنید.", type: "warn" });
    } else if (!count) {
      Notify({ body: `تعداد نفرات را مشخص کنید.`, type: "warn" });
    } else {
      setShow(false);
      setShowReserveReq(true);
    }
  };

  const onCloseReserveReq = () => {
    setShow(false);
    setShowReserveReq(false);
    setCount("");
    setDates({});
  };

  const checkIn = dates?.start ? moment(dates.start).format("YYYY-MM-DD") : "";
  const checkOut = dates?.end ? moment(dates.end).format("YYYY-MM-DD") : "";
  const { data: reserveDates, isFetching: isCheckingAvailability } =
    useReservationAvailability(data.id, checkIn, checkOut, String(count), show);

  return (
    <>
      <ModalBottomSheet
        options={{
          containerClass: `mx-auto rounded-t-20 absolute pb-[1.5rem] lg:pb-4 bottom-0 lg:translate-x-1/2 lg:right-1/2 w-full lg:w-[calc(35svw)]  bg-white  overflow-y-scroll  `,
        }}
        onHide={() => {
          setShow(false);
        }}
        show={show}
      >
        <ModalHeaderPart
          hideArrow
          title={_STRINGS.RESERVE}
          onHide={() => {
            setShow(false);
          }}
        />
        <div className=" flex flex-col gap-4  p-4">
          {/* DATES */}
          <div className="w-full flex flex-col gap-2">
            <p className=" ">{_STRINGS.TRIP_DATE}</p>

            <div className="flex w-full items-center justify-between gap-4">
              <DateSpanPicker
                dates={dates}
                setDates={setDates}
                forbiden_dates={reserveDates || []}
              />
            </div>
            {isCheckingAvailability ? <div className="h-1 w-full animate-pulse rounded bg-neutral-200" /> : null}
          </div>
          <div className="w-full flex flex-col gap-2">
            <p className=" ">{_STRINGS.PPL_COUNT}</p>
            <SinglePopUpSelect
              onSelect={setCount}
              value={count}
              item={{
                list: countList,
                placeholder: `${_STRINGS.PPL_COUNT} مشخص کنید`,
              }}
              closeOnSelect
            />
          </div>
          <div className=" flex items-center justify-between">
            {!!dates ? (
              !count ? (
                <p className="text-xs ">{`${_STRINGS.PPL_COUNT} را مشخص کنید`}</p>
              ) : (
                <></>
              )
            ) : (
              <p className="text-xs ">تاریخ را انتخاب کنید</p>
            )}

            <Button
              onClick={onReserveClick}
              roundedClass="rounded-full"
              disabled={!dates || !count}
              title={_STRINGS.ENTER_AND_MOVE_ON}
              width={`w-full ${!!dates && !!count ? "" : " text-white "} `}
              containerClass={` ${dates && !!count ? "w-full" : "w-1/2"}  items-center  justify-center`}
            />
          </div>
        </div>
      </ModalBottomSheet>
      <SinglePropRequestedReserveModal
        data={data}
        count={count}
        setShowEdit={setShow}
        onHide={onCloseReserveReq}
        show={showReserveReq && !show}
        endDate={moment(dates?.end).format("jYYYY/jMM/jDD")}
        startDate={moment(dates?.start).format("jYYYY/jMM/jDD")}
      />
    </>
  );
};

export default SinglePropReservePop;
