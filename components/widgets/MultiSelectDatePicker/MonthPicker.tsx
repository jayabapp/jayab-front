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
    setDate(moment(Number(date)).add(1, "months").format("x"));
  };
  const lastMonth = () => {
    setDate(moment(Number(date)).subtract(1, "months").format("x"));
  };

  return (
    <div className="flex snap-x justify-between items-center">
      <img
        alt="`"
        className="cursor-pointer -rotate-90"
        src={"/assets/icons/shared/chevron.svg"}
        onClick={() => {
          nextMonth();
        }}
      />
      <p>
        {prefix} {month} {year}
      </p>
      <img
        alt="`"
        onClick={() => {
          lastMonth();
        }}
        className="cursor-pointer rotate-90"
        src={"/assets/icons/shared/chevron.svg"}
      />
    </div>
  );
};

export default MonthPicker;
