import React, { useEffect, useMemo, useState } from "react";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });
type props = {
  date: string;
  year: string;
  month: string;
  prefix?: string;
  setDate: (e: any | null) => void | null;
};

const MonthPicker = ({ date, setDate, month, year, prefix }: props) => {
  const nextMonth = () => {
    setDate(moment(date, "jYYYY/jMM/jDD").startOf("month").add(1, "month").format("jYYYY/jMM/jDD"));
  };
  const lastMonth = () => {
    setDate(moment(date, "jYYYY/jMM/jDD").startOf("month").subtract(1, "month").format("jYYYY/jMM/jDD"));
  };

  return (
    <div className="flex snap-x w-full justify-between items-center">
      <img
        alt="`"
        className="cursor-pointer -rotate-90"
        src={"/assets/icons/shared/chevron.svg"}
        onClick={() => {
          lastMonth();
        }}
      />
      <p>
        {prefix}

        {month}
        {/* {year} */}
      </p>
      <img
        alt="`"
        onClick={() => {
          nextMonth();
        }}
        className="cursor-pointer rotate-90"
        src={"/assets/icons/shared/chevron.svg"}
      />
    </div>
  );
};

export default MonthPicker;
