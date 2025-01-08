import numberWithCommas from "@/helpers/numberWithCommas";
import moment from "moment-jalaali";
import React from "react";
import DayPricePart from "./DayPricePart";

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
  selectedDayId?: { day: number; month: string; year: string };
  today?: { day: number; month: string; year: string };
  month?: string;
  year?: string;

  showTimeOfTheDay?: boolean;
};

const Day = ({ onSelect, data, selectedDayId, month, year, showTimeOfTheDay, today }: dataTypes) => {
  const isBefore = moment(moment(`${year}/${month}/${data?.id}`, "jYYYY/jMM/jD")).isBefore();
  const isToday = today?.day == data?.id && today?.month == month && today?.year == year;
  const isSelected = selectedDayId?.day == data?.id && selectedDayId?.month == month && selectedDayId?.year == year;
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
          isToday ? "  rounded-md bg-gray-200 border " : ""
        }  relative  flex items-center justify-center aspect-square  ${
          !!data?.is_peak ? " border-b-2  border-red-800" : !!data?.isActive ? "border-b-2  border-primary-700" : ""
        }  ${isSelected ? "!bg-primary-700  rounded-md text-white" : ""}`}
      >
        {!!data?.has_memo ? (
          <div className="absolute left-0 top-0  w-2 h-2 aspect-square bg-red-800 !rounded-full"> </div>
        ) : (
          <></>
        )}

        <p className="z-1"> {data?.id}</p>
        {!!data?.price ? <DayPricePart data={data} /> : <></>}
      </div>
    </div>
  );
};

export default Day;
