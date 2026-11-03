"use client";

import { useEffect, useRef, useState } from "react";
import { selectDay, startOfDay } from "@features/reservations/lib/stay-range";
import { useTranslations } from "next-intl";
import { toDayKey } from "@features/reservations/lib/stay-range";

import type { StayCalendarGridProps } from "@/types/components/modules/property-booking";
import type { StayBlockReason } from "@features/reservations/lib/stay-range";

import StayMonth from "./StayMonth.client";

const HINT_MS = 3500;

const HINT_TEXT = {
  past: "reserve.rangeInPast",
  full: "reserve.dayIsFull",
  reserved: "reserve.rangeHasReservedDay",
} as const satisfies Record<StayBlockReason, string>;

const StayCalendarGrid = ({
  range,
  months,
  reserved,
  onChange,
  propertyId,
  columns = 1,
  lazy = false,
}: StayCalendarGridProps) => {
  const t = useTranslations();
  const [hint, setHint] = useState<{ dateKey: string; text: string } | null>(
    null,
  );
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const today = startOfDay(new Date());

  useEffect(() => () => clearTimeout(timer.current), []);

  const onSelectDay = (date: Date, isReserved: boolean) => {
    const bookedDates = isReserved
      ? new Set([...reserved, toDayKey(date)])
      : reserved;
    const result = selectDay(date, range, bookedDates, today);
    clearTimeout(timer.current);
    if (result.blocked) {
      setHint({ dateKey: toDayKey(date), text: t(HINT_TEXT[result.blocked]) });
      timer.current = setTimeout(() => setHint(null), HINT_MS);
      return;
    }
    setHint(null);
    onChange(result.range);
  };

  return (
    <div className="relative">
      <div
        className={`grid grid-cols-1 gap-x-8 gap-y-6 ${columns === 2 ? "md:grid-cols-2" : ""}`}
      >
        {months.map((month) => (
          <StayMonth
            lazy={lazy}
            alert={hint}
            range={range}
            today={today}
            year={month.year}
            month={month.month}
            reserved={reserved}
            propertyId={propertyId}
            onSelectDay={onSelectDay}
            key={`${month.year}-${month.month}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StayCalendarGrid;
