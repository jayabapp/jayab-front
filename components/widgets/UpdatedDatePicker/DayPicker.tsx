import moment from "moment-jalaali";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import Day from "./Day";

moment.loadPersian({ dialect: "persian-modern" });

const DAYS_OF_WEEK = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"] as const;

interface DayData {
  id: number;
  month: string;
  year: string;
  price?: number;
  is_reserved?: boolean;
  discounted_price?: number;
  has_memo?: boolean;
  is_peak?: boolean;
  isActive?: boolean;
}

interface TodayData {
  day: number;
  month: string;
  year: string;
}

interface SelectedDayId {
  day: number;
  month: string;
  year: string;
}

type Props = {
  callenderData?: any[] | undefined;
  month: string;
  year: string;
  active_days?: number[] | undefined;
  date: number | string;
  Loading?: boolean;
  smallerDateFonts?: boolean;
  selectedDate?: string | number;
  setSelectedDay?: (e: any | null) => void | null;
  freeDaysOfMonth?: boolean;

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
  setDateSpan,
  dateSpan,
  forbiden_dates,
}: Props) => {
  // Memoize today's date to prevent recalculation on every render
  const today = useMemo<TodayData>(
    () => ({
      day: Number(moment().format("jD")),
      month: moment().format("jMM"),
      year: moment().format("jYYYY"),
    }),
    [],
  );

  // Memoize selected day initialization
  const initialSelectedDayId = useMemo<SelectedDayId>(() => {
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

  const [selectedDayId, setSelectedDayId] = useState<SelectedDayId>(initialSelectedDayId);
  const [daysData, setDaysData] = useState<DayData[]>([]);

  // Memoize month information
  const monthInfo = useMemo(() => {
    const yearNum = Number(year);
    const monthNum = Number(month);
    const dateMoment = moment(date, "jYYYY/jMM/jDD");

    return {
      numberOfDays: moment.jDaysInMonth(yearNum, monthNum - 1),
      numberOfDaysLast: moment.jDaysInMonth(yearNum, monthNum - 2),
      startOfMonth: dateMoment.startOf("jMonth").format("dddd"),
    };
  }, [year, month, date]);

  // Memoize callender data map for faster lookups
  const callenderDataMap = useMemo(() => {
    if (!callenderData) return new Map<number, any>();

    const map = new Map<number, any>();
    callenderData.forEach((item) => {
      if (item.day !== undefined) {
        map.set(item.day, item);
      }
    });
    return map;
  }, [callenderData]);

  // Memoize active days set for O(1) lookups
  const activeDaysSet = useMemo(() => {
    if (!active_days) return new Set<number>();
    return new Set(active_days);
  }, [active_days]);

  // Generate days data
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

    const newDaysData: DayData[] = [];

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

  // Memoize last days (days from previous month)
  const lastDaysMemos = useMemo(() => {
    const { startOfMonth, numberOfDaysLast } = monthInfo;
    const lengthOfBefore = DAYS_OF_WEEK.findIndex((day) => day === startOfMonth);

    if (lengthOfBefore <= 0) return [];

    const lastDays = [];
    let lastDay = numberOfDaysLast;

    for (let i = 0; i < lengthOfBefore; i++) {
      lastDays.unshift({ id: lastDay-- });
    }

    return lastDays;
  }, [monthInfo, daysData.length]);

  // Memoize next days (days from next month)
  const nextDaysMemo = useMemo(() => {
    const { startOfMonth } = monthInfo;
    const lengthOfBefore = DAYS_OF_WEEK.findIndex((day) => day === startOfMonth);

    let totalCells;
    if (lengthOfBefore === -1) {
      totalCells = 35;
    } else if (lengthOfBefore > 4) {
      totalCells = 42;
    } else {
      totalCells = 35;
    }

    const daysNeeded = Math.max(0, totalCells - (lengthOfBefore + daysData.length));

    return Array.from({ length: daysNeeded }, (_, i) => ({
      id: i + 1,
    }));
  }, [monthInfo, daysData.length]);

  // Memoize date selection handler
  const selectADate = useCallback(
    (e: { id?: number | string; reserved?: number | string }) => {
      if (!e.id || !setSelectedDay) return;

      const dayNumber = Number(e.id);

      if (options?.valueType === "persian") {
        const persianDate = moment(`${year}/${month}/${dayNumber}`, "jYYYY/jMM/jD").format("jYYYY/jMM/jD");
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

  // Optimize rendering of Day components
  const renderDays = useMemo(
    () =>
      daysData.map((day) => (
        <Day
          smallerDateFonts={smallerDateFonts}
          freeDaysOfMonth={freeDaysOfMonth}
          today={today}
          data={day}
          key={`day-${day.id}-${month}-${year}`}
          onSelect={selectADate}
          selectedDayId={selectedDayId}
          year={year}
          month={month}
          showTimeOfTheDay={options?.showTimeOfTheDay}
          dateSpan={dateSpan}
          setDateSpan={setDateSpan}
          maxSpanLength={options?.maxSpanLength}
          forbiden_dates={forbiden_dates}
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
