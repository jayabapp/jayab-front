import type { PriceSummaryProps } from "@/types/components/modules/property-booking";

import formatToman from "@/helpers/formatToman";
import _STRINGS from "@/utils/LocalStrings";

const ROW_CLASS =
  "flex items-center justify-between gap-3 text-sm text-neutral-800";

const PriceSummary = ({ isRefreshing, quote }: PriceSummaryProps) => (
  <div
    className={`flex flex-col gap-2 transition-opacity ${isRefreshing ? "opacity-60" : ""}`}
  >
    <div className={ROW_CLASS}>
      <span>
        {quote.nights} {_STRINGS.NIGHTS_OF_STAY}
      </span>
      <span>{formatToman(quote.rent_total)}</span>
    </div>

    {quote.extra_guests > 0 ? (
      <div className={ROW_CLASS}>
        <span>
          {quote.extra_guests} {_STRINGS.EXTRA_GUESTS_LABEL} × {quote.nights}{" "}
          {_STRINGS.NIGHT}
        </span>
        <span>{formatToman(quote.extra_guest_total)}</span>
      </div>
    ) : null}

    {quote.cleaning_fee > 0 ? (
      <div className={ROW_CLASS}>
        <span>{_STRINGS.CLEANING_ONCE}</span>
        <span>{formatToman(quote.cleaning_fee)}</span>
      </div>
    ) : null}

    <div className="flex items-center justify-between gap-3 border-t border-neutral-200 pt-3 text-base font-bold text-neutral-900">
      <span>{_STRINGS.APPROX_STAY_COST}</span>
      <span>{formatToman(quote.total)}</span>
    </div>
  </div>
);

export default PriceSummary;
