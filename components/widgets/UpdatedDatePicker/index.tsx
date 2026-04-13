import moment from "moment-jalaali";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DayPicker from "./DayPicker";
import DaysOfTheWeel from "./DaysOfTheWeel";
import YearMonthPicker from "./YearMonthPicker";

type dates = {
  selectedDate?: string | number;
  startDate?: string | number;
  freeDaysOfMonth?: boolean;
  smallerDateFonts?: boolean;
  prefix?: string;
  color?: string;
  setSelectedDay?: (e: any | null) => void | null;
  disableMonthChange?: boolean;
  dateSpan?: {
    start: Date | null;
    end: Date | null;
  };
  setDateSpan?: Dispatch<
    SetStateAction<{
      start: Date | null;
      end: Date | null;
    }>
  >;
  options?: { valueType?: "persian" | "global"; showTimeOfTheDay?: boolean; maxSpanLength?: number };
  forbiden_dates?: Date[];
};
const SingleDatePicker = ({
  selectedDate,
  setSelectedDay,
  prefix,
  freeDaysOfMonth,
  smallerDateFonts,
  startDate,
  disableMonthChange,
  setDateSpan,
  dateSpan,
  options = { valueType: "persian" },
  forbiden_dates,
}: dates) => {
  const [chosenDate, setChosenDate] = useState<string | number>(
    !!startDate || !!startDate
      ? moment(startDate || startDate, "jYYYY/jMM/jDD").format("jYYYY/jMM/jDD")
      : moment().format("jYYYY/jMM/jDD"),
  );
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

  // useEffect(() => {
  //   if (!!selectedDate) {
  //     setChosenDate(moment(selectedDate, "jYYYY/jMM/jDD").format("jYYYY/jMM/jDD"));
  //   }
  // }, [selectedDate]);

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

  // useEffect(()=>{

  //   if(!!firstTime){

  //   }
  // },[])

  return (
    <div
      onMouseDownCapture={(e) => !disableMonthChange && setStart(e?.pageX)}
      onTouchStart={(e) => {
        !disableMonthChange && setStart(e?.targetTouches[0]?.pageX);
      }}
      onDragEndCapture={(e) => !disableMonthChange && setPreventer(false)}
      onTouchEndCapture={(e) => !disableMonthChange && setPreventer(false)}
      onTouchEnd={(e) => {
        if (disableMonthChange) return;
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
      // onDragOverCapture={(e) => console.log(e, "eeeeeeeee")}
      className="flex transition-all duration-500 ease-in-out  rounded-2xl p-4 md:p-12  gap-2 flex-col"
      draggable
    >
      {/* <div className="flex flex-col gap-1 items-start">
        <p style={{ color: color }}>{moment(selectedDate, "jYYYY/jMM/jDD").format("jYYYY")}</p>
        <p className=" text-2xl " style={{ color: color }}>
          {moment(selectedDate, "jYYYY/jMM/jDD").format("   ddd jDD jMMMM")}
        </p>
      </div> */}

      <div className="flex items-center gap-4">
        {" "}
        <YearMonthPicker
          prefix={prefix}
          date={`${chosenDate}`}
          setDate={!!disableMonthChange ? undefined : setChosenDate}
          month={month}
          year={year}
        />
      </div>
      <DaysOfTheWeel />
      <DayPicker
        dateSpan={dateSpan}
        setDateSpan={setDateSpan}
        smallerDateFonts={smallerDateFonts}
        freeDaysOfMonth={freeDaysOfMonth}
        date={chosenDate}
        month={numbericMonth}
        year={year}
        Loading={Loading}
        setSelectedDay={setSelectedDay}
        selectedDate={selectedDate}
        options={options}
        forbiden_dates={forbiden_dates}
      />
    </div>
  );
};

export default SingleDatePicker;
