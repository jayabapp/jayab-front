"use client";

import { formatJalaliWeekdayDay } from "@features/reservations/mappers/reservation-dates";
import type { StayDateSheetProps } from "@/types/components/modules/property-booking";
import { STAY_MONTH_HORIZON } from "@features/reservations/lib/stay-months";
import { isCompleteRange } from "@features/reservations/lib/stay-range";
import type { StayRange } from "@features/reservations/lib/stay-range";
import { nightsBetween } from "@features/reservations/lib/stay-range";
import { stayMonths } from "@features/reservations/lib/stay-months";
import { useEffect, useMemo, useState } from "react";

import StayCalendarGrid from "./StayCalendarGrid.client";
import FullScreenSheet from "./FullScreenSheet.client";
import StayCalendarLegend from "./StayCalendarLegend";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";

const DateSummary = ({
  label,
  value,
}: {
  label: string;
  value?: Date | null;
}) => (
  <div className="flex flex-1 flex-col gap-0.5">
    <span className="text-xs text-neutral-500">{label}</span>
    <span
      className={`text-sm ${value ? "font-semibold text-neutral-900" : "text-neutral-400"}`}
    >
      {value ? formatJalaliWeekdayDay(value) : _STRINGS.EMPTY_DATE}
    </span>
  </div>
);

const StayDateSheetBody = ({
  initial,
  onClose,
  reserved,
  onConfirm,
  propertyId,
}: Omit<StayDateSheetProps, "show">) => {
  const [draft, setDraft] = useState<StayRange>(initial);
  const months = useMemo(() => stayMonths(0, STAY_MONTH_HORIZON), []);

  useEffect(() => {
    if (!initial.start) return;
    const key = `${moment(initial.start).jYear()}-${moment(initial.start).jMonth() + 1}`;
    document
      .querySelector(`[data-stay-month="${key}"]`)
      ?.scrollIntoView({ block: "start" });
  }, [initial.start]);

  const complete = isCompleteRange(draft) ? draft : null;
  const nights = complete ? nightsBetween(complete.start, complete.end) : 0;

  return (
    <FullScreenSheet
      show
      onHide={onClose}
      title={_STRINGS.TRIP_DATE}
      footer={
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <DateSummary label={_STRINGS.CHECKIN_DATE} value={draft.start} />
            <DateSummary label={_STRINGS.CHECKOUT_DATE} value={draft.end} />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDraft({})}
              className="h-11 cursor-pointer rounded-10 border border-neutral-200 px-5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              {_STRINGS.CLEAR_STAY}
            </button>
            <button
              type="button"
              disabled={!complete}
              onClick={() => complete && onConfirm(complete)}
              className="h-11 flex-1 cursor-pointer rounded-10 bg-brand-600 text-base font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:hover:bg-neutral-300"
            >
              {_STRINGS.PICK_DATES_CTA}
              {nights ? ` (${nights} ${_STRINGS.NIGHT})` : ""}
            </button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <StayCalendarLegend />
        <StayCalendarGrid
          lazy
          range={draft}
          months={months}
          onChange={setDraft}
          reserved={reserved}
          propertyId={propertyId}
        />
      </div>
    </FullScreenSheet>
  );
};

const StayDateSheet = ({ show, ...props }: StayDateSheetProps) =>
  show ? <StayDateSheetBody {...props} /> : null;

export default StayDateSheet;
