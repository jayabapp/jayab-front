import React from "react";

type dataTypes = {
  data?: {
    id?: number | string;
    has_memo?: number | string;
    is_off_day?: number | string;
    isActive?: boolean;
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
  return (
    <div
      className={`aspect-square  ${!!data?.year ? "" : "opacity-30"} ${onSelect ? "cursor-pointer" : ""} `}
      onClick={() => {
        if (onSelect) {
          onSelect(data);
        }
      }}
    >
      {" "}
      <div
        key={data?.id}
        className={`text-center  ${
          today?.day == data?.id && today?.month == month && today?.year == year ? "  rounded-md bg-gray-200" : ""
        }  relative  flex items-center justify-center aspect-square  ${
          !!data?.is_off_day ? " border-b-2  border-red-800" : !!data?.isActive ? "border-b-2  border-primary-700" : ""
        }  ${
          selectedDayId?.day == data?.id && selectedDayId?.month == month && selectedDayId?.year == year
            ? "!bg-primary-700  rounded-md text-white"
            : ""
        }`}
      >
        {!!data?.has_memo ? (
          <div className="absolute left-0 top-0  w-2 h-2 aspect-square bg-red-800 !rounded-full"> </div>
        ) : (
          <></>
        )}
        {/* {showTimeOfTheDay && morning ? (
          <div className="top-0 absolute h-1/3 rounded-t-lg w-full bg-lightBlue-200"></div>
        ) : (
          <></>
        )}
        {showTimeOfTheDay && noon ? <div className="top-1/3 absolute h-1/3  w-full bg-lightBlue-200"></div> : <></>}
        {showTimeOfTheDay && evening ? (
          <div className="top-2/3 absolute h-1/3  w-full rounded-b-lg bg-lightBlue-200"></div>
        ) : (
          <></>
        )} */}

        <p className="z-1"> {data?.id}</p>
      </div>
    </div>
  );
};

export default Day;
