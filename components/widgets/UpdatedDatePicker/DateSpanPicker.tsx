import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";
import { Dispatch, SetStateAction, useState } from "react";
import { date } from "yup";
import DateSpanPickerModal from "./DateSpanPickerModal";

const DateSpanPicker = ({
  dates,
  setDates,
  endTitle = _STRINGS.EXIT_DATE,
  startTitle = _STRINGS.START_DATE,
}: {
  dates:
    | {
        start?: any;
        end?: any;
      }
    | undefined;
  setDates: Dispatch<
    SetStateAction<
      | {
          start?: any;
          end?: any;
        }
      | undefined
    >
  >;
  endTitle?: string;
  startTitle?: string;
}) => {
  const [show, setShow] = useState(false);
  const onHide = () => {
    setShow(false);
  };
  const onShowCalender = () => {
    setShow(true);
  };

  const START_TITLE = !!dates?.start ? moment(dates?.start).format("jYYYY/jMM/jDD") : startTitle;
  const END_TITLE = !!dates?.start ? moment(dates?.end).format("jYYYY/jMM/jDD") : endTitle;

  return (
    <>
      <div className="flex w-full items-center justify-between gap-4">
        <div
          onClick={onShowCalender}
          className=" w-full bg-neutral-100 px-2  h-12  cursor-pointer relative flex items-center justify-center  rounded-10     "
        >
          <div className="flex flex-col ">
            <p className={`text-center text-sm ${!!date ? " font-medium " : " opacity-50"} `}>{START_TITLE}</p>
          </div>
        </div>
        <div
          onClick={onShowCalender}
          className=" w-full bg-neutral-100 px-2  h-12  cursor-pointer relative flex items-center justify-center  rounded-10     "
        >
          <div className="flex flex-col ">
            <p className={`text-center text-sm ${!!date ? " font-medium " : " opacity-50"} `}>{END_TITLE}</p>
          </div>
        </div>
      </div>
      <DateSpanPickerModal
        onHide={onHide}
        show={show}
        onConfirm={(e) => {
          setDates(e);
          onHide();
        }}
      />
    </>
  );
};

export default DateSpanPicker;
