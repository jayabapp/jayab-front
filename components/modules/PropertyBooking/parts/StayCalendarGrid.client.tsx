"use client";

import { useEffect, useRef, useState } from "react";
import { selectDay, startOfDay } from "@features/reservations/lib/stay-range";
import { useTranslations } from "next-intl";

import type { StayCalendarGridProps } from "@/types/components/modules/property-booking";
import type { StayBlockReason } from "@features/reservations/lib/stay-range";

import StayMonth from "./StayMonth.client";

const HINT_MS = 2800;

const HINT_TEXT = {
  past: "reserve.rangeInPast",
  reserved: "reserve.rangeHasReservedDay",
  too_long: "reserve.rangeTooLong",
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
  const [hint, setHint] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const today = startOfDay(new Date());

  useEffect(() => () => clearTimeout(timer.current), []);

  const onSelectDay = (date: Date) => {
    const result = selectDay(date, range, reserved, today);
    clearTimeout(timer.current);
    if (result.blocked) {
      setHint(t(HINT_TEXT[result.blocked]));
      timer.current = setTimeout(() => setHint(null), HINT_MS);
      return;
    }
    setHint(null);
    onChange(result.range);
  };

  return (
    <div className="relative">
      <p
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute inset-x-0 -top-2 z-10 mx-auto w-fit rounded-full bg-danger-50 px-3 py-1 text-xs text-danger-500 transition-opacity ${hint ? "opacity-100" : "opacity-0"}`}
      >
        {hint}
      </p>

      <div
        className={`grid grid-cols-1 gap-x-8 gap-y-6 ${columns === 2 ? "md:grid-cols-2" : ""}`}
      >
        {months.map((month) => (
          <StayMonth
            lazy={lazy}
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
