"use client";

import {
  dayRangeState,
  isDayDisabled,
} from "@features/reservations/lib/stay-range";
import { formatJalaliWeekdayDay } from "@features/reservations/mappers/reservation-dates";
import { usePropertyCalendar } from "@features/properties/hooks/usePropertyCalendar";
import type { StayMonthProps } from "@/types/components/modules/property-booking";
import { nightsBetween, toDayKey } from "@features/reservations/lib/stay-range";
import { useEffect, useMemo, useRef, useState } from "react";

import formatCompactToman from "@/helpers/formatCompactToman";
import _STRINGS from "@/utils/LocalStrings";
import StayDayCell from "./StayDayCell";
import moment from "moment-jalaali";

const WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const JALALI_PARSE = "jYYYY/jM/jD";

const StayMonth = ({
  lazy,
  month,
  onSelectDay,
  propertyId,
  range,
  reserved,
  today,
  year,
}: StayMonthProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(!lazy);

  useEffect(() => {
    if (seen || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setSeen(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [seen]);

  const { data: calendar } = usePropertyCalendar(
    propertyId,
    { month, year },
    seen,
  );

  const first = useMemo(
    () => moment(`${year}/${month}/1`, JALALI_PARSE).startOf("day"),
    [month, year],
  );
  const daysInMonth = moment.jDaysInMonth(year, month - 1);
  const weekdayOfFirst = (first.day() + 1) % 7;

  const isCurrentMonth =
    moment(today).jYear() === year && moment(today).jMonth() + 1 === month;
  const todayWeek = isCurrentMonth
    ? Math.floor((weekdayOfFirst + moment(today).jDate() - 1) / 7)
    : 0;
  const firstDay = todayWeek > 0 ? todayWeek * 7 - weekdayOfFirst + 1 : 1;
  const lead = todayWeek > 0 ? 0 : weekdayOfFirst;

  const byDay = useMemo(
    () => new Map((calendar ?? []).map((entry) => [entry.day, entry])),
    [calendar],
  );

  const stayNights =
    range.start && range.end ? nightsBetween(range.start, range.end) : 0;

  return (
    <div
      ref={ref}
      data-stay-month={`${year}-${month}`}
      className="flex flex-col gap-3 [contain-intrinsic-size:auto_22rem] [content-visibility:auto]"
    >
      <p className="mx-auto w-fit rounded-full bg-neutral-100 px-4 py-1 text-sm font-semibold text-neutral-900">
        {first.format("jMMMM jYYYY")}
      </p>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((weekday) => (
          <p
            key={weekday}
            className="text-center text-xs font-bold text-neutral-500"
          >
            {weekday}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: lead }, (_, index) => (
          <div key={`lead-${index}`} aria-hidden="true" />
        ))}

        {Array.from({ length: daysInMonth - firstDay + 1 }, (_, offset) => {
          const day = firstDay + offset;
          const date = first
            .clone()
            .add(day - 1, "day")
            .toDate();
          const entry = byDay.get(day);
          const state = dayRangeState(date, range);
          // A night already gone is just past; striping it as "reserved" reads as noise.
          const isReserved =
            date >= today &&
            (reserved.has(toDayKey(date)) || !!entry?.is_reserved);
          const price = entry?.discounted_price || entry?.price;

          return (
            <StayDayCell
              key={day}
              day={day}
              state={state}
              isReserved={isReserved}
              isPeak={!!entry?.is_peak}
              price={formatCompactToman(price)}
              onSelect={() => onSelectDay(date)}
              label={formatJalaliWeekdayDay(date)}
              discounted={!!entry?.discounted_price}
              disabled={isDayDisabled(date, range, reserved, today)}
              tooltip={
                state === "end" && stayNights
                  ? `${stayNights} ${_STRINGS.NIGHTS_OF_STAY}`
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default StayMonth;
