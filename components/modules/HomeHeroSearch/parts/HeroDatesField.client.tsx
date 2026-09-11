"use client";

import type { HeroDatesFieldProps } from "@/types/components/modules/home-hero-search";
import { SearchDateRangePicker } from "@modules/PropertySearchFilters";
import { updateDateRange } from "@modules/PropertySearchFilters";
import { useEffect, useRef, useState } from "react";

import _STRINGS from "@/utils/LocalStrings";
import HeroSegment from "./HeroSegment";
import moment from "moment-jalaali";

const DAY_MONTH_FORMAT = "jD jMMMM";

const HeroDatesField = ({
  checkin,
  checkout,
  onChange,
}: HeroDatesFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRange = !!checkin && !!checkout;

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen]);

  const value = hasRange
    ? `${moment(checkin).format(DAY_MONTH_FORMAT)} - ${moment(checkout).format(DAY_MONTH_FORMAT)}`
    : !!checkin
      ? `${moment(checkin).format(DAY_MONTH_FORMAT)} - ...`
      : "";

  return (
    <div ref={containerRef} data-hero-open={isOpen} className="relative min-w-0 flex-1">
      <HeroSegment
        value={value}
        filled={!!checkin}
        onClick={() => setIsOpen(true)}
        label={_STRINGS.HERO_DATES_LABEL}
      />

      {isOpen ? (
        <div className="surface-panel absolute left-1/2 top-[calc(100%+0.75rem)] z-[60] w-[min(92vw,24rem)] -translate-x-1/2 overflow-hidden !rounded-20 p-3 shadow-glass">
          <SearchDateRangePicker
            selectedDates={{
              startDate: checkin
                ? moment(checkin).format("jYYYY/jMM/jD")
                : null,
              endDate: checkout
                ? moment(checkout).format("jYYYY/jMM/jD")
                : null,
            }}
            setSelectedDay={(day) =>
              updateDateRange({
                date: day,
                cb: () => setIsOpen(false),
                state: { checkin, checkout },
                setState: (updater) =>
                  onChange(
                    typeof updater === "function"
                      ? updater({ checkin, checkout })
                      : updater,
                  ),
              })
            }
          />
        </div>
      ) : null}
    </div>
  );
};

export default HeroDatesField;
