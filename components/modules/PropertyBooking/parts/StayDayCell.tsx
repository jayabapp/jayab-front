import type { StayDayCellProps } from "@/types/components/modules/property-booking";

const BASE =
  "relative flex h-14 w-full flex-col items-center justify-center gap-0.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus";

const STATE_CLASS = {
  end: "rounded-10 bg-action text-on-action",
  idle: "rounded-10 text-ink hover:bg-surface-muted",
  middle: "bg-selected text-ink",
  start: "rounded-10 bg-action text-on-action",
} as const;

const StayDayCell = ({
  day,
  row,
  label,
  state,
  price,
  alert,
  column,
  isPeak,
  isToday,
  tooltip,
  dateKey,
  onSelect,
  disabled,
  isFriday,
  isLoading,
  onKeyDown,
  discounted,
  isReserved,
  originalPrice,
}: StayDayCellProps) => {
  const isEdge = state === "start" || state === "end";
  const blocked = disabled && !isEdge;
  const isHoliday = (isFriday || isPeak) && !isEdge && !blocked;
  const skin = isEdge
    ? STATE_CLASS[state]
    : isReserved && blocked
      ? "rounded-10 bg-surface-muted text-ink-subtle"
      : blocked
        ? "text-ink-subtle/75"
        : STATE_CLASS[state];

  const verticalClass = row === 0 ? "top-full mt-1" : "bottom-full mb-1";
  const horizontalClass =
    column === 0
      ? "start-0"
      : column === 6
        ? "end-0"
        : "left-1/2 -translate-x-1/2";
  const alertSide =
    column === undefined || column === 3
      ? "left-1/2 -translate-x-1/2"
      : column < 3
        ? "start-0"
        : "end-0";

  return (
    <div className="relative">
      {alert ? (
        <span
          role="alert"
          className={`pointer-events-none absolute z-20 w-max max-w-56 rounded-10 bg-status-danger px-3 py-1.5 text-center text-xs font-medium leading-5 text-white shadow-elevated ${verticalClass} ${alertSide}`}
        >
          {alert}
        </span>
      ) : tooltip ? (
        <span
          role="status"
          className={`pointer-events-none absolute z-10 whitespace-nowrap rounded-full bg-neutral-900 px-3 py-1 text-xs text-white shadow-elevated ${verticalClass} ${horizontalClass}`}
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
        className={`${BASE} ${skin} ${isToday && !isEdge ? "border border-line-strong bg-surface-hover" : ""} ${blocked ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isReserved && blocked ? (
          <span
            aria-hidden="true"
            className="striped absolute inset-0 rounded-10 opacity-30"
          />
        ) : null}
        <span
          className={`leading-5 ${isEdge ? "font-bold" : ""} ${isHoliday ? "text-status-danger" : ""}`}
        >
          {day}
        </span>
        {isLoading ? (
          <span
            aria-hidden="true"
            className="h-2.5 w-7 animate-pulse rounded bg-surface-muted motion-reduce:animate-none"
          />
        ) : price && !blocked ? (
          <span className="flex flex-col items-center leading-none">
            <span
              className={`text-xs ${
                isEdge
                  ? "text-on-action/80"
                  : isHoliday
                    ? "text-status-danger"
                    : discounted
                      ? "text-status-success"
                      : "text-ink-muted"
              }`}
            >
              {price}
            </span>
            {discounted && originalPrice ? (
              <s
                className={`mt-0.5 text-2xs ${isEdge ? "text-on-action/60" : "text-ink-subtle"}`}
              >
                {originalPrice}
              </s>
            ) : null}
          </span>
        ) : null}
      </button>
    </div>
  );
};

export default StayDayCell;
