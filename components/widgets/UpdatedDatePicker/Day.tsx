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
  }: DayProps) => {
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
          isValidForSelection: false, // New property to track if day is valid for span selection
          momentDate: null,
          jsDate: null,
        };
      }

      const dateString = `${year}/${month}/${data.id}`;
      const momentDate = moment(dateString, "jYYYY/jMM/jD");
      const jsDate = momentDate.toDate();

      // Check if this date is within the current span
      let isInSpan = false;
      let isSpanStart = false;
      let isSpanEnd = false;
      let isBetweenSpan = false;
      let isExceedsMaxSpan = false;
      let isValidForSelection = false; // Initialize as false

      if (dateSpan?.start && dateSpan?.end) {
        const start = moment(dateSpan.start);
        const end = moment(dateSpan.end);
        const current = moment(jsDate);

        isSpanStart = current.isSame(start, "day");
        isSpanEnd = current.isSame(end, "day");
        isBetweenSpan = current.isBetween(start, end, "day", "[]");
        isInSpan = isSpanStart || isSpanEnd || isBetweenSpan;
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
          // Day is valid for selection if it doesn't exceed maxSpanLength AND it's not the same as start
          isValidForSelection =
            !isExceedsMaxSpan && !current.isSame(start, "day") && !current.isBefore(moment(new Date()), "day");
        } else {
          // If no maxSpanLength, all days are valid (except the start date itself)
          isValidForSelection = !current.isSame(start, "day") && !current.isBefore(moment(new Date()), "day");
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
        isValidForSelection, // Include in the returned object
        momentDate: momentDate,
        jsDate,
      };
    }, [data, month, year, freeDaysOfMonth, today, selectedDayId, dateSpan, maxSpanLength]);

    // Handle date span selection with maxSpanLength validation
    const handleSpanSelection = useCallback(() => {
      if (!setDateSpan || !dateInfo.jsDate) return;

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

          // Calculate span length
          const daysBetween = Math.abs(clickedMoment.diff(startMoment, "days")) + 1;

          // Check if span exceeds maxSpanLength
          if (maxSpanLength && daysBetween > maxSpanLength) {
            // If exceeds max, don't set end, just return current state
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
    }, [setDateSpan, dateInfo.jsDate, maxSpanLength]);

    // Combine click handlers
    const handleClick = useCallback(() => {
      if (!dateInfo.jsDate || (dateInfo.isBefore && !dateInfo?.isToday)) return;

      // If span selection is enabled, handle that first
      if (setDateSpan) {
        handleSpanSelection();
      }

      // Call the original onSelect if provided
      if (onSelect && (!dateInfo.isBefore || dateInfo.isToday)) {
        onSelect(data || null);
      }
    }, [onSelect, data, dateInfo.isBefore, dateInfo.isToday, dateInfo.jsDate, setDateSpan, handleSpanSelection]);

    // Memoize dynamic class names including span styles
    const containerClasses = useMemo(() => {
      const baseClasses = "aspect-square m-0.5 md:m-1 rounded-lg relative overflow-hidden";

      let bgClass = "bg-white border border-primary-border";
      if (dateInfo.isBefore && !dateInfo.isToday) {
        bgClass = "bg-primary-300 opacity-50";
      } else if (dateInfo.isValidForSelection) {
        bgClass = "bg-green-100/20 border border-green-300";
      } else if (dateInfo.isExceedsMaxSpan) {
        bgClass = " cursor-pointer";
      } else if (dateInfo.isInSpan) {
        if (dateInfo.isSpanStart) {
          bgClass = "bg-primary-700 !m-0 !rounded-l-none";
        } else if (dateInfo.isSpanEnd) {
          bgClass = "bg-primary-700 !m-0 !rounded-r-none";
        } else if (dateInfo.isBetweenSpan) {
          bgClass = "!rounded-none bg-primary-700/10 !m-0";
        }
      }

      const cursorClass = onSelect || setDateSpan ? "cursor-pointer" : "";

      if (dateInfo.isExceedsMaxSpan) {
        // Remove cursor-pointer if exceeds max span
        return `${baseClasses} ${bgClass}`.trim();
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
      dateInfo.isValidForSelection, // Add this dependency
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

      if (dateInfo.isSelected && !dateInfo.isInSpan) {
        classes.push("!bg-primary-800 rounded-lg");
      }

      return classes.filter(Boolean).join(" ");
    }, [dateInfo.isReserved, dateInfo.isSelected, dateInfo.isInSpan, data?.isActive]);

    const dateTextClasses = useMemo(() => {
      const classes = ["z-10 font-medium"];

      if (smallerDateFonts) {
        classes.push("text-sm");
      } else {
        classes.push("text-base");
      }

      if (dateInfo.isFriday) {
        classes.push("text-red-700");
      }

      if (dateInfo.isBefore && !dateInfo.isToday) {
        classes.push("text-gray-500");
      } else if (dateInfo.isValidForSelection) {
        classes.push("text-green-800 font-semibold");
      } else if (dateInfo.isExceedsMaxSpan) {
        // classes.push("text-red-600");
      } else if (dateInfo.isInSpan) {
        if (dateInfo.isSpanStart || dateInfo.isSpanEnd) {
          classes.push("text-white font-bold");
        } else if (dateInfo.isBetweenSpan) {
          classes.push("text-primary-text");
        }
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
      dateInfo.isValidForSelection, // Add this dependency
    ]);

    // Don't render anything if no data
    if (!data) return null;

    return (
      <div
        className={containerClasses}
        onClick={handleClick}
        role={(onSelect || setDateSpan) && !dateInfo.isExceedsMaxSpan ? "button" : "button"}
        tabIndex={(onSelect || setDateSpan) && !dateInfo.isExceedsMaxSpan ? 0 : 0}
        onKeyDown={(e) => {
          if ((onSelect || setDateSpan) && e.key === "Enter" && !dateInfo.isBefore) {
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
        >
          {/* Today indicator */}
          {dateInfo.isToday && <div className="absolute top-0.5 md:top-1 w-1.5 h-1.5 bg-primary-700 rounded-full" />}

          {/* Memo indicator */}
          {dateInfo.hasMemo && !dateInfo.isExceedsMaxSpan && (
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
          {dateInfo.isPeak && !dateInfo.isInSpan && !dateInfo.isExceedsMaxSpan && !dateInfo.isValidForSelection && (
            <div
              className="absolute bottom-1 left-0 right-0 mx-auto h-1 w-2/3 bg-primary-800 rounded-full"
              aria-label="Peak day"
            />
          )}

          {/* Day number */}
          <p className={dateTextClasses}>{data.id}</p>

          {/* Price part - only render if price exists and not in span mode */}
          {data.price && !dateInfo.isInSpan && !dateInfo.isExceedsMaxSpan && !dateInfo.isValidForSelection && (
            <DayPricePart data={data} />
          )}

          {/* Span start/end indicators */}
          {(dateInfo.isSpanStart || dateInfo.isSpanEnd) && !dateInfo.isExceedsMaxSpan && (
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
