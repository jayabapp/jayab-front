import { WeekDays } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const DaysOfTheWeekStatus = () => {
  return (
    <div className="w-full flex  justify-between gap-1 md:gap-3 items-center ">
      {WeekDays.map((e) => (
        <div className="flex w-full items-center justify-center flex-col gap-2">
          <p className="text-xxs md:text-sm font-light text-primary-250">{e?.title}</p>

          <div
            className={`  ${
              false
                ? " bg-primary-700 border-primary-700  text-white "
                : "  bg-white  border-primary-250 text-primary-250"
            } text-xxs md:text-sm  border-2  min-w-9 rounded-full h-5 md:h-7 w-full   flex items-center justify-center `}
          >
            {false ? "رزرو" : "خالی"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DaysOfTheWeekStatus;
