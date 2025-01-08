import React, { useState, useEffect } from "react";
import MonthPicker from "../MonthPicker";
import DaysOfTheWeel from "../DaysOfTheWeel";
import DayPicker from "../DayPicker";
import moment from "moment-jalaali";
import YearPicker from "../YearPicker";
import { useStoreTheme } from "../../../../store";
import { OwnerCallendarItemDto } from "@/api_services/property/property.interface";

type dates = {
  selectedDate?: string | number;
  active_days?: number[] | undefined;
  callenderData?: OwnerCallendarItemDto[] | undefined;
  prefix?: string;
  setSelectedDay?: (e: any | null) => void | null;
  setChosenDateState?: (e: any | null) => void | null;
  options?: { valueType: "persian" | "global"; showTimeOfTheDay?: boolean };
};
const Callender = ({
  selectedDate,
  setSelectedDay,
  prefix,
  setChosenDateState,
  callenderData,
  active_days,
  options = { valueType: "persian" },
}: dates) => {
  const [chosenDate, setChosenDate] = useState<string | number>(
    !!selectedDate ? moment(selectedDate, "jYYYY/jMM/jDD").format("jYYYY/jMM/jDD") : moment().format("jYYYY/jMM/jDD")
  );
  const [firstTime, setFirstTime] = useState(true);
  const [year, setYear] = useState(moment(chosenDate, "jYYYY/jMM/jDD").format("jYYYY"));
  const [month, setMonth] = useState(moment(chosenDate, "jYYYY/jMM/jDD").format("jMMMM"));
  const [numbericMonth, setNumericMonth] = useState(moment(chosenDate).format("jMM"));
  const [Loading, setLoading] = useState<boolean>(false);
  const [prevX, setPrevX] = useState<any>(-1);
  const [start, setStart] = useState<any>(-1);
  const [preventer, setPreventer] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setYear(moment(chosenDate, "jYYYY/jMM/jDD").format("jYYYY"));
    setMonth(moment(chosenDate, "jYYYY/jMM/jDD").format("jMMMM"));
    setNumericMonth(moment(chosenDate, "jYYYY/jMM/jDD").format("jMM"));
  }, [chosenDate]);

  useEffect(() => {
    if (!!setChosenDateState) {
      setChosenDateState(chosenDate);
    }
  }, [chosenDate]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, [Loading]);

  const doTheMath = (start: number, end: number) => {
    if (Math.abs(start - end) > 150) {
      return true;
    } else return false;
  };
  const nextMonth = () => {
    setChosenDate(moment(chosenDate, "jYYYY/jMM/jDD").add(1, "months").format("jYYYY/jMM/jDD"));
  };
  const lastMonth = () => {
    setChosenDate(moment(chosenDate, "jYYYY/jMM/jDD").subtract(1, "months").format("jYYYY/jMM/jDD"));
  };

  return (
    <div
      onMouseDownCapture={(e) => setStart(e?.pageX)}
      onTouchStart={(e) => {
        setStart(e?.targetTouches[0]?.pageX);
      }}
      onDragEndCapture={(e) => setPreventer(false)}
      onTouchEndCapture={(e) => setPreventer(false)}
      onTouchEnd={(e) => {
        // alert(e.changedTouches[0]?.pageX);
        if (start > e.changedTouches[0].pageX && doTheMath(start, e.changedTouches[0].pageX) && !preventer) {
          nextMonth();
          setPreventer(true);
        } else if (start < e.changedTouches[0].pageX && doTheMath(start, e.changedTouches[0].pageX) && !preventer) {
          // dragged right
          lastMonth();
          setPreventer(true);
        }
      }}
      onDragOver={(e) => {
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
      className="flex transition-all duration-500 ease-in-out  w-full  rounded-2xl   gap-4 flex-col"
      draggable
    >
      <div
        className={`flex text-primary-700 flex-col gap-1 items-start   transition-all ${
          !!selectedDate ? "" : " opacity-0"
        }`}
      >
        <p>{moment(selectedDate, "jYYYY/jMM/jDD").format("jYYYY")}</p>
        <p className=" text-2xl ">{moment(selectedDate, "jYYYY/jMM/jDD").format("   ddd jDD jMMMM")}</p>
      </div>

      <div className="flex items-center gap-4">
        {" "}
        <YearPicker prefix={prefix} date={`${chosenDate}`} setDate={setChosenDate} month={month} year={year} />
        <MonthPicker prefix={prefix} date={`${chosenDate}`} setDate={setChosenDate} month={month} year={year} />
      </div>
      <DaysOfTheWeel />
      <DayPicker
        active_days={active_days}
        callenderData={callenderData}
        date={chosenDate}
        month={numbericMonth}
        year={year}
        Loading={Loading}
        setSelectedDay={setSelectedDay}
        selectedDate={selectedDate}
        options={options}
      />
    </div>
  );
};

export default Callender;
