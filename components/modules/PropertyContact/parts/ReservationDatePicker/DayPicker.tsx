/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-vars -- Preserve reservation-range behavior while relocating the established Jalali grid. */

import type {
  ReservationCalendarDay,
  ReservationDayPickerProps,
  ReservationSelectedDay,
} from "@/types/components/modules/reservation-date-picker";
import { useCallback, useEffect, useMemo, useState } from "react";

import moment from "moment-jalaali";
import Day from "./Day";

moment.loadPersian({ dialect: "persian-modern" });

const DAYS_OF_WEEK = [
  "شنبه",
  "یک‌شنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
] as const;
const DAYS_OF_WEEK_ISO: { [key: string]: any } = {
  "1": 2,
  "2": 3,
  "3": 4,
  "4": 5,
  "5": 6,
  "6": 0,
  "7": 1,
} as const;

const DayPicker = ({
  year,
  date,
  month,
  options,
  dateSpan,
  setDateSpan,
  active_days,
  selectedDate,
  callenderData,
  forbiden_dates,
  setSelectedDay,
  freeDaysOfMonth,
  smallerDateFonts,
}: ReservationDayPickerProps) => {
  const today = useMemo(
    () => ({
      day: Number(moment().format("jD")),
      month: moment().format("jMM"),
      year: moment().format("jYYYY"),
    }),
    [],
  );

  const initialSelectedDayId = useMemo<ReservationSelectedDay>(() => {
    if (selectedDate) {
      const momentDate = moment(selectedDate, "jYYYY/jMM/jD");
      return {
        day: momentDate.jDate(),
        month: momentDate.format("jMM"),
        year: momentDate.format("jYYYY"),
      };
    }
    return {
      day: moment().jDate(),
      month,
      year,
    };
  }, [selectedDate, month, year]);

  const [selectedDayId, setSelectedDayId] =
    useState<ReservationSelectedDay>(initialSelectedDayId);
  const [daysData, setDaysData] = useState<ReservationCalendarDay[]>([]);

  const monthInfo = useMemo(() => {
    const yearNum = Number(year);
    const monthNum = Number(month);
    const dateMoment = moment(date, "jYYYY/jMM/jDD");
    return {
      numberOfDays: moment.jDaysInMonth(yearNum, monthNum - 1),
      numberOfDaysLast: moment.jDaysInMonth(yearNum, monthNum - 2),
      startOfMonth: dateMoment.startOf("jMonth").format("dddd"),
      startOfMonthIndex: DAYS_OF_WEEK_ISO[
        `${dateMoment.startOf("jMonth").isoWeekday()}`
      ] as any,
      monthName: dateMoment.format("jMMMM"),
    };
  }, [year, month, date]);

  const callenderDataMap = useMemo(() => {
    if (!callenderData) return new Map<number, any>();

    const map = new Map<number, any>();
    callenderData.forEach((item) => {
      if (item.day !== undefined) map.set(item.day, item);
    });
    return map;
  }, [callenderData]);

  const activeDaysSet = useMemo(() => {
    if (!active_days) return new Set<number>();
    return new Set(active_days);
  }, [active_days]);

  useEffect(() => {
    const { numberOfDays } = monthInfo;
    if (!activeDaysSet.size) {
      const defaultDays = Array.from({ length: numberOfDays }, (_, i) => ({
        id: i + 1,
        month,
        year,
        isActive: false,
      }));
      setDaysData(defaultDays);
      return;
    }

    const newDaysData: ReservationCalendarDay[] = [];

    for (let i = 1; i <= numberOfDays; i++) {
      const dayKey = `${year}/${month}/${i}`;
      const dayMoment = moment(dayKey, "jYYYY/jMM/jD");
      const dayOfWeek = dayMoment.day();
      const callenderItem = callenderDataMap.get(i);
      newDaysData.push({
        id: i,
        month,
        year,
        price: callenderItem?.price,
        is_reserved: callenderItem?.is_reserved,
        discounted_price: callenderItem?.discounted_price,
        is_peak: !!callenderItem?.is_peak,
        isActive: activeDaysSet.has(dayOfWeek),
      });
    }
    setDaysData(newDaysData);
  }, [monthInfo.numberOfDays, month, year, activeDaysSet, callenderDataMap]);

  const lastDaysMemos = useMemo(() => {
    const { startOfMonth, numberOfDaysLast, numberOfDays, startOfMonthIndex } =
      monthInfo;
    const lengthOfBefore = startOfMonthIndex;

    if (lengthOfBefore <= 0) return [];

    const lastDays = [];
    let lastDay = numberOfDaysLast;

    for (let i = 0; i < lengthOfBefore; i++) {
      lastDays.unshift({ id: lastDay-- });
    }

    return lastDays;
  }, [monthInfo, daysData.length]);

  const nextDaysMemo = useMemo(() => {
    const { startOfMonth } = monthInfo;
    const lengthOfBefore = DAYS_OF_WEEK.findIndex(
      (day) => day === startOfMonth,
    );

    let totalCells;
    if (lengthOfBefore === -1) totalCells = 35;
    else if (lengthOfBefore > 4) totalCells = 42;
    else totalCells = 35;
    const daysNeeded = Math.max(
      0,
      totalCells - (lengthOfBefore + daysData.length),
    );

    return Array.from({ length: daysNeeded }, (_, i) => ({
      id: i + 1,
    }));
  }, [monthInfo, daysData.length]);

  const selectADate = useCallback(
    (e: { id?: number | string; reserved?: number | string }) => {
      if (!e.id || !setSelectedDay) return;
      const dayNumber = Number(e.id);
      if (options?.valueType === "persian") {
        const persianDate = moment(
          `${year}/${month}/${dayNumber}`,
          "jYYYY/jMM/jD",
        ).format("jYYYY/jMM/jD");
        setSelectedDay(persianDate);
      } else if (options?.valueType === "global") {
        setSelectedDay(`${year}/${month}/${dayNumber}`);
      }

      setSelectedDayId({
        day: dayNumber,
        month,
        year,
      });
    },
    [setSelectedDay, options?.valueType, year, month],
  );

  const renderDays = useMemo(
    () =>
      daysData.map((day) => (
        <Day
          data={day}
          year={year}
          today={today}
          month={month}
          dateSpan={dateSpan}
          onSelect={selectADate}
          setDateSpan={setDateSpan}
          selectedDayId={selectedDayId}
          forbiden_dates={forbiden_dates}
          freeDaysOfMonth={freeDaysOfMonth}
          smallerDateFonts={smallerDateFonts}
          maxSpanLength={options?.maxSpanLength}
          key={`day-${day.id}-${month}-${year}`}
          showTimeOfTheDay={options?.showTimeOfTheDay}
        />
      )),
    [
      daysData,
      smallerDateFonts,
      freeDaysOfMonth,
      today,
      selectADate,
      selectedDayId,
      year,
      month,
      options?.showTimeOfTheDay,
      dateSpan,
    ],
  );

  const renderEmptyDays = (days: Array<{ id: number }>, prefix: string) =>
    days.map((_, index) => <div key={`${prefix}-${index}`} />);

  return (
    <div className="grid grid-cols-7  transition-all duration-500 ease-in-out gap-y-1 md:gap-y-2 items-center">
      {renderEmptyDays(lastDaysMemos, "last")}
      {renderDays}
      {renderEmptyDays(nextDaysMemo, "next")}
    </div>
  );
};

export default DayPicker;
