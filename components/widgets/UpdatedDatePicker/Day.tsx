import moment from "moment-jalaali";
import { Dispatch, memo, SetStateAction, useCallback, useMemo } from "react";
import DayPricePart from "./DayPricePart";

type DayDataType = {
  id?: number | string;
  has_memo?: number | string;
  is_reserved?: number | string | boolean;
  isActive?: boolean;
  price?: number;
  discounted_price?: number;
  is_peak?: boolean;
  year?: string;
  month?: string;
};

interface DayProps {
  forbiden_dates?: Date[];
  data?: DayDataType | any;
  onSelect?: (e: DayDataType | null | any) => void | null;
  selectedDayId?: { day: number; month: string; year: string };
  today?: { day: number; month: string; year: string };
  month?: string;
  year?: string;
  maxSpanLength?: number;
  showTimeOfTheDay?: boolean;
  freeDaysOfMonth?: boolean;
  smallerDateFonts?: boolean;
  dateSpan?: {
    start: Date | null;
    end: Date | null;
  };
  setDateSpan?: Dispatch<
    SetStateAction<{
      start: Date | null;
      end: Date | null;
    }>
  >;
}

const Day = memo(
  ({
    data,
    onSelect,
    selectedDayId,
    month,
    year,
    freeDaysOfMonth,
    today,
    smallerDateFonts,
    dateSpan,
    setDateSpan,
    maxSpanLength,
    forbiden_dates,
  }: DayProps) => {
    // Helper function to check if a date is forbidden
    const isDateForbidden = useCallback(
      (dateToCheck: moment.Moment | null) => {
        if (!dateToCheck || !forbiden_dates?.length) return false;

        return forbiden_dates.some((forbiddenDate) => {
          const forbiddenMoment = moment(forbiddenDate);
          return dateToCheck.isSame(forbiddenMoment, "day");
        });
      },
      [forbiden_dates],
    );

    // Helper function to check if a date range contains any forbidden dates
    const hasForbiddenInRange = useCallback(
      (startDate: moment.Moment, endDate: moment.Moment): boolean => {
        if (!forbiden_dates?.length) return false;

        const minDate = startDate.clone().startOf("day");
        const maxDate = endDate.clone().startOf("day");

        return forbiden_dates.some((forbiddenDate) => {
          const forbidden = moment(forbiddenDate).startOf("day");
          return forbidden.isBetween(minDate, maxDate, "day", "[]");
        });
      },
      [forbiden_dates],
    );

    // Helper function to find the nearest valid date when selection includes forbidden dates
    const findNearestValidEndDate = useCallback(
      (startDate: moment.Moment, clickedDate: moment.Moment): moment.Moment | null => {
        if (!forbiden_dates?.length) return clickedDate;

        const isMovingForward = clickedDate.isAfter(startDate);
        let currentDate = clickedDate.clone();
        let step = isMovingForward ? -1 : 1; // Move backwards if going forward, forwards if going backwards

        // Find the nearest date that doesn't create a span with forbidden dates
        let foundValid = false;
        let attempts = 0;
        const maxAttempts = 365; // Prevent infinite loop

        while (!foundValid && attempts < maxAttempts) {
          const minDate = isMovingForward ? startDate : currentDate;
          const maxDate = isMovingForward ? currentDate : startDate;

          if (!hasForbiddenInRange(minDate, maxDate)) {
            foundValid = true;
            return currentDate;
          }

          currentDate.add(step, "days");
          attempts++;

          // Don't go before start date
          if (isMovingForward && currentDate.isBefore(startDate)) {
            return null;
          }
          // Don't go after clicked date when moving backwards
          if (!isMovingForward && currentDate.isAfter(clickedDate)) {
            return null;
          }
        }

        return foundValid ? currentDate : null;
      },
      [forbiden_dates, hasForbiddenInRange],
    );

    // Memoize date calculations including span logic
    const dateInfo = useMemo(() => {
      if (!data?.id || !month || !year) {
        return {
          isBefore: false,
          isFriday: false,
          isToday: false,
          isSelected: false,
          isReserved: false,
          hasMemo: false,
          isPeak: false,
          isInSpan: false,
          isSpanStart: false,
          isSpanEnd: false,
          isBetweenSpan: false,
          isExceedsMaxSpan: false,
          isValidForSelection: false,
          isForbidden: false,
          isForbiddenSpanStart: false,
          isAfterForbiddenSpan: false,
          isPartOfForbiddenSpan: false,
          momentDate: null,
          jsDate: null,
        };
      }

      const dateString = `${year}/${month}/${data.id}`;
      const momentDate = moment(dateString, "jYYYY/jMM/jD");
      const jsDate = momentDate.toDate();

      // Check if this date is forbidden
      const isForbidden = isDateForbidden(momentDate);

      // Detect span boundaries:
      // First date of a consecutive forbidden span:
      //   this date IS forbidden AND the previous day is NOT forbidden
      const prevMomentDate = momentDate.clone().subtract(1, "day");
      const isPrevForbidden = isDateForbidden(prevMomentDate);
      const isForbiddenSpanStart = isForbidden && !isPrevForbidden;

      // Date right after the end of a consecutive forbidden span:
      //   this date is NOT forbidden AND the previous day IS forbidden
      const isAfterForbiddenSpan = !isForbidden && isPrevForbidden;

      // Check if this date is within the current span
      let isInSpan = false;
      let isSpanStart = false;
      let isSpanEnd = false;
      let isBetweenSpan = false;
      let isExceedsMaxSpan = false;
      let isValidForSelection = false;
      let isPartOfForbiddenSpan = false;

      if (dateSpan?.start && dateSpan?.end) {
        const start = moment(dateSpan.start);
        const end = moment(dateSpan.end);
        const current = moment(jsDate);

        isSpanStart = current.isSame(start, "day");
        isSpanEnd = current.isSame(end, "day");
        isBetweenSpan = current.isBetween(start, end, "day", "[]");
        isInSpan = isSpanStart || isSpanEnd || isBetweenSpan;

        // Check if this date is part of a span that contains forbidden dates
        if (isInSpan && forbiden_dates?.length) {
          isPartOfForbiddenSpan = hasForbiddenInRange(start, end);
        }
      } else if (dateSpan?.start && !dateSpan?.end) {
        // Single date selected (waiting for end)
        const start = moment(dateSpan.start);
        const current = moment(jsDate);
        isSpanStart = current.isSame(start, "day");
        isInSpan = isSpanStart;

        // Check if this date would exceed maxSpanLength when selected as end
        if (maxSpanLength) {
          const daysBetween = Math.abs(current.diff(start, "days"));
          isExceedsMaxSpan = daysBetween + 1 > maxSpanLength;

          // Check if selecting this date would include forbidden dates
          const wouldIncludeForbidden =
            !current.isSame(start, "day") &&
            hasForbiddenInRange(current.isBefore(start) ? current : start, current.isBefore(start) ? start : current);

          // Day is valid for selection if:
          // 1. Doesn't exceed maxSpanLength
          // 2. Not the same as start
          // 3. Not before today
          // 4. NOT FORBIDDEN
          // 5. Would NOT include any forbidden dates in the range
          isValidForSelection =
            !isExceedsMaxSpan &&
            !current.isSame(start, "day") &&
            !current.isBefore(moment(new Date()), "day") &&
            !isForbidden &&
            !wouldIncludeForbidden;
        } else {
          // If no maxSpanLength, all days are valid (except start date, past dates, and forbidden dates)
          const wouldIncludeForbidden =
            !current.isSame(start, "day") &&
            hasForbiddenInRange(current.isBefore(start) ? current : start, current.isBefore(start) ? start : current);

          isValidForSelection =
            !current.isSame(start, "day") &&
            !current.isBefore(moment(new Date()), "day") &&
            !isForbidden &&
            !wouldIncludeForbidden;
        }
      }

      return {
        isBefore: freeDaysOfMonth ? false : momentDate.isBefore(),
        isFriday: momentDate.day() === 5,
        isToday: today?.day === data.id && today?.month === month && today?.year === year,
        isSelected: selectedDayId?.day === data.id && selectedDayId?.month === month && selectedDayId?.year === year,
        isReserved: Boolean(data.is_reserved),
        hasMemo: Boolean(data.has_memo),
        isPeak: Boolean(data.is_peak),
        isInSpan,
        isSpanStart,
        isSpanEnd,
        isBetweenSpan,
        isExceedsMaxSpan,
        isValidForSelection,
        isForbidden,
        isForbiddenSpanStart,
        isAfterForbiddenSpan,
        isPartOfForbiddenSpan,
        momentDate: momentDate,
        jsDate,
      };
    }, [
      data,
      month,
      year,
      freeDaysOfMonth,
      today,
      selectedDayId,
      dateSpan,
      maxSpanLength,
      isDateForbidden,
      hasForbiddenInRange,
    ]);

    // Handle date span selection with forbidden dates validation
    const handleSpanSelection = useCallback(() => {
      if (!setDateSpan || !dateInfo.jsDate) return;

      // Prevent selection if date is forbidden
      if (dateInfo.isForbidden) return;

      setDateSpan((prev) => {
        // If no start date, set start
        if (!prev.start) {
          return { start: dateInfo.jsDate, end: null };
        }

        // If start exists but no end
        if (prev.start && !prev.end) {
          if (moment(prev.start).isSame(moment(dateInfo.jsDate), "day")) {
            return { start: null, end: null };
          }

          const startMoment = moment(prev.start);
          const clickedMoment = moment(dateInfo.jsDate);

          // Determine the range that would be created
          const rangeStart = clickedMoment.isBefore(startMoment) ? clickedMoment : startMoment;
          const rangeEnd = clickedMoment.isBefore(startMoment) ? startMoment : clickedMoment;

          // Check if the range contains any forbidden dates
          const containsForbidden = hasForbiddenInRange(rangeStart, rangeEnd);

          // If range contains forbidden dates, try to find a valid end date
          if (containsForbidden) {
            return { start: prev.start, end: null };
          }

          // Calculate days between for original selection
          const daysBetween = Math.abs(clickedMoment.diff(startMoment, "days")) + 1;

          // Check if span exceeds maxSpanLength
          if (maxSpanLength && daysBetween > maxSpanLength) {
            return { start: dateInfo.jsDate, end: null };
          }

          // If clicked date is before start, swap them
          if (clickedMoment.isBefore(startMoment)) {
            return { start: dateInfo.jsDate, end: prev.start };
          }

          // Otherwise set as end
          return { start: prev.start, end: dateInfo.jsDate };
        }

        // If both exist, reset with clicked date as start
        return { start: dateInfo.jsDate, end: null };
      });
    }, [
      setDateSpan,
      dateInfo.jsDate,
      dateInfo.isForbidden,
      maxSpanLength,
      hasForbiddenInRange,
      findNearestValidEndDate,
    ]);

    // Combine click handlers
    const handleClick = useCallback(() => {
      // Don't allow clicking on forbidden dates
      if (dateInfo.isForbidden) return;
      if (!dateInfo.jsDate || (dateInfo.isBefore && !dateInfo?.isToday)) return;

      // If span selection is enabled, handle that first
      if (setDateSpan) {
        handleSpanSelection();
      }

      // Call the original onSelect if provided
      if (onSelect && (!dateInfo.isBefore || dateInfo.isToday)) {
        onSelect(data || null);
      }
    }, [
      onSelect,
      data,
      dateInfo.isBefore,
      dateInfo.isToday,
      dateInfo.jsDate,
      setDateSpan,
      handleSpanSelection,
      dateInfo.isForbidden,
    ]);

    // Memoize dynamic class names including forbidden styles
    const containerClasses = useMemo(() => {
      const baseClasses = "aspect-square m-0.5 md:m-1 rounded-lg relative overflow-hidden";

      let bgClass = "bg-white border border-primary-border";

      if (dateInfo.isForbidden) {
        if (dateInfo.isForbiddenSpanStart) {
          // First date of forbidden span: no full "striped" — half-down overlay handles it
          bgClass = " opacity-60  half-striped-top ";
        } else {
          bgClass = " striped opacity-60";
        }
      } else if (dateInfo.isPartOfForbiddenSpan) {
        bgClass = "bg-red-50 border-red-200 opacity-50";
      } else if (dateInfo.isBefore && !dateInfo.isToday) {
        bgClass = "bg-neutral-300 opacity-50";
      } else if (dateInfo.isValidForSelection) {
        bgClass = "bg-green-100/20 border border-green-300";
      } else if (dateInfo.isExceedsMaxSpan) {
        bgClass = "cursor-pointer";
      } else if (dateInfo.isInSpan) {
        if (dateInfo.isSpanStart) {
          bgClass = "bg-primary-700 !m-0 !rounded-l-none";
        } else if (dateInfo.isSpanEnd) {
          bgClass = "bg-primary-700 !m-0 !rounded-r-none";
        } else if (dateInfo.isBetweenSpan) {
          bgClass = "!rounded-none bg-primary-700/10 !m-0";
        }
      } else if (dateInfo.isAfterForbiddenSpan) {
        bgClass = " opacity-60  half-striped-bottom ";
      }

      const cursorClass =
        (onSelect || setDateSpan) && !dateInfo.isForbidden && !dateInfo.isPartOfForbiddenSpan
          ? "cursor-pointer"
          : "cursor-not-allowed";

      if (dateInfo.isExceedsMaxSpan || dateInfo.isForbidden || dateInfo.isPartOfForbiddenSpan) {
        return `${baseClasses} ${bgClass} ${cursorClass}`.trim();
      }

      return `${baseClasses} ${bgClass} ${cursorClass}`.trim();
    }, [
      dateInfo.isBefore,
      dateInfo.isToday,
      dateInfo.isInSpan,
      dateInfo.isSpanStart,
      dateInfo.isSpanEnd,
      dateInfo.isBetweenSpan,
      dateInfo.isExceedsMaxSpan,
      dateInfo.isValidForSelection,
      dateInfo.isForbidden,
      dateInfo.isForbiddenSpanStart,
      dateInfo.isAfterForbiddenSpan,
      dateInfo.isPartOfForbiddenSpan,
      onSelect,
      setDateSpan,
    ]);

    const innerDivClasses = useMemo(() => {
      const classes = [
        "text-center flex flex-col gap-0.5",
        dateInfo.isReserved ? "striped" : "",
        "relative flex items-center justify-center aspect-square",
        data?.isActive ? "border-b-2 border-white" : "",
      ];

      if (dateInfo.isSelected && !dateInfo.isInSpan && !dateInfo.isForbidden && !dateInfo.isPartOfForbiddenSpan) {
        classes.push("!bg-primary-800 rounded-lg");
      }

      return classes.filter(Boolean).join(" ");
    }, [
      dateInfo.isReserved,
      dateInfo.isSelected,
      dateInfo.isInSpan,
      dateInfo.isForbidden,
      dateInfo.isPartOfForbiddenSpan,
      data?.isActive,
    ]);

    const dateTextClasses = useMemo(() => {
      const classes = ["z-10 font-medium"];

      if (smallerDateFonts) {
        classes.push("text-sm");
      } else {
        classes.push("text-base");
      }

      if (dateInfo.isForbidden) {
        classes.push("text-gray-500");
      } else if (dateInfo.isPartOfForbiddenSpan) {
        classes.push("text-red-400 line-through");
      } else if (dateInfo.isFriday) {
        classes.push("text-red-700");
      } else if (dateInfo.isBefore && !dateInfo.isToday) {
        classes.push("text-gray-500");
      } else if (dateInfo.isValidForSelection) {
        classes.push("text-green-800 font-semibold");
      } else if (dateInfo.isInSpan) {
        if (dateInfo.isSpanStart || dateInfo.isSpanEnd) {
          classes.push("text-white font-bold");
        } else if (dateInfo.isBetweenSpan) {
          classes.push("text-primary-text");
        }
      } else if (dateInfo.isAfterForbiddenSpan) {
        classes.push("text-gray-800");
      } else if (dateInfo.isSelected) {
        classes.push("text-white");
      } else {
        classes.push("text-gray-800");
      }

      return classes.join(" ");
    }, [
      smallerDateFonts,
      dateInfo.isFriday,
      dateInfo.isBefore,
      dateInfo.isToday,
      dateInfo.isInSpan,
      dateInfo.isSpanStart,
      dateInfo.isSpanEnd,
      dateInfo.isSelected,
      dateInfo.isExceedsMaxSpan,
      dateInfo.isValidForSelection,
      dateInfo.isForbidden,
      dateInfo.isAfterForbiddenSpan,
      dateInfo.isPartOfForbiddenSpan,
    ]);

    // Don't render anything if no data
    if (!data) return null;

    return (
      <div
        className={containerClasses}
        onClick={handleClick}
        role={
          (onSelect || setDateSpan) && !dateInfo.isForbidden && !dateInfo.isPartOfForbiddenSpan ? "button" : "button"
        }
        tabIndex={(onSelect || setDateSpan) && !dateInfo.isForbidden && !dateInfo.isPartOfForbiddenSpan ? 0 : -1}
        onKeyDown={(e) => {
          if (
            (onSelect || setDateSpan) &&
            e.key === "Enter" &&
            !dateInfo.isBefore &&
            !dateInfo.isForbidden &&
            !dateInfo.isPartOfForbiddenSpan
          ) {
            handleClick();
          }
        }}
        aria-label={`Day ${data.id}, ${dateInfo.isToday ? "Today" : ""} ${dateInfo.isSelected ? "Selected" : ""} ${
          dateInfo.isSpanStart
            ? "Start of range"
            : dateInfo.isSpanEnd
              ? "End of range"
              : dateInfo.isBetweenSpan
                ? "In range"
                : ""
        } ${dateInfo.isExceedsMaxSpan ? "Exceeds maximum span length" : ""} ${
          dateInfo.isValidForSelection ? "Valid for selection" : ""
        } ${dateInfo.isForbidden ? "Forbidden - Cannot select" : ""} ${
          dateInfo.isForbiddenSpanStart ? "Start of forbidden span" : ""
        } ${dateInfo.isAfterForbiddenSpan ? "After forbidden span" : ""} ${
          dateInfo.isPartOfForbiddenSpan ? "Part of span containing forbidden dates" : ""
        }`}
      >
        <div
          className={innerDivClasses}
          data-day-id={data.id}
          data-is-today={dateInfo.isToday}
          data-is-selected={dateInfo.isSelected}
          data-is-reserved={dateInfo.isReserved}
          data-is-span-start={dateInfo.isSpanStart}
          data-is-span-end={dateInfo.isSpanEnd}
          data-is-between-span={dateInfo.isBetweenSpan}
          data-exceeds-max-span={dateInfo.isExceedsMaxSpan}
          data-is-valid-for-selection={dateInfo.isValidForSelection}
          data-is-forbidden={dateInfo.isForbidden}
          data-is-forbidden-span-start={dateInfo.isForbiddenSpanStart}
          data-is-after-forbidden-span={dateInfo.isAfterForbiddenSpan}
          data-is-part-of-forbidden-span={dateInfo.isPartOfForbiddenSpan}
        >
          {/* Today indicator */}
          {dateInfo.isToday && !dateInfo.isForbidden && !dateInfo.isPartOfForbiddenSpan && (
            <div className="absolute top-0.5 md:top-1 w-1.5 h-1.5 bg-primary-700 rounded-full" />
          )}

          {/* Part of forbidden span indicator */}
          {dateInfo.isPartOfForbiddenSpan && !dateInfo.isForbidden && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-red-300 rotate-45 absolute opacity-50" />
              <div className="w-full h-0.5 bg-red-300 -rotate-45 absolute opacity-50" />
            </div>
          )}

          {/* Memo indicator */}
          {dateInfo.hasMemo &&
            !dateInfo.isExceedsMaxSpan &&
            !dateInfo.isForbidden &&
            !dateInfo.isPartOfForbiddenSpan && (
              <div
                className={`absolute left-1 top-1 w-1.5 h-1.5 aspect-square rounded-full ${
                  dateInfo.isInSpan && (dateInfo.isSpanStart || dateInfo.isSpanEnd)
                    ? "bg-white"
                    : dateInfo.isValidForSelection
                      ? "bg-green-600"
                      : "bg-primary-600"
                }`}
                aria-label="Has memo"
              />
            )}

          {/* Peak indicator */}
          {dateInfo.isPeak &&
            !dateInfo.isInSpan &&
            !dateInfo.isExceedsMaxSpan &&
            !dateInfo.isValidForSelection &&
            !dateInfo.isForbidden &&
            !dateInfo.isPartOfForbiddenSpan && (
              <div
                className="absolute bottom-1 left-0 right-0 mx-auto h-1 w-2/3 bg-primary-800 rounded-full"
                aria-label="Peak day"
              />
            )}

          {/* Day number */}
          <p className={dateTextClasses}>{data.id}</p>

          {/* Price part - only render if price exists and not in span mode and not forbidden/blocked */}
          {data.price &&
            !dateInfo.isInSpan &&
            !dateInfo.isExceedsMaxSpan &&
            !dateInfo.isValidForSelection &&
            !dateInfo.isForbidden &&
            !dateInfo.isPartOfForbiddenSpan && <DayPricePart data={data} />}

          {/* Span start/end indicators */}
          {(dateInfo.isSpanStart || dateInfo.isSpanEnd) &&
            !dateInfo.isExceedsMaxSpan &&
            !dateInfo.isForbidden &&
            !dateInfo.isPartOfForbiddenSpan && (
              <div className="absolute -bottom-1 left-0 right-0 mx-auto w-3 h-0.5 bg-white rounded-full" />
            )}
        </div>
      </div>
    );
  },
);

// Add display name for better debugging
Day.displayName = "Day";

export default Day;
