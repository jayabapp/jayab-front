import React, { useState, useMemo, useEffect } from "react";
import MonthPicker from "./MonthPicker";
import DaysOfTheWeel from "./DaysOfTheWeel";
import DayPicker from "./DayPicker";
import moment from "moment-jalaali";
// import { Day as DayType, any } from "@/api/admin-shifts/admin-shifts.interface";
import { useMutation, useQuery } from "@tanstack/react-query";
// import { AdminShiftsService } from "@/api/admin-shifts/admin-shifts.service";
import { isEmpty } from "lodash";
import { useSearchParams } from "next/navigation";
import LottieLoading from "../../Loading/LottieLoading";

type dates = {
  selectedDate?: any[];
  prefix?: string;
  setSelectedDate?: (e: string) => void | null;
  setSelectedDay?: (e: any | null) => void | null;
  chosenDateDefaultValue?: number;
  options?: {
    valueType?: "persian" | "global";
    setNewYearMonth?: (e: { year: string | number; month: string | number }) => void | null;
    showTimeOfTheDay?: boolean;
    refresher?: boolean;
    teamShiftLoading?: boolean;
    shift_id?: string;
    disableDateSelect?: boolean;

    daysPlusShifts?: { [key: string | number]: any } | [];

    selectDayExtraFunc?: (day: number, month: number, year: number) => void | null;
    //sets a days shifts ids
    setShitIds?: (e: string[] | number[]) => void | null;
    deleteDayExtraFunc?: (e: { id: number | string | null; spId: number | string | null }) => void | null;
  };
};
const DatePicker = ({ setSelectedDate, prefix, options = { valueType: "persian" } }: dates) => {
  const searchParams = useSearchParams();
  const queryDate = searchParams?.getAll("date");
  const [chosenDate, setChosenDate] = useState(
    queryDate?.length > 0 ? Number(moment(queryDate[0], "jYYYY/jMM/jD")?.format("x")) : moment.now()
  );

  const [year, setYear] = useState(moment(Number(chosenDate)).format("jYYYY"));
  const [month, setMonth] = useState(moment(Number(chosenDate)).format("jMMMM"));
  const [numbericMonth, setNumericMonth] = useState(moment(Number(chosenDate)).format("jMM"));
  const [prevX, setPrevX] = useState<any>(-1);
  const [start, setStart] = useState<any>(-1);
  const [preventer, setPreventer] = useState<boolean>(false);
  const [selectedDayId, setSelectedDayId] = useState<any[]>([]);

  useEffect(() => {
    setYear(moment(Number(chosenDate)).format("jYYYY"));
    setMonth(moment(Number(chosenDate)).format("jMMMM"));
    if (options.setNewYearMonth) {
      options.setNewYearMonth({
        year: moment(Number(chosenDate)).format("jYYYY"),
        month: moment(Number(chosenDate)).format("jMM"),
      });
    }
    setNumericMonth(moment(Number(chosenDate)).format("jMM"));
  }, [chosenDate]);

  const doTheMath = (start: number, end: number) => {
    if (Math.abs(start - end) > 150) {
      return true;
    } else return false;
  };
  const nextMonth = () => {
    setChosenDate(Number(moment(Number(chosenDate)).add(1, "months").format("x")));
  };
  const lastMonth = () => {
    setChosenDate(Number(moment(Number(chosenDate)).subtract(1, "months").format("x")));
  };

  // const { refetch, isLoading } = useQuery(
  //   [AdminShiftsService?.DAYS_OF_WEEK_CACHEKEY, year, numbericMonth, options?.shift_id],
  //   () =>
  //     AdminShiftsService.GetDaysOfAMonth({
  //       schedule_id: Number(options?.shift_id),
  //       month: Number(numbericMonth),
  //       year: Number(year),
  //     }),
  //   {
  //     enabled: false,
  //     onSuccess: (e) => {
  //       if (!isEmpty(e)) {
  //         setSelectedDayId(e || []);
  //       }
  //     },
  //   }
  // );

  useEffect(() => {
    if (numbericMonth && year && options?.shift_id) {
      // refetch();
    } else if (options?.daysPlusShifts) {
      const dataArray = Object.entries(options?.daysPlusShifts);
      setSelectedDayId(
        dataArray?.map((e) => {
          const shiftOfTheDay = e[1]?.shifts?.map((x: any) => x?.id);
          return {
            schedule_ids: shiftOfTheDay,
            day: Number(e[0]),
            month: Number(numbericMonth),
            year: Number(year),
            theme: e[1]?.shifts[0]?.theme,
            timeSheet: e[1]?.shifts?.map(
              (x: any) => {
                if (x?.title == "صبح") {
                  return [1, 2, 3, 4, 5, 6, 7, 8];
                } else if (x?.title == "عصر") {
                  return [9, 10, 11, 12, 13, 14, 15, 16];
                } else if (x?.title == "شب") {
                  return [17, 18, 19, 20, 21, 22, 23, 24];
                } else return [];
              }

              // Array.from(
              //   { length: Math.abs(Number(x?.to == 0 ? 24 : x?.to) - Number(x?.from)) },
              //   (v: number, k) => k + 1 + x?.from
              // )
            ),
          };
        })
      );
    }
  }, [numbericMonth, year, options?.shift_id, options?.refresher, options?.daysPlusShifts]);

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
      // onDragOverCapture={(e) => console.log(e, "eeeeeeeee")}
      className="flex transition-all duration-500 ease-in-out bg-neutral-100 rounded-2xl p-4 md:p-12  gap-4 flex-col"
      draggable
    >
      <MonthPicker prefix={prefix} date={`${chosenDate}`} setDate={setChosenDate} month={month} year={year} />
      <DaysOfTheWeel />
      {options?.teamShiftLoading ? (
        <LottieLoading />
      ) : (
        <DayPicker
          setSelectedDate={setSelectedDate}
          date={chosenDate}
          month={Number(numbericMonth)}
          year={Number(year)}
          selectedDayId={selectedDayId}
          setSelectedDayId={setSelectedDayId}
          options={options}
        />
      )}
    </div>
  );
};

export default DatePicker;
