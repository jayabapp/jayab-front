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

const YearPicker = ({ date, setDate, month, year, prefix }: props) => {
  const nextYear = () => {
    setDate(moment(date, "jYYYY/jMM/jD").add(1, "year").format("jYYYY/jMM/jD"));
  };
  const lastYear = () => {
    setDate(moment(date, "jYYYY/jMM/jD").subtract(1, "year").format("jYYYY/jMM/jD"));
  };

  return (
    <div className="flex w-full snap-x justify-between items-center">
      <img
        alt="`"
        className="cursor-pointer -rotate-90"
        src={"/assets/icons/shared/chevron.svg"}
        onClick={() => {
          lastYear();
        }}
      />
      <p>
        {prefix}
        {/* {month} */}
        {year}
      </p>
      <img
        alt="`"
        onClick={() => {
          nextYear();
        }}
        className="cursor-pointer rotate-90"
        src={"/assets/icons/shared/chevron.svg"}
      />
    </div>
  );
};

export default YearPicker;
