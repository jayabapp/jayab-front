/* eslint-disable react-hooks/set-state-in-effect, react-hooks/immutability, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-vars -- Preserve the proven Jalali grid algorithm during the ownership migration. */

import type { JalaliDayPickerProps } from "@/types/components/elements/jalali-calendar";
import { useEffect, useMemo, useState } from "react";

import moment from "moment-jalaali";
import Day from "./Day";

moment.loadPersian({ dialect: "persian-modern" });

const DAYS_OF_WEEK_ISO: { [key: string]: any } = {
  "1": 2,
  "2": 3,
  "3": 4,
  "4": 5,
  "5": 6,
  "6": 0,
  "7": 1,
} as const;
const daysOfOurLives = [
  "شنبه",
  "یک‌شنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];
const DayPicker = ({
  year,
  date,
  month,
  options,
  multiSelect,
  active_days,
  onToggleDay,
  selectedDate,
  selectedDays,
  callenderData,
  setSelectedDay,
  freeDaysOfMonth,
  smallerDateFonts,
}: JalaliDayPickerProps) => {
  const today = {
    day: Number(moment().format("jD")),
    month: moment().format("jMM"),
    year: moment().format("jYYYY"),
  };

  const [selectedDayId, setSelectedDayId] = useState(
    !!selectedDate
      ? {
          day: Number(moment(selectedDate, `jYYYY/jMM/jD`).format("jD")),
          month: moment(selectedDate, `jYYYY/jMM/jD`).format("jMM"),
          year: moment(selectedDate, `jYYYY/jMM/jD`).format("jYYYY"),
        }
      : { day: moment().jDate(), month: month, year: year },
  );
  const [numberOfDays, setNumberOfDays] = useState(
    moment.jDaysInMonth(Number(year), Number(month) - 1),
  );

  const [numberOfDaysLast, setNumberOfDaysLast] = useState(
    moment.jDaysInMonth(Number(year), Number(month) - 2),
  );
  const [startOfMonth, setStartOfMonth] = useState(
    DAYS_OF_WEEK_ISO[
      `${moment(date, "jYYYY/jMM/jDD").startOf("jMonth").isoWeekday()}`
    ],
  );
  const [lastDaysData, setLastDaysData] = useState<
    { [key: string]: any }[] | []
  >([]);
  const [nextDaysData, setNextDaysData] = useState<
    { [key: string]: any }[] | []
  >([]);

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
            is_reserved: callenderData?.find((e) => e?.day == i + 1)
              ?.is_reserved,
            discounted_price: callenderData?.find((e) => e?.day == i + 1)
              ?.discounted_price,
            has_memo: !!callenderData?.find((e) => e?.day == i + 1)?.note,
            is_peak: !!callenderData?.find((e) => e?.day == i + 1)?.is_peak,
            isActive: !!active_days.includes(
              moment(`${year}/${month}/${i + 1}`, `jYYYY/jMM/jD`).day(),
            ),
          };
        }),
      );
  }, [numberOfDays, date, month, year, callenderData]);

  useEffect(() => {
    setNumberOfDays(moment.jDaysInMonth(Number(year), Number(month) - 1));

    setNumberOfDaysLast(moment.jDaysInMonth(Number(year), Number(month) - 2));
    setStartOfMonth(
      DAYS_OF_WEEK_ISO[
        `${moment(date, "jYYYY/jMM/jDD").startOf("jMonth").isoWeekday()}`
      ],
    );
  }, [month, year, date]);

  const lastDaysMemos = useMemo(() => {
    const lengthOfBefore = startOfMonth;
    let lasts = numberOfDaysLast + 1;
    return Array.from({ length: lengthOfBefore }, (e, i) => {
      lasts = lasts - 1;
      return { id: lasts };
    }).reverse();
  }, [startOfMonth, daysOfOurLives]);

  const nextDaysMemo = useMemo(() => {
    const lengthOfBefore = startOfMonth;
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

  const persianDate = (dayId?: number | string) =>
    moment(`${year}/${month}/${dayId}`, "jYYYY/jMM/jD").format("jYYYY/jMM/jD");

  const selectADate = (e: {
    id?: number | string;
    reserved?: number | string;
  }) => {
    if (!!multiSelect) {
      if (onToggleDay && e?.id) onToggleDay(persianDate(e?.id));
      return;
    }
    if (setSelectedDay && options?.valueType == "persian") {
      setSelectedDay(persianDate(e?.id));
    } else if (setSelectedDay && options?.valueType == "global") {
      setSelectedDay(`${year}/${month}/${e?.id}`);
    }
    if (e?.id)
      setSelectedDayId({ day: Number(e?.id), month: month, year: year });
  };

  return (
    <div className="grid grid-cols-7   transition-all duration-500 ease-in-out gap-y-1 md:gap-y-2 items-center">
      {" "}
      {lastDaysMemos?.map((e, i) => (
        <div key={`${i}start`}> </div>
      ))}
      {daysData?.map((e, i) => (
        <Day
          key={i}
          data={e}
          year={year}
          today={today}
          month={month}
          onSelect={selectADate}
          selectedDayId={selectedDayId}
          freeDaysOfMonth={freeDaysOfMonth}
          smallerDateFonts={smallerDateFonts}
          disableClick={options?.disableDaySelect}
          showTimeOfTheDay={options?.showTimeOfTheDay}
          isMultiSelected={
            !!multiSelect
              ? !!selectedDays?.includes(persianDate(e?.id))
              : undefined
          }
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
