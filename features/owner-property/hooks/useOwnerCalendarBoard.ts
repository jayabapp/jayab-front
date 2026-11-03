"use client";

import type { OwnerCallendarItemDto } from "@/types/features/owner-property";
import { useOwnerCalendar } from "@features/owner-property/hooks/useOwnerCalendar";
import { useMemo, useState } from "react";

import moment from "moment-jalaali";

const JALALI_DAY = "jYYYY/jMM/jD";
const MAX_SELECTABLE_DAYS = 62;

export const useOwnerCalendarBoard = (propertyId: string | number) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [span, setSpan] = useState<string>(() => moment().format(JALALI_DAY));

  const month = Number(moment(span, JALALI_DAY).format("jMM"));
  const year = Number(moment(span, JALALI_DAY).format("jYYYY"));
  const { data } = useOwnerCalendar(propertyId, year, month);
  const days = useMemo<OwnerCallendarItemDto[]>(() => data ?? [], [data]);

  const selectedDaysData = useMemo(
    () =>
      selectedDates
        .map((selectedDate) =>
          days.find(
            (entry) =>
              `${entry?.day}` ==
                moment(selectedDate, JALALI_DAY).format("jD") &&
              `${entry?.month}` ==
                moment(selectedDate, JALALI_DAY).format("jM") &&
              `${entry?.year}` ==
                moment(selectedDate, JALALI_DAY).format("jYYYY"),
          ),
        )
        .filter((entry): entry is OwnerCallendarItemDto => !!entry),
    [selectedDates, days],
  );

  const toggleDay = (date: string) =>
    setSelectedDates((previous) => {
      if (previous.includes(date))
        return previous.filter((entry) => entry !== date);
      if (previous.length >= MAX_SELECTABLE_DAYS) return previous;
      return [...previous, date];
    });

  return {
    clearSelection: () => setSelectedDates([]),
    days,
    lastSelectedDate: selectedDates[selectedDates.length - 1] || "",
    lastSelectedDayData: selectedDaysData[selectedDaysData.length - 1],
    selectedDates,
    selectedDaysData,
    setSpan,
    toggleDay,
  };
};
