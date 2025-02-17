import React, { useEffect, useMemo, useState } from "react";
import moment from "moment-jalaali";
import _STRINGS from "@/utils/LocalStrings";

moment.loadPersian({ dialect: "persian-modern" });
type props = {
  date: string;
  year: string;
  month: string;
  prefix?: string;
  setDate: (e: any | null) => void | null;
};

const YearMonthPicker = ({ date, setDate, month, year, prefix }: props) => {
  const nextMonth = () => {
    setDate(moment(date, "jYYYY/jMM/jDD").add(1, "month").format("jYYYY/jMM/jDD"));
  };
  const lastMonth = () => {
    setDate(moment(date, "jYYYY/jMM/jDD").subtract(1, "month").format("jYYYY/jMM/jDD"));
  };

  return (
    <div className="flex snap-x w-full justify-between items-center  px-4">
      <div className="flex items-center gap-2">
        <img
          alt="`"
          className="cursor-pointer "
          src={"/assets/icons/property/arrow_right_callendar.svg"}
          onClick={() => {
            lastMonth();
          }}
        />
        <p className="text-xs text-primary-250">{_STRINGS.LAST_MONTH}</p>
      </div>
      <p className="text-primary-700 text-sm font-medium ">
        {prefix}
        {month} {"  "} {year}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-xs text-primary-250 ">{_STRINGS.NEXT_MONTH}</p>
        <img
          alt="`"
          onClick={() => {
            nextMonth();
          }}
          className="cursor-pointer  -rotate-180 "
          src={"/assets/icons/property/arrow_right_callendar.svg"}
        />{" "}
      </div>
    </div>
  );
};

export default YearMonthPicker;
