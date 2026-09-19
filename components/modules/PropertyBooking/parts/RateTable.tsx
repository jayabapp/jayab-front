import type { RateTableProps } from "@/types/components/modules/property-booking";

import formatToman from "@/helpers/formatToman";
import _STRINGS from "@/utils/LocalStrings";

const RateTable = ({
  dailyPrice,
  stdCapacity,
  cleaningFee,
  extraGuestFee,
}: RateTableProps) => {
  if (!dailyPrice) return <></>;

  const rows = [
    { label: _STRINGS.WEEK_STARTER_DAYS_PRICE, price: dailyPrice.normal },
    { label: _STRINGS.WEEK_WENSDAY_PRICE, price: dailyPrice.wednesday },
    { label: _STRINGS.WEEK_THURSDAY_PRICE, price: dailyPrice.thursday },
    { label: _STRINGS.WEEK_FRIDAY_PRICE, price: dailyPrice.friday },
    { label: _STRINGS.WEEK_PEAK_PRICE, price: dailyPrice.peak },
  ].filter((row) => row.price > 0);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold text-neutral-900">
        {_STRINGS.CALENDAR_PRICES_TITLE}
      </h3>
      <dl className="flex flex-col divide-y divide-neutral-100 rounded-10 border border-neutral-200 px-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 py-2.5 text-sm"
          >
            <dt className="text-neutral-600">{row.label}</dt>
            <dd className="font-semibold text-neutral-900">
              {formatToman(row.price)}
            </dd>
          </div>
        ))}
      </dl>

      {extraGuestFee ? (
        <p className="text-xs text-neutral-500">
          {_STRINGS.EXTRA_GUESTS_LABEL}: {_STRINGS.RATE_PER_NIGHT}{" "}
          {formatToman(extraGuestFee)} ({_STRINGS.OVER_STANDARD_CAPACITY}{" "}
          {stdCapacity} {_STRINGS.PERSON})
        </p>
      ) : null}
      {cleaningFee ? (
        <p className="text-xs text-neutral-500">
          {_STRINGS.CLEANING_ONCE}: {formatToman(cleaningFee)}
        </p>
      ) : null}
    </div>
  );
};

export default RateTable;
