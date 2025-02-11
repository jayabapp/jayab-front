import numberWithCommas from "@/helpers/numberWithCommas";
import moment from "moment-jalaali";
import React from "react";
import DayPricePart from "./DayPricePart";
import _STRINGS from "@/utils/LocalStrings";

type dataTypes = {
  data?: {
    id?: number | string;
    has_memo?: number | string;
    is_reserved?: number | string | boolean;
    isActive?: boolean;
    price?: number;
    discounted_price?: number;
    is_peak?: boolean;
    year?: string;
    month?: string;
  };
  onSelect?: (e: any | null) => void | null;
  selectedDayIds?: {
    startDate: {
      day: string | number | undefined;
      month: string | number | undefined;
      year: string | number | undefined;
    } | null;
    endDate: {
      day: string | number | undefined;
      month: string | number | undefined;
      year: string | number | undefined;
    } | null;
  };
  today?: { day: number; month: string; year: string };
  month?: string;
  year?: string;

  showTimeOfTheDay?: boolean;
  freeDaysOfMonth?: boolean;
};

const Day = ({ onSelect, data, selectedDayIds, month, year, freeDaysOfMonth, today }: dataTypes) => {
  const isBefore = !!freeDaysOfMonth
    ? false
    : moment(moment(`${year}/${month}/${data?.id}`, "jYYYY/jMM/jD")).isBefore();
  const isFriday = moment(moment(`${year}/${month}/${data?.id}`, "jYYYY/jMM/jD")).day() == 5;
  const isToday = today?.day == data?.id && today?.month == month && today?.year == year;
  const isSelectedStart =
    selectedDayIds?.startDate?.day == data?.id &&
    selectedDayIds?.startDate?.month == month &&
    selectedDayIds?.startDate?.year == year;
  const isSelectedEnd =
    selectedDayIds?.endDate?.day == data?.id &&
    selectedDayIds?.endDate?.month == month &&
    selectedDayIds?.endDate?.year == year;

  const isinBetween =
    moment(moment(`${year}/${month}/${data?.id}`, "jYYYY/jMM/jD")).isBefore(
      moment(
        `${selectedDayIds?.endDate?.year}/${selectedDayIds?.endDate?.month}/${selectedDayIds?.endDate?.day}`,
        "jYYYY/jMM/jD"
      )
    ) &&
    moment(moment(`${year}/${month}/${data?.id}`, "jYYYY/jMM/jD")).isAfter(
      moment(
        `${selectedDayIds?.startDate?.year}/${selectedDayIds?.startDate?.month}/${selectedDayIds?.startDate?.day}`,
        "jYYYY/jMM/jD"
      )
    );

  return (
    <div
      className={`aspect-square   ${!!data?.year && (!isBefore || !!isToday) ? "" : "opacity-30"} ${
        onSelect ? "cursor-pointer" : ""
      } `}
      onClick={() => {
        if (onSelect && !!data?.year && (!isBefore || !!isToday)) {
          onSelect(data);
        }
      }}
    >
      {" "}
      <div
        key={data?.id}
        className={`text-center flex flex-col gap-2 ${data?.is_reserved ? "striped" : ""}   ${
          isToday ? "  bg-gray-200  " : ""
        }  relative  flex items-center justify-center aspect-square    ${
          isSelectedEnd
            ? "!bg-primary-700  rounded-l-10 text-white"
            : isSelectedStart
            ? "!bg-primary-700  rounded-r-10 text-white"
            : ""
        }  ${!!isinBetween ? "!bg-primary-700  rounded-0 text-white" : ""}`}
      >
        {!!data?.has_memo ? (
          <div className="absolute left-1 top-1  w-1 h-1 aspect-square bg-primary-900 !rounded-full"> </div>
        ) : (
          <></>
        )}
        {!!data?.is_peak ? (
          <div className="absolute left-0 right-0 mx-auto  bottom-0.5   h-1  w-1/2  bg-primary-900 !rounded-full">
            {" "}
          </div>
        ) : (
          <></>
        )}

        <p className={`z-1 ${!!isFriday && !isinBetween && !isSelectedEnd && !isSelectedStart ? "text-red-700" : ""} `}>
          {" "}
          {data?.id}
        </p>
        {isSelectedStart || isSelectedEnd ? (
          <div className="absolute bottom-1">
            {" "}
            <p className=" text-white text-[0.526rem]"> {isSelectedStart ? _STRINGS.ENTER : _STRINGS.EXIT} </p>
          </div>
        ) : (
          <></>
        )}
        {!!data?.price ? <DayPricePart data={data} /> : <></>}
      </div>
    </div>
  );
};

export default Day;
