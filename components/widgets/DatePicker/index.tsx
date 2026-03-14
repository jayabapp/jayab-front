import moment from "moment-jalaali";
import { useEffect, useState } from "react";
import DayPicker from "./DayPicker";
import DaysOfTheWeel from "./DaysOfTheWeek";
import YearMonthPicker from "./YearMonthPicker";

type dates = {
  selectedDate?: string | number;
  freeDaysOfMonth?: boolean;
  smallerDateFonts?: boolean;
  prefix?: string;
  color?: string;
  setSelectedDay?: (e: any | null) => void | null;
  options?: { valueType: "persian" | "global"; showTimeOfTheDay?: boolean };
};
const SingleDatePicker = ({
  selectedDate,
  setSelectedDay,
  prefix,
  color,
  freeDaysOfMonth,
  smallerDateFonts,
  options = { valueType: "persian" },
}: dates) => {
  const [chosenDate, setChosenDate] = useState<string | number>(
    !!selectedDate ? moment(selectedDate, "jYYYY/jMM/jDD").format("jYYYY/jMM/jDD") : moment().format("jYYYY/jMM/jDD"),
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
    setChosenDate(moment(chosenDate, "jYYYY/jMM/jDD").startOf("month").add(1, "months").format("jYYYY/jMM/jDD"));
  };
  const lastMonth = () => {
    setChosenDate(moment(chosenDate, "jYYYY/jMM/jDD").startOf("month").subtract(1, "months").format("jYYYY/jMM/jDD"));
  };

  // useEffect(()=>{

  //   if(!!firstTime){

  //   }
  // },[])

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
          lastMonth();
          setPreventer(true);
        } else if (start < e.changedTouches[0].pageX && doTheMath(start, e.changedTouches[0].pageX) && !preventer) {
          nextMonth();
          // dragged right
          setPreventer(true);
        }
      }}
      onDragOver={(e) => {
        if (prevX > e.pageX && doTheMath(start, e.pageX) && !preventer) {
          setPreventer(true);
          lastMonth();
        } else if (prevX < e.pageX && doTheMath(start, e.pageX) && !preventer) {
          // dragged right
          nextMonth();
          setPreventer(true);
        }

        setPrevX(e.pageX);
      }}
      // onDragOverCapture={(e) => console.log(e, "eeeeeeeee")}
      className="flex transition-all duration-500 ease-in-out bg-neutral-100 rounded-2xl p-4 md:p-12  gap-2 flex-col"
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
        <YearMonthPicker prefix={prefix} date={`${chosenDate}`} setDate={setChosenDate} month={month} year={year} />
      </div>
      <DaysOfTheWeel />
      <DayPicker
        smallerDateFonts={smallerDateFonts}
        freeDaysOfMonth={freeDaysOfMonth}
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

export default SingleDatePicker;
