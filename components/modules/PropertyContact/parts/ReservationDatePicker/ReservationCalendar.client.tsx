"use client";

/* eslint-disable react-hooks/set-state-in-effect -- Gesture navigation synchronizes the displayed Jalali month labels. */

import type { ReservationCalendarProps } from "@/types/components/modules/reservation-date-picker";
import { useEffect, useState } from "react";

import YearMonthPicker from "./YearMonthPicker";
import DaysOfTheWeel from "./DaysOfTheWeek";
import DayPicker from "./DayPicker";
import moment from "moment-jalaali";

const SingleDatePicker = ({
  prefix,
  dateSpan,
  startDate,
  setDateSpan,
  selectedDate,
  setSelectedDay,
  forbiden_dates,
  freeDaysOfMonth,
  smallerDateFonts,
  disableMonthChange,
  options = { valueType: "persian" },
}: ReservationCalendarProps) => {
  const [chosenDate, setChosenDate] = useState<string | number>(
    !!startDate || !!startDate
      ? moment(startDate || startDate, "jYYYY/jMM/jDD").format("jYYYY/jMM/jDD")
      : moment().format("jYYYY/jMM/jDD"),
  );
  const [year, setYear] = useState(
    moment(chosenDate, "jYYYY/jMM/jDD").format("jYYYY"),
  );
  const [month, setMonth] = useState(
    moment(chosenDate, "jYYYY/jMM/jDD").format("jMMMM"),
  );
  const [numbericMonth, setNumericMonth] = useState(
    moment(chosenDate).format("jMM"),
  );
  const [prevX, setPrevX] = useState<any>(-1);
  const [start, setStart] = useState<any>(-1);
  const [preventer, setPreventer] = useState<boolean>(false);

  useEffect(() => {
    setYear(moment(chosenDate, "jYYYY/jMM/jDD").format("jYYYY"));
    setMonth(moment(chosenDate, "jYYYY/jMM/jDD").format("jMMMM"));
    setNumericMonth(moment(chosenDate, "jYYYY/jMM/jDD").format("jMM"));
  }, [chosenDate]);

  const doTheMath = (start: number, end: number) => {
    if (Math.abs(start - end) > 150) {
      return true;
    } else return false;
  };
  const nextMonth = () => {
    setChosenDate(
      moment(chosenDate, "jYYYY/jMM/jDD")
        .startOf("jMonth")
        .add(1, "jMonth")
        .format("jYYYY/jMM/jDD"),
    );
  };
  const lastMonth = () => {
    setChosenDate(
      moment(chosenDate, "jYYYY/jMM/jDD")
        .startOf("jMonth")
        .subtract(1, "jMonth")
        .format("jYYYY/jMM/jDD"),
    );
  };

  return (
    <div
      onMouseDownCapture={(e) => !disableMonthChange && setStart(e?.pageX)}
      onTouchStart={(e) => {
        !disableMonthChange && setStart(e?.targetTouches[0]?.pageX);
      }}
      onDragEndCapture={() => !disableMonthChange && setPreventer(false)}
      onTouchEndCapture={() => !disableMonthChange && setPreventer(false)}
      onTouchEnd={(e) => {
        if (disableMonthChange) return;
        if (
          start > e.changedTouches[0].pageX &&
          doTheMath(start, e.changedTouches[0].pageX) &&
          !preventer
        ) {
          nextMonth();
          setPreventer(true);
        } else if (
          start < e.changedTouches[0].pageX &&
          doTheMath(start, e.changedTouches[0].pageX) &&
          !preventer
        ) {
          // dragged right
          lastMonth();
          setPreventer(true);
        }
      }}
      onDragOver={(e) => {
        if (disableMonthChange) return;
        if (prevX > e.pageX && doTheMath(start, e.pageX) && !preventer) {
          nextMonth();
          setPreventer(true);
        } else if (prevX < e.pageX && doTheMath(start, e.pageX) && !preventer) {
          // dragged right
          lastMonth();
          setPreventer(true);
        }

        setPrevX(e.pageX);
      }}
      className="flex transition-all duration-500 ease-in-out rounded-2xl p-4 md:p-12 gap-2 flex-col"
      draggable
    >
      <div className="flex items-center gap-4">
        {" "}
        <YearMonthPicker
          year={year}
          month={month}
          prefix={prefix}
          date={`${chosenDate}`}
          setDate={!!disableMonthChange ? undefined : setChosenDate}
        />
      </div>
      <DaysOfTheWeel />
      <DayPicker
        year={year}
        Loading={false}
        options={options}
        date={chosenDate}
        dateSpan={dateSpan}
        month={numbericMonth}
        setDateSpan={setDateSpan}
        selectedDate={selectedDate}
        forbiden_dates={forbiden_dates}
        setSelectedDay={setSelectedDay}
        freeDaysOfMonth={freeDaysOfMonth}
        smallerDateFonts={smallerDateFonts}
      />
    </div>
  );
};

export default SingleDatePicker;
