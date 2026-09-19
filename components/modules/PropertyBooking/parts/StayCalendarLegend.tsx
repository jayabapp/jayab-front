import _STRINGS from "@/utils/LocalStrings";

const StayCalendarLegend = () => (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-neutral-500">
    <span className="flex items-center gap-2">
      <span className="relative size-4 overflow-hidden rounded-md bg-neutral-100">
        <span
          aria-hidden="true"
          className="striped absolute inset-0 opacity-20"
        />
      </span>
      {_STRINGS.RESERVED_DAYS}
    </span>
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-warning-500"
      />
      {_STRINGS.PEAK_DAYS}
    </span>
    <span>{_STRINGS.PRICE_UNIT_HINT}</span>
  </div>
);

export default StayCalendarLegend;
