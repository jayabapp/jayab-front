import moment from "moment-jalaali";
import React, { useEffect, useState } from "react";
// import CalenderIcon from "../../DynamicIcons/CalenderIcon";
// import CircularArrowLeft from "../../DynamicIcons/CircularArrowLeft";
// import CircularArrowRight from "../../DynamicIcons/CircularArrowRight";
import "@moamfar/react-time-date-picker/dist/style.css";

import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import { DatePicker, DatePickerSelectedDate } from "@moamfar/react-time-date-picker";
const DatePickerModal = ({
  date,
  setDate,
  title,
  minDate,
  minYear = 1404,
  maxYear = minYear + 10,
}: {
  date?: DatePickerSelectedDate;
  setDate: React.Dispatch<React.SetStateAction<DatePickerSelectedDate | undefined>>;
  title: string;
  minDate?: string;
  minYear?: number;
  maxYear?: number;
}) => {
  const [show, setShow] = useState(false);
  const onHide = () => {
    setShow(false);
  };
  const onShowCalender = () => {
    setShow(true);
  };

  // const nextDay = () => {
  //   setDate(moment(date, "jYYYY/jMM/jDD").add(1, "day").format("jYYYY/jMM/jDD"));
  // };
  // const lastDay = () => {
  //   setDate(moment(date, "jYYYY/jMM/jDD").subtract(1, "day").format("jYYYY/jMM/jDD"));
  // };

  useEffect(() => {
    setShow(false);
  }, [date]);
  return (
    <>
      <div
        onClick={onShowCalender}
        className=" w-full bg-neutral-100 px-2  h-12  cursor-pointer relative flex items-center justify-center  rounded-10     "
      >
        <div className="flex flex-col ">
          <p className={`text-center text-sm ${!!date ? " font-medium " : " opacity-50"} `}>
            {!!date ? `${date?.year}/${date?.month}/${date?.day}` : title}
          </p>
        </div>
      </div>

      <ModalBottomSheet
        show={show}
        onHide={onHide}
        options={{
          containerClass:
            "!px-10 mx-auto rounded-t-20 absolute pb-[1.5rem] md:pb-10 bottom-0 md:translate-x-1/2 md:right-1/2 w-full md:w-[calc(50svw)]  bg-white dark:bg-zinc-900 overflow-y-scroll  dark:bg-dark-700 ",
        }}
      >
        <DatePicker
          minDate={minDate}
          minYear={minYear}
          sonnerOptions={{
            id: "minMaxDateError",
            position: "bottom-center",
            type: "warning",
            icon: null,
            closeButton: true,
            richColors: true,
            duration: 2000,
            dismissible: true,
            className: "!select-none !text-center !items-center !justify-center !font-[IranSans] !text-[14px]",
          }}
          minDateError={`تاریخ انتخابی نمی‌تواند قبل از ${
            minDate ? moment(minDate, "X").format("jDD jMMMM jYYYY") : ""
          } باشد.`}
          type="jalaali"
          maxYear={maxYear}
          columnsOrder={["day", "month", "year"]}
          selectedDate={date}
          submitTitle="ثبت"
          submitCallback={() => {
            onHide();
          }}
          buttonClassName="w-full !bg-primary-700 rounded-md h-10 text-center flex items-center justify-center"
          setSelectedDate={(date) => {
            setDate?.(date);
          }}
        />
      </ModalBottomSheet>
    </>
  );
};

export default DatePickerModal;
