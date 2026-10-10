import type { StayDayCellProps } from "@/types/components/modules/property-booking";

const BASE =
  "relative flex h-[3.25rem] w-full flex-col items-center justify-center gap-0.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

const STATE_CLASS = {
  end: "rounded-10 bg-brand-600 text-white",
  idle: "rounded-10 text-neutral-900 hover:bg-neutral-100",
  middle: "bg-brand-100 text-neutral-900",
  start: "rounded-10 bg-brand-600 text-white",
} as const;

const StayDayCell = ({
  day,
  row,
  label,
  state,
  price,
  column,
  isPeak,
  tooltip,
  dateKey,
  onSelect,
  disabled,
  isFriday,
  isLoading,
  onKeyDown,
  discounted,
  isReserved,
}: StayDayCellProps) => {
  const isEdge = state === "start" || state === "end";
  const blocked = disabled && !isEdge;
  const isPlainFriday = isFriday && !isEdge && !blocked;
  const skin = isEdge
    ? STATE_CLASS[state]
    : isReserved && blocked
      ? "rounded-10 bg-neutral-100 text-neutral-400"
      : blocked
        ? "text-neutral-300"
        : STATE_CLASS[state];

  const verticalClass = row === 0 ? "top-full mt-1" : "bottom-full mb-1";
  const horizontalClass =
    column === 0
      ? "right-0"
      : column === 6
        ? "left-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <div className="relative">
      {tooltip ? (
        <span
          role="status"
          className={`pointer-events-none absolute z-10 whitespace-nowrap rounded-full bg-neutral-900 px-3 py-1 text-xs text-white shadow-glass-sm ${verticalClass} ${horizontalClass}`}
        >
          {tooltip}
        </span>
      ) : null}

      <button
        type="button"
        aria-label={label}
        onClick={onSelect}
        onKeyDown={onKeyDown}
        aria-disabled={blocked}
        data-stay-date={dateKey}
        aria-pressed={isEdge || state === "middle"}
        className={`${BASE} ${skin} ${blocked ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isReserved && blocked ? (
          <span
            aria-hidden="true"
            className="striped absolute inset-0 rounded-10 opacity-20"
          />
        ) : null}
        <span
          className={`${isEdge ? "font-bold" : ""} ${isPlainFriday ? "text-danger-500" : ""}`}
        >
          {day}
        </span>
        {isLoading ? (
          <span
            aria-hidden="true"
            className="h-2.5 w-7 animate-pulse rounded bg-neutral-100 motion-reduce:animate-none"
          />
        ) : price && !blocked ? (
          <span
            className={`text-2xs ${
              isEdge
                ? "text-brand-100"
                : discounted
                  ? "text-success-600"
                  : isPlainFriday
                    ? "text-danger-500"
                    : "text-neutral-600"
            }`}
          >
            {price}
          </span>
        ) : null}
        {isPeak && !isEdge ? (
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 size-1 rounded-full bg-warning-500"
          />
        ) : null}
      </button>
    </div>
  );
};

export default StayDayCell;
