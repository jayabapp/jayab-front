"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { nightsBetween, toDayKey } from "@features/reservations/lib/stay-range";
import { formatJalaliWeekdayDay } from "@features/reservations/mappers/reservation-dates";
import { usePropertyCalendar } from "@features/properties/hooks/usePropertyCalendar";
import { useListSeparator } from "@hooks/useListSeparator";
import { useTranslations } from "next-intl";
import { useFormatToman } from "@hooks/useFormatToman";
import { dayRangeState } from "@features/reservations/lib/stay-range";
import { isDayDisabled } from "@features/reservations/lib/stay-range";

import { type KeyboardEvent } from "react";

import type { StayMonthProps } from "@/types/components/modules/property-booking";

import formatCalendarCellPrice from "@/helpers/formatCalendarCellPrice";
import StayDayCell from "./StayDayCell";
import moment from "moment-jalaali";

const WEEKDAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const JALALI_PARSE = "jYYYY/jM/jD";

const StayMonth = ({
  lazy,
  year,
  month,
  range,
  today,
  reserved,
  propertyId,
  onSelectDay,
}: StayMonthProps) => {
  const formatToman = useFormatToman();

  const t = useTranslations("reserve");
  const sep = useListSeparator();
  const tCalendar = useTranslations("calendar");

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

  const { data: calendar, isPending: isCalendarPending } = usePropertyCalendar(
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

  const firstDay = 1;
  const lead = weekdayOfFirst;

  const byDay = useMemo(
    () => new Map((calendar ?? []).map((entry) => [entry.day, entry])),
    [calendar],
  );

  const stayNights =
    range.start && range.end ? nightsBetween(range.start, range.end) : 0;

  const moveFocus = (date: Date, offset: number) => {
    const key = toDayKey(moment(date).add(offset, "day").toDate());
    document
      .querySelector<HTMLButtonElement>(`[data-stay-date="${key}"]`)
      ?.focus();
  };

  const onDayKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    date: Date,
  ) => {
    const visualWeekday = (moment(date).day() + 1) % 7;
    const offsets: Record<string, number> = {
      ArrowDown: 7,
      ArrowLeft: 1,
      ArrowRight: -1,
      ArrowUp: -7,
      End: 6 - visualWeekday,
      Home: -visualWeekday,
    };
    const offset = offsets[event.key];
    if (offset === undefined) return;
    event.preventDefault();
    moveFocus(date, offset);
  };

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
            {tCalendar(`short${weekday}`)}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: lead }, (_, index) => (
          <div key={`lead-${index}`} aria-hidden="true" />
        ))}

        {Array.from({ length: daysInMonth - firstDay + 1 }, (_, offset) => {
          const day = firstDay + offset;
          const gridPosition = lead + offset;
          const row = Math.floor(gridPosition / 7);
          const column = gridPosition % 7;
          const date = first
            .clone()
            .add(day - 1, "day")
            .toDate();
          const entry = byDay.get(day);
          const state = dayRangeState(date, range);
          const isReserved =
            date >= today &&
            (reserved.has(toDayKey(date)) || !!entry?.is_reserved);
          const price = entry?.discounted_price || entry?.price;
          const isDisabled = isDayDisabled(date, range, reserved, today);
          const isFriday = moment(date).day() === 5;
          const availability = isReserved
            ? t("dayReserved")
            : isDisabled
              ? t("dayUnavailable")
              : t("dayAvailable");
          const priceLabel = price ? `${sep}${formatToman(price)}` : "";

          return (
            <StayDayCell
              key={day}
              day={day}
              row={row}
              state={state}
              column={column}
              isFriday={isFriday}
              disabled={isDisabled}
              isReserved={isReserved}
              dateKey={toDayKey(date)}
              isPeak={!!entry?.is_peak}
              isLoading={isCalendarPending}
              onSelect={() => onSelectDay(date)}
              discounted={!!entry?.discounted_price}
              price={formatCalendarCellPrice(price)}
              onKeyDown={(event) => onDayKeyDown(event, date)}
              label={`${formatJalaliWeekdayDay(date)}${priceLabel}${sep}${availability}`}
              tooltip={
                state === "end" && stayNights
                  ? `${t("stayNights", { count: Number(stayNights) })}`
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
