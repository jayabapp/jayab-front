/* eslint-disable react-hooks/exhaustive-deps -- The memoized day renderer intentionally keys calculations to date-span values used by the legacy selection contract. */

import type { ReservationDayProps } from "@/types/components/modules/reservation-date-picker";
import { memo, useCallback, useMemo } from "react";
import { toast } from "sonner";

import _STRINGS from "@/utils/LocalStrings";
import DayPricePart from "./DayPricePart";
import Notify from "@elements/Toast";
import moment from "moment-jalaali";

const RESERVED_DATE_TOAST_ID = "reserved-date";

const Day = memo(
  ({
    data,
    year,
    month,
    today,
    onSelect,
    dateSpan,
    setDateSpan,
    selectedDayId,
    maxSpanLength,
    forbiden_dates,
    freeDaysOfMonth,
    smallerDateFonts,
  }: ReservationDayProps) => {
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

    const hasOtherForbiddenInRange = useCallback(
      (
        startDate: moment.Moment,
        endDate: moment.Moment,
        excludeDate: moment.Moment,
      ): boolean => {
        if (!forbiden_dates?.length) return false;
        const minDate = startDate.clone().startOf("day");
        const maxDate = endDate.clone().startOf("day");
        const excludeDay = excludeDate.clone().startOf("day");
        return forbiden_dates.some((forbiddenDate) => {
          const forbidden = moment(forbiddenDate).startOf("day");
          return (
            forbidden.isBetween(minDate, maxDate, "day", "[]") &&
            !forbidden.isSame(excludeDay, "day")
          );
        });
      },
      [forbiden_dates],
    );

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
      const isForbidden = isDateForbidden(momentDate);
      const prevMomentDate = momentDate.clone().subtract(1, "day");
      const isPrevForbidden = isDateForbidden(prevMomentDate);
      const isForbiddenSpanStart = isForbidden && !isPrevForbidden;
      const isAfterForbiddenSpan = !isForbidden && isPrevForbidden;

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
        if (isInSpan && forbiden_dates?.length)
          isPartOfForbiddenSpan = hasForbiddenInRange(start, end);
      } else if (dateSpan?.start && !dateSpan?.end) {
        const start = moment(dateSpan.start);
        const current = moment(jsDate);
        isSpanStart = current.isSame(start, "day");
        isInSpan = isSpanStart;

        const rangeStart = current.isBefore(start) ? current : start;
        const rangeEnd = current.isBefore(start) ? start : current;
        if (maxSpanLength) {
          const daysBetween = Math.abs(current.diff(start, "days"));
          isExceedsMaxSpan = daysBetween + 1 > maxSpanLength;

          let wouldIncludeForbidden = false;
          if (!current.isSame(start, "day")) {
            if (isForbiddenSpanStart) {
              wouldIncludeForbidden = hasOtherForbiddenInRange(
                rangeStart,
                rangeEnd,
                current,
              );
            } else {
              wouldIncludeForbidden = hasForbiddenInRange(rangeStart, rangeEnd);
            }
          }
          isValidForSelection =
            !isExceedsMaxSpan &&
            !current.isSame(start, "day") &&
            !current.isBefore(moment(new Date()), "day") &&
            (!isForbidden || isForbiddenSpanStart) &&
            !wouldIncludeForbidden;
        } else {
          let wouldIncludeForbidden = false;
          if (!current.isSame(start, "day")) {
            if (isForbiddenSpanStart) {
              wouldIncludeForbidden = hasOtherForbiddenInRange(
                rangeStart,
                rangeEnd,
                current,
              );
            } else {
              wouldIncludeForbidden = hasForbiddenInRange(rangeStart, rangeEnd);
            }
          }
          isValidForSelection =
            !current.isSame(start, "day") &&
            !current.isBefore(moment(new Date()), "day") &&
            (!isForbidden || isForbiddenSpanStart) &&
            !wouldIncludeForbidden;
        }
      }

      return {
        isBefore: freeDaysOfMonth ? false : momentDate.isBefore(),
        isFriday: momentDate.day() === 5,
        isToday:
          today?.day === data.id &&
          today?.month === month &&
          today?.year === year,
        isSelected:
          selectedDayId?.day === data.id &&
          selectedDayId?.month === month &&
          selectedDayId?.year === year,
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
      hasOtherForbiddenInRange,
    ]);

    const handleSpanSelection = useCallback(() => {
      if (!setDateSpan || !dateInfo.jsDate) return;
      if (dateInfo.isForbidden && !dateInfo.isForbiddenSpanStart) return;
      setDateSpan((prev) => {
        if (!prev.start) {
          if (dateInfo.isForbiddenSpanStart) return prev;
          return { start: dateInfo.jsDate, end: null };
        }

        if (prev.start && !prev.end) {
          if (moment(prev.start).isSame(moment(dateInfo.jsDate), "day"))
            return { start: null, end: null };
          const startMoment = moment(prev.start);
          const clickedMoment = moment(dateInfo.jsDate);
          const rangeStart = clickedMoment.isBefore(startMoment)
            ? clickedMoment
            : startMoment;
          const rangeEnd = clickedMoment.isBefore(startMoment)
            ? startMoment
            : clickedMoment;

          let containsForbidden: boolean;
          if (dateInfo.isForbiddenSpanStart) {
            containsForbidden = hasOtherForbiddenInRange(
              rangeStart,
              rangeEnd,
              clickedMoment,
            );
          } else {
            containsForbidden = hasForbiddenInRange(rangeStart, rangeEnd);
          }
          if (containsForbidden) return { start: prev.start, end: null };
          const daysBetween =
            Math.abs(clickedMoment.diff(startMoment, "days")) + 1;

          if (maxSpanLength && daysBetween > maxSpanLength)
            return { start: dateInfo.jsDate, end: null };
          if (clickedMoment.isBefore(startMoment))
            return { start: dateInfo.jsDate, end: prev.start };
          return { start: prev.start, end: dateInfo.jsDate };
        }
        if (dateInfo.isForbiddenSpanStart) return prev;
        return { start: dateInfo.jsDate, end: null };
      });
    }, [
      setDateSpan,
      dateInfo.jsDate,
      dateInfo.isForbidden,
      dateInfo.isForbiddenSpanStart,
      maxSpanLength,
      hasForbiddenInRange,
      hasOtherForbiddenInRange,
    ]);

    const handleClick = useCallback(() => {
      toast.dismiss(RESERVED_DATE_TOAST_ID);
      if (
        dateInfo.isForbidden &&
        !(!!dateSpan?.start && !!dateInfo?.isForbiddenSpanStart)
      ) {
        Notify({
          body: _STRINGS.DATE_IS_FILLED,
          type: "warn",
          id: RESERVED_DATE_TOAST_ID,
          duration: 3000,
          loop: false,
        });

        return;
      }
      if (!dateInfo.jsDate || (dateInfo.isBefore && !dateInfo?.isToday)) return;
      if (setDateSpan) handleSpanSelection();
      if (onSelect && (!dateInfo.isBefore || dateInfo.isToday))
        onSelect(data || null);
    }, [
      onSelect,
      data,
      dateInfo.isBefore,
      dateInfo.isToday,
      dateInfo.jsDate,
      setDateSpan,
      handleSpanSelection,
      dateInfo.isForbidden,
      dateInfo.isForbiddenSpanStart,
      dateSpan?.start,
    ]);

    const containerClasses = useMemo(() => {
      const baseClasses =
        "aspect-square m-0.5 md:m-1 rounded-lg relative overflow-hidden";
      let bgClass = "bg-white border border-neutral-200";
      if (dateInfo.isBefore && !dateInfo.isToday) {
        bgClass = "bg-neutral-300 opacity-50";
      } else if (dateInfo.isForbidden && !dateInfo?.isSpanEnd) {
        if (dateInfo.isForbiddenSpanStart) {
          if (
            !!dateSpan?.start &&
            !dateSpan?.end &&
            dateInfo?.isValidForSelection
          ) {
            bgClass = "bg-green-100/20 border border-green-300";
          } else bgClass = " opacity-60  half-striped-top ";
        } else {
          bgClass = " striped opacity-60";
        }
      } else if (dateInfo.isValidForSelection) {
        bgClass = "bg-green-100/20 border border-green-300";
      } else if (dateInfo.isExceedsMaxSpan) {
        bgClass = "cursor-pointer";
      } else if (dateInfo.isInSpan) {
        if (dateInfo.isSpanStart) bgClass = "bg-brand-600 !m-0 !rounded-l-none";
        else if (dateInfo.isSpanEnd)
          bgClass = "bg-brand-600 !m-0 !rounded-r-none";
        else if (dateInfo.isBetweenSpan)
          bgClass = "!rounded-none bg-brand-600/10 !m-0";
      } else if (dateInfo.isAfterForbiddenSpan) {
        bgClass = " opacity-60  half-striped-bottom ";
      }

      const canBeSpanEnd =
        dateInfo.isForbiddenSpanStart &&
        !!dateSpan?.start &&
        !dateSpan?.end &&
        dateInfo.isValidForSelection;
      const cursorClass =
        (onSelect || setDateSpan) &&
        (!dateInfo.isForbidden || canBeSpanEnd) &&
        !dateInfo.isPartOfForbiddenSpan
          ? "cursor-pointer"
          : "cursor-not-allowed";

      if (
        dateInfo.isExceedsMaxSpan ||
        dateInfo.isForbidden ||
        dateInfo.isPartOfForbiddenSpan
      ) {
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
      dateSpan,
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

      if (
        dateInfo.isSelected &&
        !dateInfo.isInSpan &&
        !dateInfo.isForbidden &&
        !dateInfo.isPartOfForbiddenSpan
      ) {
        classes.push("!bg-neutral-500 rounded-lg");
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
      if (smallerDateFonts) classes.push("text-sm");
      else classes.push("text-base");
      if (dateInfo.isForbidden && !dateInfo?.isSpanEnd) {
        classes.push("text-neutral-500");
      } else if (dateInfo.isFriday) {
        classes.push("text-red-700");
      } else if (dateInfo.isBefore && !dateInfo.isToday) {
        classes.push("text-neutral-500");
      } else if (dateInfo.isValidForSelection) {
        classes.push("text-green-800 font-semibold");
      } else if (dateInfo.isInSpan) {
        if (dateInfo.isSpanStart || dateInfo.isSpanEnd)
          classes.push("text-white font-bold");
        else if (dateInfo.isBetweenSpan) classes.push("text-neutral-900");
      } else if (dateInfo.isAfterForbiddenSpan) {
        classes.push("text-neutral-800");
      } else if (dateInfo.isSelected) {
        classes.push("text-white");
      } else {
        classes.push("text-neutral-800");
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

    if (!data) return null;

    return (
      <div
        className={containerClasses}
        onClick={handleClick}
        role={
          (onSelect || setDateSpan) &&
          !dateInfo.isForbidden &&
          !dateInfo.isPartOfForbiddenSpan
            ? "button"
            : "button"
        }
        tabIndex={
          (onSelect || setDateSpan) &&
          !dateInfo.isForbidden &&
          !dateInfo.isPartOfForbiddenSpan
            ? 0
            : -1
        }
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
          dateInfo.isPartOfForbiddenSpan
            ? "Part of span containing forbidden dates"
            : ""
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
          {dateInfo.isToday &&
            !dateInfo.isForbidden &&
            !dateInfo.isPartOfForbiddenSpan && (
              <div className="absolute top-0.5 md:top-1 w-1.5 h-1.5 bg-brand-600 rounded-full" />
            )}

          {/* Memo indicator */}
          {dateInfo.hasMemo &&
            !dateInfo.isExceedsMaxSpan &&
            !dateInfo.isForbidden &&
            !dateInfo.isPartOfForbiddenSpan && (
              <div
                className={`absolute left-1 top-1 w-1.5 h-1.5 aspect-square rounded-full ${
                  dateInfo.isInSpan &&
                  (dateInfo.isSpanStart || dateInfo.isSpanEnd)
                    ? "bg-white"
                    : dateInfo.isValidForSelection
                      ? "bg-green-600"
                      : "bg-success-600"
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
                className="absolute bottom-1 left-0 right-0 mx-auto h-1 w-2/3 bg-neutral-500 rounded-full"
                aria-label="Peak day"
              />
            )}

          {/* Day number */}
          <p className={dateTextClasses}>{data.id}</p>

          {data.price &&
            !dateInfo.isInSpan &&
            !dateInfo.isExceedsMaxSpan &&
            !dateInfo.isValidForSelection &&
            !dateInfo.isForbidden &&
            !dateInfo.isPartOfForbiddenSpan && <DayPricePart data={data} />}

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

Day.displayName = "Day";

export default Day;
