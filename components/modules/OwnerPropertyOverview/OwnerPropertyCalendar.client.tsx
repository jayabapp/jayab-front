"use client";

import { useOwnerCalendarBoard } from "@features/owner-property/hooks/useOwnerCalendarBoard";
import type { OwnerPropertyViewProps } from "@/types/components/modules/owner-property";
import { PropertyCalendarLegend } from "@modules/PropertyAvailability";
import { useEffect } from "react";

import OwnerDayCommissionAction from "./parts/OwnerDayCommissionAction.client";
import OwnerDayStatusAction from "./parts/OwnerDayStatusAction.client";
import OwnerDayPriceAction from "./parts/OwnerDayPriceAction.client";
import OwnerDayNoteAction from "./parts/OwnerDayNoteAction.client";
import Callender from "@/components/widgets/DatePicker/callender";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const CALENDAR_ANCHOR = "owner-calendar";

const OwnerPropertyCalendar = ({ property }: OwnerPropertyViewProps) => {
  const board = useOwnerCalendarBoard(property?.id ?? "");

  useEffect(() => {
    if (window.location.hash !== `#${CALENDAR_ANCHOR}`) return;
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(CALENDAR_ANCHOR)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const selection = {
    property,
    selectedDates: board.selectedDates,
    selectedDaysData: board.selectedDaysData,
  };
  const singleDay = {
    day: board.lastSelectedDayData,
    isDisabled: board.selectedDates.length > 1,
    property,
  };

  return (
    <div
      id={CALENDAR_ANCHOR}
      className="order-3 scroll-mt-24 md:order-4 flex flex-col gap-4"
    >
      <Callender
        multiSelect
        active_days={[]}
        callenderData={board.days}
        onToggleDay={board.toggleDay}
        selectedDays={board.selectedDates}
        setChosenDateState={board.setSpan}
        selectedDate={board.lastSelectedDate}
      />

      <PropertyCalendarLegend />

      <div className="w-full flex items-center justify-between gap-2">
        <p className="text-xs">{_STRINGS.SELECT_DAYS_TO_GO_ON}</p>
        {board.selectedDates.length > 0 ? (
          <Button
            variant="outline"
            width="!py-1 !px-3"
            roundedClass="rounded-full"
            onClick={board.clearSelection}
            title={`${_STRINGS.CLEAR_SELECTION} (${board.selectedDates.length})`}
          />
        ) : null}
      </div>

      <div className="w-full grid gap-2 grid-cols-2">
        <OwnerDayStatusAction {...selection} />
        <OwnerDayPriceAction {...selection} />
        <OwnerDayCommissionAction {...singleDay} />
        <OwnerDayNoteAction {...singleDay} />
      </div>
    </div>
  );
};

export default OwnerPropertyCalendar;
