import React, { useEffect, useMemo, useState } from "react";
import moment from "moment-jalaali";
import Day from "./Day";
// import { Day as any } from "@/api/admin-shifts/admin-shifts.interface";
import { useQuery } from "@tanstack/react-query";
// import { UserShiftsService } from "@/api/user-shifts/user-shifts.service";
moment.loadPersian({ dialect: "persian-modern" });
type props = {
  month: number;
  year: number;
  date: number;

  selectedDayId: any[];
  setSelectedDayId: (e: any | null) => void | null;
  setSelectedDate?: (e: string) => void | null;
  options?: {
    shift_id?: number | string;
    disableDateSelect?: boolean;
    valueType?: "persian" | "global";
    //sets a days shifts ids
    setShitIds?: (e: string[] | number[]) => void | null;
    showTimeOfTheDay?: boolean;
    selectDayExtraFunc?: (day: number, month: number, year: number) => void | null;
    deleteDayExtraFunc?: (e: { id: number | string | null; spId: number | string | null }) => void | null;
  };
};

const daysOfOurLives = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "آدینه"];
const DayPicker = ({ month, year, date, selectedDayId, setSelectedDayId, options, setSelectedDate }: props) => {
  const [numberOfDays, setNumberOfDays] = useState(moment.jDaysInMonth(Number(year), Number(month) - 1));

  // const [numberOfDaysLast, setNumberOfDaysLast] = useState(moment.jDaysInMonth(Number(year), Number(month) - 2));
  // const [startOfMonth, setStartOfMonth] = useState(moment(Number(date)).startOf("jMonth").format("dddd"));
  const [lastDaysData, setLastDaysData] = useState<{ [key: string]: any }[] | []>([]);
  const [nextDaysData, setNextDaysData] = useState<{ [key: string]: any }[] | []>([]);

  const [daysData, setDaysData] = useState(
    Array.from({ length: numberOfDays }, (e, i) => {
      return { id: i + 1, month: month, year: year };
    })
  );

  useEffect(() => {
    setDaysData(
      Array.from({ length: numberOfDays }, (e, i) => {
        return {
          id: i + 1,
          reserved: "free",
          month: month,
          year: year,
        };
      })
    );
  }, [numberOfDays, date, month, year]);

  useEffect(() => {
    setNumberOfDays(moment.jDaysInMonth(Number(year), Number(month) - 1));

    // setNumberOfDaysLast(moment.jDaysInMonth(Number(year), Number(month) - 2));
    // setStartOfMonth(moment(Number(date)).startOf("jMonth").format("dddd"));
  }, [month, year, date]);

  useEffect(() => {
    let TEMPM2 = moment(Number(date));
    let lastMonth = moment(TEMPM2).subtract(1, "month");
    let lastMonthDays = moment.jDaysInMonth(lastMonth.jYear(), lastMonth.jMonth());
    let startDays = Array.from(
      {
        length: (moment(`${year}/${month}/${1}`, "jYYYY/jMM/jD").isoWeekday() + 1) % 7,
      },
      (_, i) => ({ id: lastMonthDays - i })
    ).reverse();

    let endDays = Array.from(
      {
        length: (7 - ((startDays?.length + moment.jDaysInMonth(year, month - 1)) % 7)) % 7,
      },
      (_, i) => ({ id: i + 1 })
    );
    setLastDaysData(startDays);
    setNextDaysData(endDays);
  }, [month, year, date]);

  const selectADate = async (e: { id?: number | string; reserved?: number | string }) => {
    const selectedDay = selectedDayId?.find((x) => x?.day == e?.id);

    if (setSelectedDate) {
      /* -------------------------------------------------------------------------- */
      /*                            to set the shown date                           */
      /* -------------------------------------------------------------------------- */

      setSelectedDate(`${year}/${month}/${e?.id}`);
    }

    if (options?.setShitIds && selectedDay) {
      //here its selects a day to see its details
      return options?.setShitIds(selectedDay?.schedule_ids ? selectedDay?.schedule_ids : []);
    }
    if (options?.disableDateSelect) return;
    if (e?.id) {
      if (!selectedDay) {
        if (options?.selectDayExtraFunc) {
          await options?.selectDayExtraFunc(Number(e?.id), Number(month), Number(year));
        }
        setSelectedDayId((A: any[]) => {
          return [...A, { day: Number(e?.id), month: month, year: year }];
        });
      } else {
        if (options?.deleteDayExtraFunc && options?.shift_id) {
          await options?.deleteDayExtraFunc({
            id: options?.shift_id,
            spId: selectedDay?.id || null,
          });
        }
        setSelectedDayId((A: any[]) => {
          return A.filter((x) => x?.day !== e?.id);
        });
      }
    }
  };

  // const { data: holidays } = useQuery([UserShiftsService?.HOLIDAYS_CACHEID, year], () => {
  //   if (year) return UserShiftsService.GetHolidays({ year: year });
  // });

  return (
    <div className="grid grid-cols-7    transition-all duration-500 ease-in-out gap-1.5 md:gap-4 items-center">
      {" "}
      {lastDaysData?.map((e, i) => (
        <Day data={e} key={i} />
      ))}
      {daysData?.map((e, i) => (
        <Day
          isOffDay={
            // holidays ? (holidays?.filter((e) => e?.month == month)?.find((d) => d?.day == e?.id) ? true : false) :
            false
          }
          data={e}
          key={i}
          onSelect={selectADate}
          selectedDayId={selectedDayId}
          year={year}
          month={month}
          showTimeOfTheDay={options?.showTimeOfTheDay}
        />
      ))}
      {nextDaysData?.map((e, i) => (
        <Day data={e} key={i} />
      ))}
    </div>
  );
};

export default DayPicker;
