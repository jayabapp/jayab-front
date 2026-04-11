import { OwnerCallendarItemDto } from "@/api_services/property/property.interface";
import moment from "moment-jalaali";
import { useEffect, useMemo, useState } from "react";
import Day from "./Day";
moment.loadPersian({ dialect: "persian-modern" });
type props = {
  callenderData?: OwnerCallendarItemDto[] | undefined;
  month: string;
  year: string;
  active_days?: number[] | undefined;
  date: number | string;
  Loading: boolean;
  smallerDateFonts?: boolean;
  selectedDate?: string | number;
  setSelectedDay?: (e: any | null) => void | null;
  options?: { valueType?: "persian" | "global"; showTimeOfTheDay?: boolean; disableDaySelect?: boolean };
  freeDaysOfMonth?: boolean;
};

const daysOfOurLives = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
const DayPicker = ({
  month,
  year,
  date,
  freeDaysOfMonth,
  selectedDate,
  setSelectedDay,
  options,
  callenderData,
  active_days,
  smallerDateFonts,
}: props) => {
  const today = { day: Number(moment().format("jD")), month: moment().format("jMM"), year: moment().format("jYYYY") };

  const [selectedDayId, setSelectedDayId] = useState(
    !!selectedDate
      ? {
          day: Number(moment(selectedDate, `jYYYY/jMM/jD`).format("jD")),
          month: moment(selectedDate, `jYYYY/jMM/jD`).format("jMM"),
          year: moment(selectedDate, `jYYYY/jMM/jD`).format("jYYYY"),
        }
      : { day: moment().jDate(), month: month, year: year },
  );
  const [numberOfDays, setNumberOfDays] = useState(moment.jDaysInMonth(Number(year), Number(month) - 1));

  const [numberOfDaysLast, setNumberOfDaysLast] = useState(moment.jDaysInMonth(Number(year), Number(month) - 2));
  const [startOfMonth, setStartOfMonth] = useState(moment(date, "jYYYY/jMM/jDD").startOf("jMonth").format("dddd"));
  const [lastDaysData, setLastDaysData] = useState<{ [key: string]: any }[] | []>([]);
  const [nextDaysData, setNextDaysData] = useState<{ [key: string]: any }[] | []>([]);

  const [daysData, setDaysData] = useState(
    Array.from({ length: numberOfDays }, (e, i) => {
      return { id: i + 1, month: month, year: year, isActive: false };
    }),
  );

  useEffect(() => {
    if (!!active_days)
      setDaysData(
        Array.from({ length: numberOfDays }, (e, i) => {
          return {
            id: i + 1,
            month: month,
            year: year,
            price: callenderData?.find((e) => e?.day == i + 1)?.price,
            is_reserved: callenderData?.find((e) => e?.day == i + 1)?.is_reserved,
            discounted_price: callenderData?.find((e) => e?.day == i + 1)?.discounted_price,
            has_memo: !!callenderData?.find((e) => e?.day == i + 1)?.note,
            is_peak: !!callenderData?.find((e) => e?.day == i + 1)?.is_peak,
            isActive: !!active_days.includes(moment(`${year}/${month}/${i + 1}`, `jYYYY/jMM/jD`).day()),
          };
        }),
      );
  }, [numberOfDays, date, month, year, callenderData]);

  useEffect(() => {
    setNumberOfDays(moment.jDaysInMonth(Number(year), Number(month) - 1));

    setNumberOfDaysLast(moment.jDaysInMonth(Number(year), Number(month) - 2));
    setStartOfMonth(moment(date, "jYYYY/jMM/jDD").startOf("jMonth").format("dddd"));
  }, [month, year, date]);

  // useEffect(() => {
  //   const lengthOfBefore = daysOfOurLives?.findIndex((e) => e == startOfMonth);
  //   let lasts = numberOfDaysLast + 1;
  //   setLastDaysData(
  //     Array.from({ length: lengthOfBefore }, (e, i) => {
  //       lasts = lasts - 1;
  //       return { id: lasts };
  //     }).reverse()
  //   );
  // }, [startOfMonth]);

  const lastDaysMemos = useMemo(() => {
    const lengthOfBefore = daysOfOurLives?.findIndex((e) => e == startOfMonth);
    let lasts = numberOfDaysLast + 1;
    return Array.from({ length: lengthOfBefore }, (e, i) => {
      lasts = lasts - 1;
      return { id: lasts };
    }).reverse();
  }, [startOfMonth, daysOfOurLives]);

  const nextDaysMemo = useMemo(() => {
    const lengthOfBefore = daysOfOurLives?.findIndex((e) => e == startOfMonth);
    return Array.from(
      {
        length:
          lengthOfBefore == -1
            ? 35 - daysData?.length
            : lengthOfBefore > 4
              ? 42 - (lengthOfBefore + daysData?.length)
              : 35 - (lengthOfBefore + daysData?.length),
      },
      (e, i) => {
        return { id: i + 1 };
      },
    );
  }, [lastDaysData, daysOfOurLives, daysData]);

  // useEffect(() => {
  //   const lengthOfBefore = daysOfOurLives?.findIndex((e) => e == startOfMonth);
  //   setNextDaysData(
  //     Array.from(
  //       {
  //         length:
  //           lengthOfBefore == -1
  //             ? 35 - daysData?.length
  //             : lengthOfBefore > 4
  //             ? 42 - (lengthOfBefore + daysData?.length)
  //             : 35 - (lengthOfBefore + daysData?.length),
  //       },
  //       (e, i) => {
  //         return { id: i + 1 };
  //       }
  //     )
  //   );
  // }, [lastDaysData]);

  const selectADate = (e: { id?: number | string; reserved?: number | string }) => {
    if (setSelectedDay && options?.valueType == "persian") {
      setSelectedDay(moment(`${year}/${month}/${e?.id}`, "jYYYY/jMM/jD").format("jYYYY/jMM/jD"));
    } else if (setSelectedDay && options?.valueType == "global") {
      setSelectedDay(`${year}/${month}/${e?.id}`);
    }
    if (e?.id) {
      setSelectedDayId({ day: Number(e?.id), month: month, year: year });
    }
  };
  // useEffect(()=>{

  // },[])

  return (
    <div className="grid grid-cols-7   transition-all duration-500 ease-in-out gap-y-1 md:gap-y-2 items-center">
      {" "}
      {lastDaysMemos?.map((e, i) => (
        // <Day data={e} key={i} />
        <div key={`${i}start`}> </div>
      ))}
      {daysData?.map((e, i) => (
        <Day
          smallerDateFonts={smallerDateFonts}
          freeDaysOfMonth={freeDaysOfMonth}
          today={today}
          data={e}
          key={i}
          onSelect={selectADate}
          selectedDayId={selectedDayId}
          year={year}
          month={month}
          showTimeOfTheDay={options?.showTimeOfTheDay}
          disableClick={options?.disableDaySelect}
        />
      ))}
      {nextDaysMemo?.map((e, i) => (
        // <Day data={e} key={i} />
        <div key={`${i}end`}> </div>
      ))}
    </div>
  );
};

export default DayPicker;
