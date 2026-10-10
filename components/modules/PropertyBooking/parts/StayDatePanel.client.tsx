"use client";

import { useEffect, useRef, useState } from "react";
import { STAY_MONTH_HORIZON } from "@features/reservations/lib/stay-months";
import { isCompleteRange } from "@features/reservations/lib/stay-range";
import { useTranslations } from "next-intl";
import { nightsBetween } from "@features/reservations/lib/stay-range";
import { stayMonths } from "@features/reservations/lib/stay-months";
import { Icon } from "@elements/Icon";

import type { StayDatePickerProps } from "@/types/components/modules/property-booking";
import type { StayRange } from "@features/reservations/lib/stay-range";

import StayCalendarLegend from "./StayCalendarLegend";
import StayCalendarGrid from "./StayCalendarGrid.client";
import StayDateFields from "./StayDateFields.client";
import moment from "moment-jalaali";

const SCROLL_CLOSE_PX = 240;
const VISIBLE_MONTHS = 2;

const monthOffsetOf = (start?: Date | null) => {
  if (!start) return 0;
  const now = moment();
  const target = moment(start);
  const offset =
    (target.jYear() - now.jYear()) * 12 + (target.jMonth() - now.jMonth());
  return Math.min(Math.max(offset, 0), STAY_MONTH_HORIZON - VISIBLE_MONTHS);
};

const StayDatePanel = ({
  initial,
  onClose,
  reserved,
  onConfirm,
  propertyId,
}: StayDatePickerProps) => {
  const t = useTranslations();

  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const [draft, setDraft] = useState<StayRange>(initial);
  const [offset, setOffset] = useState(() => monthOffsetOf(initial.start));

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    ref.current?.focus();
    const startY = window.scrollY;
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        closeRef.current();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > SCROLL_CLOSE_PX)
        closeRef.current();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const complete = isCompleteRange(draft) ? draft : null;
  const nights = complete ? nightsBetween(complete.start, complete.end) : 0;
  const activeField = !draft.start ? "checkIn" : !draft.end ? "checkOut" : null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-label={t("reserve.tripDate")}
      className="popover-enter absolute left-0 top-0 z-30 flex w-[min(46rem,calc(100vw-2rem))] flex-col gap-4 rounded-20 bg-surface p-5 shadow-glass focus:outline-none"
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <StayDateFields
            expanded
            end={draft.end}
            start={draft.start}
            activeField={activeField}
            onOpen={(field) => {
              if (field === "checkIn") setDraft({});
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={t("common.lastMonth")}
            disabled={offset === 0}
            onClick={() => setOffset((value) => Math.max(0, value - 1))}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-line transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="chevron-down" size={16} className="-rotate-90" />
          </button>
          <button
            type="button"
            aria-label={t("common.nextMonth")}
            disabled={offset >= STAY_MONTH_HORIZON - VISIBLE_MONTHS}
            onClick={() =>
              setOffset((value) =>
                Math.min(STAY_MONTH_HORIZON - VISIBLE_MONTHS, value + 1),
              )
            }
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-line transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="chevron-down" size={16} className="rotate-90" />
          </button>
        </div>
      </div>

      <StayCalendarGrid
        columns={2}
        range={draft}
        onChange={setDraft}
        reserved={reserved}
        propertyId={propertyId}
        months={stayMonths(offset, VISIBLE_MONTHS)}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-muted pt-4">
        <StayCalendarLegend />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDraft({})}
            className="cursor-pointer text-sm text-ink-subtle transition-colors hover:text-ink"
          >
            {t("reserve.clearStay")}
          </button>
          <button
            type="button"
            disabled={!complete}
            onClick={() => complete && onConfirm(complete)}
            className="h-10 cursor-pointer rounded-10 bg-action px-5 text-sm font-medium text-on-action transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:bg-line-strong disabled:hover:bg-line-strong"
          >
            {t("reserve.pickDatesCta")}
            {nights
              ? ` (${t("reserve.nights", { count: Number(nights) })})`
              : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StayDatePanel;
