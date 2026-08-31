"use client";

/* eslint-disable react-hooks/set-state-in-effect -- Gesture navigation synchronizes the displayed Jalali month labels. */

import type { SearchDateRangePickerProps } from "@/types/components/modules/search-date-range-picker";
import { YearMonthPicker } from "@elements/JalaliCalendar";
import { useState, useEffect } from "react";

import DaysOfTheWeel from "./DaysOfTheWeek";
import DayPicker from "./DayPicker";
import moment from "moment-jalaali";

const SearchDateRangePicker = ({
  prefix,
  selectedDates,
  setSelectedDay,
  freeDaysOfMonth,
  options = { valueType: "persian" },
}: SearchDateRangePickerProps) => {
  const [chosenDate, setChosenDate] = useState<string | number>(
    !!selectedDates?.startDate
      ? moment(selectedDates?.startDate, "jYYYY/jMM/jDD").format(
          "jYYYY/jMM/jDD",
        )
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
    if (Math.abs(start - end) > 150) return true;
    else return false;
  };
  const nextMonth = () => {
    setChosenDate(
      moment(chosenDate, "jYYYY/jMM/jDD")
        .startOf("month")
        .add(1, "months")
        .format("jYYYY/jMM/jDD"),
    );
  };
  const lastMonth = () => {
    setChosenDate(
      moment(chosenDate, "jYYYY/jMM/jDD")
        .startOf("month")
        .subtract(1, "months")
        .format("jYYYY/jMM/jDD"),
    );
  };

  return (
    <div
      onMouseDownCapture={(e) => setStart(e?.pageX)}
      onTouchStart={(e) => {
        setStart(e?.targetTouches[0]?.pageX);
      }}
      onDragEndCapture={() => setPreventer(false)}
      onTouchEndCapture={() => setPreventer(false)}
      onTouchEnd={(e) => {
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
          lastMonth();
          setPreventer(true);
        }
      }}
      onDragOver={(e) => {
        if (prevX > e.pageX && doTheMath(start, e.pageX) && !preventer) {
          nextMonth();
          setPreventer(true);
        } else if (prevX < e.pageX && doTheMath(start, e.pageX) && !preventer) {
          lastMonth();
          setPreventer(true);
        }
        setPrevX(e.pageX);
      }}
      className="flex transition-all duration-500 ease-in-out bg-neutral-100 rounded-2xl p-4 md:p-12  gap-2 flex-col"
      draggable
    >
      <div className="flex items-center gap-4">
        {" "}
        <YearMonthPicker
          year={year}
          month={month}
          prefix={prefix}
          date={`${chosenDate}`}
          setDate={setChosenDate}
        />
      </div>
      <DaysOfTheWeel />
      <DayPicker
        year={year}
        Loading={false}
        options={options}
        date={chosenDate}
        month={numbericMonth}
        selectedDates={selectedDates}
        setSelectedDay={setSelectedDay}
        freeDaysOfMonth={freeDaysOfMonth}
      />
    </div>
  );
};

export default SearchDateRangePicker;
