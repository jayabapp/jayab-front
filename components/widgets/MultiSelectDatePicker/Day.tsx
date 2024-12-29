import React, { useEffect, useState } from "react";

type dataTypes = {
  data?: {
    id?: number | string;
    reserved?: number | string;
  };
  onSelect?: (e: any | null) => Promise<void | null> | void | null;
  selectedDayId?: any[];
  month?: string | number;
  year?: string | number;
  isOffDay?: boolean;

  showTimeOfTheDay?: boolean;
};

const Day = ({ onSelect, data, selectedDayId, month, year, showTimeOfTheDay, isOffDay }: dataTypes) => {
  const selectedDay = selectedDayId?.filter((e) => e?.day == data?.id)[0];
  // it find if the gour in the day has color or not (has shift in it )
  const colorFinder = () => {
    return Array.from({ length: 24 }, (v, k) => {
      const incomingDays: any = [];
      selectedDay?.timeSheet?.map((e: any) => incomingDays?.push(...e));
      return { hour: k + 1, colored: incomingDays?.includes(k + 1) };
    })?.map((e) => (e?.colored ? `${selectedDay?.theme ? selectedDay?.theme : "#109691"} ` : "white"));
  };

  return (
    <div
      className={`aspect-square  ${data?.reserved ? "" : "opacity-30"} ${onSelect ? "cursor-pointer" : ""} `}
      onClick={() => {
        if (onSelect) {
          onSelect(data);
        }
      }}
    >
      {" "}
      <div
        key={data?.id}
        className={`text-center transition-all relative duration-500 ease-in-out flex items-center justify-center aspect-square rounded-lg   ${
          selectedDay && selectedDay?.month == month && selectedDay?.year == year && !selectedDay?.timeSheet
            ? "!bg-primary-700 "
            : ""
        }`}
        style={
          // selectedDay?.timeSheet specifies if the day data has 24 hour shift shower
          selectedDay && selectedDay?.month == month && selectedDay?.year == year && selectedDay?.timeSheet
            ? {
                background: `linear-gradient(${colorFinder()})`,
                // color: "white",
              }
            : {}
        }
      >
        <p
          className={`z-1  ${isOffDay ? "!text-red-100" : ""} absolute
          ${selectedDay ? "datePickerTextShadow" : ""} 
          `}
        >
          {" "}
          {data?.id}
        </p>
      </div>
    </div>
  );
};

export default Day;
