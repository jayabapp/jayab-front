"use client";

import type { StayCalendarSectionProps } from "@/types/components/modules/property-booking";
import { useStaySearchParams } from "@features/reservations/hooks/useStaySearchParams";
import { useReservedDates } from "@features/properties/hooks/useReservedDates";
import { reservedKeysFromDates } from "@features/reservations/lib/stay-range";
import { STAY_MONTH_HORIZON } from "@features/reservations/lib/stay-months";
import { isCompleteRange } from "@features/reservations/lib/stay-range";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { StayRange } from "@features/reservations/lib/stay-range";
import { stayMonths } from "@features/reservations/lib/stay-months";
import { Icon } from "@elements/Icon";

import StayCalendarGrid from "./parts/StayCalendarGrid.client";
import StayCalendarLegend from "./parts/StayCalendarLegend";
import _STRINGS from "@/utils/LocalStrings";

const SWIPE_PX = 50;
const DESKTOP_QUERY = "(min-width: 768px)";

const subscribeToDesktop = (notify: () => void) => {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

const useIsDesktop = () =>
  useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
const NAV_BUTTON_CLASS =
  "flex size-9 cursor-pointer items-center justify-center rounded-full border border-neutral-200 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-40";

const StayCalendarSection = ({ propertyId }: StayCalendarSectionProps) => {
  const { setStay, stay } = useStaySearchParams();
  const { data: reservedDates } = useReservedDates(propertyId);
  const reserved = useMemo(
    () => reservedKeysFromDates(reservedDates),
    [reservedDates],
  );

  const isDesktop = useIsDesktop();
  const visibleMonths = isDesktop ? 2 : 1;
  const [offset, setOffset] = useState(0);
  const [arrival, setArrival] = useState<Date | null>(null);
  const touchStart = useRef<number | null>(null);

  const range: StayRange = arrival ? { start: arrival } : (stay ?? {});
  const canPrev = offset > 0;
  const canNext = offset < STAY_MONTH_HORIZON - visibleMonths;
  const months = useMemo(
    () =>
      stayMonths(
        Math.min(offset, STAY_MONTH_HORIZON - visibleMonths),
        visibleMonths,
      ),
    [offset, visibleMonths],
  );

  const onChange = (next: StayRange) => {
    if (isCompleteRange(next)) {
      setArrival(null);
      setStay(next);
      return;
    }
    setArrival(next.start ?? null);
  };

  const onTouchEnd = (clientX: number) => {
    if (touchStart.current === null) return;
    const delta = clientX - touchStart.current;
    touchStart.current = null;
    if (delta < -SWIPE_PX && canNext) setOffset((value) => value + 1);
    if (delta > SWIPE_PX && canPrev) setOffset((value) => value - 1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <StayCalendarLegend />
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!canPrev}
            className={NAV_BUTTON_CLASS}
            aria-label={_STRINGS.LAST_MONTH}
            onClick={() => setOffset((value) => value - 1)}
          >
            <Icon name="chevron-down" size={16} className="-rotate-90" />
          </button>
          <button
            type="button"
            disabled={!canNext}
            className={NAV_BUTTON_CLASS}
            aria-label={_STRINGS.NEXT_MONTH}
            onClick={() => setOffset((value) => value + 1)}
          >
            <Icon name="chevron-down" size={16} className="rotate-90" />
          </button>
        </div>
      </div>

      <div
        onTouchStart={(event) => {
          touchStart.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) =>
          onTouchEnd(event.changedTouches[0]?.clientX ?? 0)
        }
      >
        <StayCalendarGrid
          range={range}
          months={months}
          reserved={reserved}
          onChange={onChange}
          propertyId={propertyId}
          columns={isDesktop ? 2 : 1}
        />
      </div>
    </div>
  );
};

export default StayCalendarSection;
